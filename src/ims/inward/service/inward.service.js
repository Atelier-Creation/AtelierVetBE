// services/inward.service.js
import { Op } from "sequelize";
import { sequelize } from "../../../db/index.js"; // your sequelize instance
import Inward from "../models/inward.model.js";
import InwardItem from "../models/inwarditeam.model.js";
import Product from '../../product/models/product.model.js';
import Stock from '../../stock/models/stock.models.js';
import Order from '../../order/models/order.models.js';
import OrderItem from '../../order/models/orderiteam.models.js';

const inwardService = {
 async createInwardWithItems(data) {
  return await sequelize.transaction(async (t) => {
    // 1️⃣ Generate inward_no automatically
    const lastInward = await Inward.findOne({
      order: [["createdAt", "DESC"]],
      transaction: t,
    });

    const lastNo = lastInward
      ? parseInt((lastInward.inward_no || "").split("-")[1], 10) || 1000
      : 1000;
    const inwardNo = `INV-${lastNo + 1}`;

    if (!data.items || data.items.length === 0) {
      throw new Error("Inward must have at least one item");
    }

    let totalAmount = 0;
    let totalQuantity = 0;
    let totalUnusedQuantity = 0;
    let totalExcessQuantity = 0;
    const itemsToCreate = [];

    // Fetch order once (if provided)
    const order = data.order_id
      ? await Order.findByPk(data.order_id, { transaction: t })
      : null;

    // Throw error if order is already completed
    if (order && order.status === "completed") {
      throw new Error("This order is already completed");
    }

    for (let i = 0; i < data.items.length; i++) {
      const item = data.items[i];

      // Ensure numeric values
      const quantity = Number(item.quantity || 0);
      const unitPrice = Number(item.unit_price || 0);
      const totalPrice =
        item.total_price !== undefined ? Number(item.total_price) : quantity * unitPrice;
      const unusedQuantity =
        item.unused_quantity !== undefined ? Number(item.unused_quantity) : quantity;

      // Check product exists
      const product = await Product.findByPk(item.product_id, { transaction: t });
      if (!product) {
        throw new Error(`Product with ID ${item.product_id} does not exist`);
      }

      let excessQuantity = 0;

      if (order) {
        // Get corresponding order item
        const orderItem = await OrderItem.findOne({
          where: { order_id: data.order_id, product_id: item.product_id },
          transaction: t,
        });

        if (!orderItem) {
          throw new Error(`Order item for product ${product.name || product.product_name} not found`);
        }

        const pendingQuantity = Number(orderItem.pending_quantity || 0);
        // How much of received quantity should reduce pending (can't reduce more than pending)
        const reduceBy = Math.min(quantity, pendingQuantity);
        // Excess is the part above pending
        excessQuantity = Math.max(quantity - pendingQuantity, 0);

        // Update order item pending quantity safely
        const newPendingQuantity = Math.max(pendingQuantity - reduceBy, 0);
        await orderItem.update({ pending_quantity: newPendingQuantity }, { transaction: t });

        // (Important) Do NOT rely on any potentially stale order.total_penning_quantity here — we'll recompute it after loop
      }

      // Accumulate totals
      totalAmount += totalPrice;
      totalQuantity += quantity;
      totalUnusedQuantity += unusedQuantity;
      totalExcessQuantity += excessQuantity;

      itemsToCreate.push({
        product_id: item.product_id,
        quantity,
        unit_price: unitPrice,
        total_price: totalPrice,
        unused_quantity: unusedQuantity,
        excess_quantity: excessQuantity,
        unit: item.unit || product.unit,
        expiry_date: item.expiry_date || null,
        batch_number: item.batch_number || `BATCH-${String(i + 1).padStart(3, "0")}`,
      });

      // 3️⃣ Update Stock Table (within transaction)
      const stock = await Stock.findOne({
        where: { product_id: item.product_id },
        transaction: t,
      });

      if (stock) {
        stock.quantity = Number(stock.quantity || 0) + quantity;
        stock.inward_quantity = Number(stock.inward_quantity || 0) + quantity;
        await stock.save({ transaction: t });
      } else {
        await Stock.create(
          {
            product_id: product.id,
            unit: product.unit,
            cost_price: product.purchase_price,
            selling_price: product.selling_price,
            quantity,
            inward_quantity: quantity,
          },
          { transaction: t }
        );
      }
    } // end for loop

    // --------------------
    // IMPORTANT FIX:
    // Recompute order.total_penning_quantity from OrderItem rows (single source of truth)
    // --------------------
    if (order) {
      // Sum pending_quantity from order items (Sequelize.sum returns null when no rows)
      const sumPendingRaw = await OrderItem.sum("pending_quantity", {
        where: { order_id: order.id },
        transaction: t,
      });
      const sumPending = Number(sumPendingRaw || 0);

      // Update order with the authoritative computed pending total (note field name: total_penning_quantity)
      await order.update({ total_penning_quantity: sumPending }, { transaction: t });

      // Mark order as completed only if the recomputed sum is zero
      if (sumPending === 0 && order.status !== "completed") {
        await order.update({ status: "completed" }, { transaction: t });
      } else if (sumPending > 0 && order.status === "completed") {
        // Optional safety: if order was previously completed but now has pending, reopen it
        await order.update({ status: "pending" }, { transaction: t });
      }
    }

    // 4️⃣ Create Inward
    const inward = await Inward.create(
      {
        inward_no: inwardNo,
        order_id: data.order_id || null,
        vendor_id: data.vendor_id,
        supplier_invoice: data.supplier_invoice || null,
        status: data.status || "pending",
        received_date: data.received_date || new Date(),
        remarks: data.remarks || null,
        total_amount: totalAmount,
        total_quantity: totalQuantity,
        total_unused_quantity: totalUnusedQuantity,
        total_excess_quantity: totalExcessQuantity,
        created_by: data.created_by,
        created_by_name: data.created_by_name,
        created_by_email: data.created_by_email,
      },
      { transaction: t }
    );

    // 5️⃣ Create Inward Items
    const itemsWithInwardId = itemsToCreate.map((item) => ({
      ...item,
      inward_id: inward.id,
    }));
    await InwardItem.bulkCreate(itemsWithInwardId, { transaction: t });

    // 6️⃣ Return the inward with items
    return await Inward.findByPk(inward.id, {
      include: [{ model: InwardItem, as: "items" }],
      transaction: t,
    });
  });
},




  // ✅ Get All Inwards with Filters + Pagination
  async getAllInwards({ filters = {}, limit = 10, offset = 0 } = {}) {
  const where = {};

  if (filters.inward_no) {
    where.inward_no = { [Op.like]: `%${filters.inward_no}%` };
  }
  if (filters.supplier_name) {
    where.supplier_name = { [Op.like]: `%${filters.supplier_name}%` };
  }
  if (filters.status) {
    where.status = filters.status;
  }
  if (filters.received_date) {
    where.received_date = filters.received_date;
  }

  const { count, rows } = await Inward.findAndCountAll({
    where,
    distinct: true, // ✅ important to count only distinct Inward rows
    limit,
    offset,
    order: [["createdAt", "DESC"]],
    include: [
      {
            model: Order,
            as: "order",
            attributes: ["po_no"]
          },
      {
        model: InwardItem,
        as: "items",
        attributes: [
          "id",
          "product_id",
          "quantity",
          "unit_price",
          "total_price",
          "unit",
          "expiry_date",
          "batch_number",
        ],
        include: [
          {
            model: Product,
            as: "product", // make sure this alias is defined in your model association
            attributes: ["id", "product_name", "product_code", "unit", "purchase_price", "selling_price"],
          },
          
        ],
      },
    ],
  });

  return {
    total: count, // ✅ will now show correct number of Inward records
    page: Math.floor(offset / limit) + 1,
    limit,
    data: rows,
  };
},


  // ✅ Get Inward by ID
  async getInwardById(id) {
    return await Inward.findByPk(id, {
      include: [{ model: InwardItem, as: "items" }],
    });
  },

  // ✅ Update Inward with Items
  async updateInwardWithItems(id, data) {
  return await sequelize.transaction(async (t) => {
    const inward = await Inward.findByPk(id, { transaction: t });
    if (!inward) return null;

    // 1️⃣ Update Inward basic fields
    await inward.update(
      {
        supplier_name: data.supplier_name || inward.supplier_name,
        status: data.status || inward.status,
        received_date: data.received_date || inward.received_date,
        remarks: data.remarks || inward.remarks,
        updated_by: data.updated_by,
        updated_by_name: data.updated_by_name,
        updated_by_email: data.updated_by_email,
      },
      { transaction: t }
    );

    // 2️⃣ If items are provided → replace them
    if (data.items) {
      // Delete old items
      const oldItems = await InwardItem.findAll({
        where: { inward_id: id },
        transaction: t,
      });

      // 2a. Restore pending quantities in order before deleting old items
      for (const oldItem of oldItems) {
        if (inward.order_id) {
          const orderItem = await OrderItem.findOne({
            where: { order_id: inward.order_id, product_id: oldItem.product_id },
            transaction: t,
          });
          if (orderItem) {
            const restoredPending = (orderItem.pending_quantity || 0) + oldItem.quantity;
            await orderItem.update({ pending_quantity: restoredPending }, { transaction: t });

            const order = await Order.findByPk(inward.order_id, { transaction: t });
            const newTotalPending = (order.total_pending_quantity || 0) + oldItem.quantity;
            await order.update({ total_pending_quantity: newTotalPending }, { transaction: t });
          }
        }
      }

      await InwardItem.destroy({
        where: { inward_id: id },
        transaction: t,
      });

      // 2b. Insert new items and calculate totals
      let totalAmount = 0;
      let totalQuantity = 0;
      let totalUnusedQuantity = 0;
      const itemsToCreate = [];

      for (let i = 0; i < data.items.length; i++) {
        const item = data.items[i];

        const product = await Product.findByPk(item.product_id, { transaction: t });
        if (!product) throw new Error(`Product with ID ${item.product_id} not found`);

        let excessQuantity = 0;

        if (inward.order_id) {
          const orderItem = await OrderItem.findOne({
            where: { order_id: inward.order_id, product_id: item.product_id },
            transaction: t,
          });
          if (!orderItem) throw new Error(`Order item for product ${product.name} not found`);

          const pendingQuantity = orderItem.pending_quantity || 0;
          excessQuantity = item.quantity > pendingQuantity ? item.quantity - pendingQuantity : 0;

          // Update pending quantity in order item
          const newPending = Math.max(pendingQuantity - item.quantity, 0);
          await orderItem.update({ pending_quantity: newPending }, { transaction: t });

          // Update total_pending_quantity in order
          const order = await Order.findByPk(inward.order_id, { transaction: t });
          const newTotalPending = Math.max((order.total_pending_quantity || 0) - item.quantity, 0);
          await order.update({ total_pending_quantity: newTotalPending }, { transaction: t });
        }

        const quantity = item.quantity || 0;
        const unitPrice = item.unit_price || 0;
        const totalPrice = item.total_price || quantity * unitPrice;
        const unusedQuantity = item.unused_quantity ?? quantity;

        totalAmount += totalPrice;
        totalQuantity += quantity;
        totalUnusedQuantity += unusedQuantity;

        itemsToCreate.push({
          inward_id: id,
          product_id: item.product_id,
          quantity,
          unit_price: unitPrice,
          total_price: totalPrice,
          unused_quantity: unusedQuantity,
          excess_quantity: excessQuantity,
          unit: item.unit || product.unit,
          expiry_date: item.expiry_date || null,
          batch_number: item.batch_number || `BATCH-${String(i + 1).padStart(3, "0")}`,
        });

        // Update stock table
        const stock = await Stock.findOne({ where: { product_id: item.product_id }, transaction: t });
        if (stock) {
          stock.quantity += quantity;
          stock.inward_quantity += quantity;
          await stock.save({ transaction: t });
        } else {
          await Stock.create(
            {
              product_id: product.id,
              unit: product.unit,
              cost_price: product.purchase_price,
              selling_price: product.selling_price,
              quantity,
              inward_quantity: quantity,
            },
            { transaction: t }
          );
        }
      }

      // 3️⃣ Update totals in Inward
      await inward.update(
        {
          total_amount: totalAmount,
          total_quantity: totalQuantity,
          total_unused_quantity: totalUnusedQuantity,
        },
        { transaction: t }
      );

      // 4️⃣ Insert new items
      await InwardItem.bulkCreate(itemsToCreate, { transaction: t });
    }

    // 5️⃣ Return updated Inward with items
    return await Inward.findByPk(id, {
      include: [{ model: InwardItem, as: "items" }],
      transaction: t,
    });
  });
},


  // ✅ Delete Inward with Items (soft delete)
  async deleteInwardWithItems(id, user) {
    return await db.transaction(async (t) => {
      const inward = await Inward.findByPk(id, { transaction: t });
      if (!inward) return null;

      // soft delete inward
      await inward.update(
        {
          is_active: false,
          deleted_by: user.id || null,
          deleted_by_name: user.username || user.name || null,
          deleted_by_email: user.email || null,
        },
        { transaction: t }
      );

      // soft delete inward items
      await InwardItem.update(
        { is_active: false },
        { where: { inward_id: id }, transaction: t }
      );

      return { message: "Inward and its items soft deleted successfully" };
    });
  },
};

export default inwardService;
