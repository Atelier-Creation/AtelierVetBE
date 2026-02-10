// services/return.service.js
import { Op } from "sequelize";
import { sequelize } from "../../db/index.js";

import Return from "../models/return.models.js";
import ReturnItem from "../models/returniteams.models.js"; 
import Product from '../../product/models/product.model.js';
import Stock from '../../stock/models/stock.models.js';
import Inward from '../../inward/models/inward.model.js';
import InwardItem from '../../inward/models/inwarditeam.model.js';
import Vendor from "../../vendor/models/vendor.models.js";
import "../models/index.js"; // ensure associations are set up



const returnService = {
  // Create a return with items. If status === 'processed' it will also process FIFO allocation immediately.
  async createReturnWithItems(data) {
  return await sequelize.transaction(async (t) => {
    // 1️⃣ Generate return_no
    const last = await Return.findOne({
      order: [["createdAt", "DESC"]],
      transaction: t,
    });
    const lastNo = last ? parseInt((last.return_no || "RET-1000").split("-")[1]) : 1000;
    const returnNo = `RET-${lastNo + 1}`;

    if (!data.items || !Array.isArray(data.items) || data.items.length === 0) {
      throw new Error("Return must have at least one item");
    }

    let totalAmount = 0;
    let totalQty = 0;
    let totalTax = 0;
    const itemsToCreate = [];

    // 2️⃣ Loop through items
    for (const it of data.items) {
      const product = await Product.findByPk(it.product_id, { transaction: t });
      if (!product) throw new Error(`Product with ID ${it.product_id} not found`);

      let remainingQty = Number(it.quantity || 0);
      if (remainingQty <= 0) throw new Error(`Quantity must be > 0 for product ${it.product_id}`);

      const usedInwardItemIds = [];
      let totalCost = 0;

      // 3️⃣ FIFO: find inward_items with unused_quantity > 0
      const inwardItems = await InwardItem.findAll({
        where: {
          product_id: it.product_id,
          unused_quantity: { [Op.gt]: 0 },
        },
        order: [["createdAt", "ASC"]],
        transaction: t,
      });

      for (const inwardItem of inwardItems) {
        if (remainingQty <= 0) break;

        const available = Number(inwardItem.unused_quantity || 0);
        if (available <= 0) continue;

        const takeQty = Math.min(available, remainingQty);

        // 4️⃣ Update inward_item
        const newUnused = available - takeQty;
        const newReturnQty = Number(inwardItem.return_quantity || 0) + takeQty;

        await inwardItem.update(
          {
            unused_quantity: newUnused,
            return_quantity: newReturnQty,
          },
          { transaction: t }
        );

        // 5️⃣ Update parent Inward totals
        if (inwardItem.inward_id) {
          const parentInward = await Inward.findByPk(inwardItem.inward_id, { transaction: t });
          if (parentInward) {
            const newTotalUnused = Math.max((parentInward.total_unused_quantity || 0) - takeQty, 0);
            const newTotalReturn = (parentInward.total_return_quantity || 0) + takeQty;
            await parentInward.update(
              {
                total_unused_quantity: newTotalUnused,
                total_return_quantity: newTotalReturn,
              },
              { transaction: t }
            );
          }
        }

        // 6️⃣ Update Stock
        const stock = await Stock.findOne({
          where: { product_id: it.product_id },
          transaction: t,
        });
        if (!stock) throw new Error(`Stock not found for product ${it.product_id}`);

        const newStockQty = Math.max((Number(stock.quantity || 0) - takeQty), 0);
        const newStockReturn = (Number(stock.return_quantity || 0) + takeQty);
        await stock.update(
          {
            quantity: newStockQty,
            return_quantity: newStockReturn,
          },
          { transaction: t }
        );

        // 7️⃣ Compute cost (use inward_item.unit_price)
        totalCost += takeQty * Number(inwardItem.unit_price || 0);
        usedInwardItemIds.push(inwardItem.id);
        remainingQty -= takeQty;
      }

      if (remainingQty > 0) {
        throw new Error(`Insufficient unused quantity for product ${it.product_id}`);
      }

      const totalPrice = totalCost;
      const unitPrice = Number((totalCost / it.quantity).toFixed(2));
      const tax = Number(it.tax_amount || 0);

      totalAmount += totalPrice;
      totalQty += it.quantity;
      totalTax += tax;

      // 8️⃣ Prepare ReturnItem payload
      itemsToCreate.push({
        return_id: null,
        product_id: it.product_id,
        inward_ids: usedInwardItemIds,
        quantity: it.quantity,
        unit_price: unitPrice,
        total_price: totalPrice,
        tax_amount: tax,
        reason: it.reason || null,
      });
    }

    // 9️⃣ Create Return parent record
    const createdReturn = await Return.create(
      {
        return_no: returnNo,
        reason: data.reason || null,
        total_amount: totalAmount,
        total_quantity: totalQty,
        total_tax: totalTax,
        status: data.status || "processed",
        return_date: data.return_date || new Date(),
        return_type: data.return_type || "partial",
        billing_id: data.billing_id || null,
        vendor_id: data.vendor_id,
        created_by: data.created_by || null,
        created_by_name: data.created_by_name || null,
        created_by_email: data.created_by_email || null,
      },
      { transaction: t }
    );

    // 10️⃣ Bulk insert ReturnItems
    const itemsWithReturnId = itemsToCreate.map((it) => ({
      ...it,
      return_id: createdReturn.id,
    }));

    await ReturnItem.bulkCreate(itemsWithReturnId, { transaction: t });

    // 11️⃣ Return the complete return with items
    return await Return.findByPk(createdReturn.id, {
      include: [{ model: ReturnItem, as: "items" }],
      transaction: t,
    });
  });
},


  async _processReturnById(returnId, opts = {}) {
    // if no transaction provided, create one here
    if (opts.transaction) {
      return await this._processReturnInternal(returnId, opts.transaction);
    } else {
      return await sequelize.transaction(async (t) => {
        return await this._processReturnInternal(returnId, t);
      });
    }
  },

  // Internal helper that assumes a transaction `t`
  async _processReturnInternal(returnId, t) {
  const ret = await Return.findByPk(returnId, { transaction: t });
  if (!ret) throw new Error("Return not found");
  if (ret.status === "processed") throw new Error("Return is already processed");

  const items = await ReturnItem.findAll({
    where: { return_id: returnId, is_active: true },
    include: [
      {
        model: Product,
        as: "product", // make sure the association alias is correct
        attributes: ["id", "product_name"],
      },
      // {
      //   model: InwardItem,
      //   as: "inward_items", // if you have a ReturnItem -> InwardItem relation
      //   attributes: ["id", "unit_price", "unused_quantity", "return_quantity"],
      // },
    ],
    transaction: t,
  });

  // process FIFO as before...
  for (const rItem of items) {
    let remaining = Number(rItem.quantity || 0);
    if (remaining <= 0) continue;

    const productId = rItem.product_id;
    const inwardItems = await InwardItem.findAll({
      where: {
        product_id: productId,
        unused_quantity: { [Op.gt]: 0 },
        // is_active: true,
      },
      order: [["createdAt", "ASC"]],
      transaction: t,
    });

    // ...rest of FIFO processing

    await rItem.update({ inward_ids: inwardItems.map(i => i.id) }, { transaction: t });
  }

  await ret.update({ status: "processed" }, { transaction: t });

  // Return with all includes
  return await Return.findByPk(returnId, {
    include: [
      {
        model: ReturnItem,
        as: "items",
        include: [
          { model: Product, as: "product" },
          // { model: InwardItem, as: "inward_items" },
        ],
      },
      {
        model: Vendor, // if you have a Vendor association
        as: "vendor",
        attributes: ["id", "name"],
      },
      // {
      //   model: Billing, // if you have a Billing association
      //   as: "billing",
      //   attributes: ["id", "invoice_no"],
      // },
    ],
    transaction: t,
  });
},


  async processReturnById(returnId) {
    return await this._processReturnById(returnId, {}); 
  },

  

  // List returns with pagination + simple filters
  async getAllReturns({ filters = {}, limit = 10, offset = 0 } = {}) {
    const where = {};
    if (filters.return_no) where.return_no = { [Op.like]: `%${filters.return_no}%` };
    if (filters.status) where.status = filters.status;
    if (filters.vendor_id) where.vendor_id = filters.vendor_id;
    if (filters.return_date) where.return_date = filters.return_date;

    const { count, rows } = await Return.findAndCountAll({
      where,
      distinct: true,
      limit,
      offset,
      order: [["createdAt", "DESC"]],
      include: [{ model: ReturnItem, as: "items" }],
    });

    return {
      total: count,
      page: Math.floor(offset / limit) + 1,
      limit,
      data: rows,
    };
  },

  async getReturnById(id) {
  // 1️⃣ Fetch the return with items and vendor
  const ret = await Return.findByPk(id, {
    include: [
      { model: Vendor, as: "vendor" },
      { model: ReturnItem, as: "items",
        include: [
          { model: Product, as: "product" }
        ],
       },
    ],
  });

  if (!ret) return null;

  const result = ret.toJSON();

  // 2️⃣ For each return item, fetch inward numbers from inward_ids
  for (const item of result.items) {
    if (item.inward_ids) {
      // Parse the string array
      const inwardIds = JSON.parse(item.inward_ids);
      
      // Fetch all corresponding inward_no from Inward table
      const inwards = await Inward.findAll({
        where: { id: inwardIds },
        attributes: ["id", "inward_no"]
      });

      // Map IDs to inward_no
      item.inward_numbers = inwards.map(i => i.inward_no);
    } else {
      item.inward_numbers = [];
    }
  }

  return result;
},

  // update only allowed while pending (to avoid undoing processed returns)
  async updateReturnWithItems(id, data) {
    return await sequelize.transaction(async (t) => {
      const ret = await Return.findByPk(id, { transaction: t });
      if (!ret) return null;
      if (ret.status === "processed") throw new Error("Cannot update a processed return. Reverse first.");

      await ret.update(
        {
          reason: data.reason || ret.reason,
          vendor_id: data.vendor_id || ret.vendor_id,
          billing_id: data.billing_id || ret.billing_id,
          updated_by: data.updated_by || ret.updated_by,
          updated_by_name: data.updated_by_name || ret.updated_by_name,
          updated_by_email: data.updated_by_email || ret.updated_by_email,
        },
        { transaction: t }
      );

      if (data.items) {
        // delete old items
        await ReturnItem.destroy({ where: { return_id: id }, transaction: t });

        // create new items
        const itemsToCreate = data.items.map((it) => ({
          return_id: id,
          product_id: it.product_id,
          inward_ids: it.inward_ids || [],
          quantity: it.quantity || 0,
          unit_price: it.unit_price || 0,
          tax_amount: it.tax_amount || 0,
          total_price: it.total_price || (it.quantity * it.unit_price) || 0,
          reason: it.reason || null,
        }));
        await ReturnItem.bulkCreate(itemsToCreate, { transaction: t });
      }

      // If requested, process immediately
      if (data.status === "processed") {
        await this._processReturnById(id, { transaction: t });
      }

      return await Return.findByPk(id, {
        include: [{ model: ReturnItem, as: "items" }],
        transaction: t,
      });
    });
  },

  // soft delete
  async deleteReturn(id, user = {}) {
    return await sequelize.transaction(async (t) => {
      const ret = await Return.findByPk(id, { transaction: t });
      if (!ret) return null;

      await ret.update(
        {
          is_active: false,
          deleted_by: user.id || null,
          deleted_by_name: user.username || user.name || null,
          deleted_by_email: user.email || null,
        },
        { transaction: t }
      );

      await ReturnItem.update(
        { is_active: false },
        { where: { return_id: id }, transaction: t }
      );

      return { message: "Return soft deleted" };
    });
  },
};

export default returnService;
