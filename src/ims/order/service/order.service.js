import { sequelize } from '../../../db/index.js';
import Product from '../../product/models/product.model.js';
import Order from "../models/order.models.js";
import OrderItem from "../models/orderiteam.models.js";
import Vendor from "../../vendor/models/vendor.models.js";
import { Op } from "sequelize";
import { name } from 'ejs';

const orderService = {

  // ✅ Create a new order
  async createOrder(data, items = []) {
  const t = await sequelize.transaction();

  try {
    // ✅ Auto-generate PO number if not provided
    if (!data.po_no) {
      const lastOrder = await Order.findOne({
        order: [["createdAt", "DESC"]],
        transaction: t,
      });

      let lastNumber = 0;
      if (lastOrder && lastOrder.po_no) {
        const match = lastOrder.po_no.match(/PO(\d+)/);
        if (match) lastNumber = parseInt(match[1], 10);
      }

      const newNumber = (lastNumber + 1).toString().padStart(5, "0");
      data.po_no = `PO${newNumber}`;
    }

    // ✅ Initialize totals
    let totalAmount = 0;
    let totalQuantity = 0;
    let totalTax = 0;
    let totalPendingQuantity = 0;

    // ✅ Validate and calculate item totals before order creation
    if (items.length > 0) {
      for (const item of items) {
        const product = await Product.findByPk(item.product_id, { transaction: t });
        if (!product) {
          throw new Error(`Invalid product_id: ${item.product_id}`);
        }

        // Default numeric values
        const quantity = item.quantity || 0;
        const unit_price = item.unit_price || 0;
        const tax_amount = item.tax_amount || 0;
        const total_price = item.total_price || quantity * unit_price;

        // Add calculated fields
        item.total_price = total_price;
        item.tax_amount = tax_amount;
        item.pending_quantity = quantity; // same as quantity initially

        // Update order-level totals
        totalAmount += total_price;
        totalQuantity += quantity;
        totalTax += tax_amount;
        totalPendingQuantity += quantity;
      }
    }

    // ✅ Assign calculated totals to order data
    data.total_amount = totalAmount;
    data.total_quantity = totalQuantity;
    data.tax_amount = totalTax;
    data.total_penning_quantity = totalPendingQuantity;

    // ✅ Create order
    const order = await Order.create(data, { transaction: t });

    // ✅ Create items linked to order
    if (items.length > 0) {
      for (const item of items) {
        await OrderItem.create(
          {
            ...item,
            order_id: order.id,
          },
          { transaction: t }
        );
      }
    }

    // ✅ Commit transaction
    await t.commit();

    // ✅ Fetch full order with vendor & items
    const createdOrder = await Order.findByPk(order.id, {
      include: [
        { model: Vendor, as: "vendor" },
        { model: OrderItem, as: "items", include: ["products"] },
      ],
    });

    return createdOrder;
  } catch (error) {
    await t.rollback();
    throw new Error(error.message || "Failed to create order");
  }
},


  // ✅ Get all orders with pagination and filters
  async getAllOrders({ filters = {}, limit = 10, offset = 0 } = {}) {
    const where = { is_active: true };

    if (filters.status) where.status = filters.status;
    if (filters.vendor_id) where.vendor_id = filters.vendor_id;
    if (filters.search) {
      where[Op.or] = [
        { po_no: { [Op.like]: `%${filters.search}%` } },
        {name: { [Op.like]: `%${filters.search}%` } }
      ];
    }

    const { count, rows } = await Order.findAndCountAll({
      where,
      include: [
        { model: Vendor, as: "vendor" },
        { model: OrderItem, as: "items", include: ["products"] },
      ],
      order: [["createdAt", "DESC"]],
      limit,
      offset,
    });

    return {
      total: count,
      page: Math.floor(offset / limit) + 1,
      limit,
      data: rows,
    };
  },

  // ✅ Get order by ID
  async getOrderById(id) {
    const order = await Order.findByPk(id, {
      include: [
        { model: Vendor, as: "vendor" },
        { model: OrderItem, as: "items", include: ["products"] },
      ],
    });

    if (!order) throw new Error("Order not found");
    return order;
  },

  // ✅ Update order
  async updateOrder(id, data, items = []) {
  const t = await sequelize.transaction();

  try {
    const order = await Order.findByPk(id, {
      include: [{ model: OrderItem, as: "items" }],
      transaction: t,
    });
    if (!order) throw new Error("Order not found");

    // ✅ Map existing items for quick lookup
    const existingItems = order.items.reduce((acc, item) => {
      acc[item.product_id] = item;
      return acc;
    }, {});

    // Initialize totals
    let totalAmount = 0;
    let totalQuantity = 0;
    let totalTax = 0;
    let totalPendingQuantity = 0;

    const processedProductIds = new Set();

    for (const item of items) {
      const product = await Product.findByPk(item.product_id, { transaction: t });
      if (!product) throw new Error(`Invalid product_id: ${item.product_id}`);

      const quantity = item.quantity || 0;
      const unit_price = item.unit_price || 0;
      const tax_amount = item.tax_amount || 0;
      const total_price = item.total_price || quantity * unit_price;

      // Totals
      totalAmount += total_price;
      totalQuantity += quantity;
      totalTax += tax_amount;
      totalPendingQuantity += quantity;

      // Mark processed product_id
      processedProductIds.add(item.product_id);

      // ✅ Update existing item or create new
      if (existingItems[item.product_id]) {
        await existingItems[item.product_id].update(
          {
            quantity,
            unit_price,
            total_price,
            tax_amount,
            pending_quantity: quantity,
          },
          { transaction: t }
        );
      } else {
        await OrderItem.create(
          {
            order_id: id,
            product_id: item.product_id,
            quantity,
            unit_price,
            total_price,
            tax_amount,
            pending_quantity: quantity,
          },
          { transaction: t }
        );
      }
    }

    // ✅ Delete items not included in new list
    const itemsToDelete = Object.keys(existingItems).filter(
      (pid) => !processedProductIds.has(pid)
    );

    if (itemsToDelete.length > 0) {
      await OrderItem.destroy({
        where: {
          order_id: id,
          product_id: itemsToDelete,
        },
        transaction: t,
      });
    }

    // ✅ Update totals on the order
    await order.update(
      {
        ...data,
        total_amount: totalAmount,
        total_quantity: totalQuantity,
        tax_amount: totalTax,
        total_penning_quantity: totalPendingQuantity,
      },
      { transaction: t }
    );

    await t.commit();

    // ✅ Return updated order with vendor + items
    const updatedOrder = await Order.findByPk(order.id, {
      include: [
        { model: Vendor, as: "vendor" },
        { model: OrderItem, as: "items", include: ["products"] },
      ],
    });

    return updatedOrder;
  } catch (error) {
    await t.rollback();
    throw new Error(error.message || "Failed to update order");
  }
},


  // ✅ Soft delete order
  async deleteOrder(id, userInfo) {
    const order = await Order.findByPk(id);
    if (!order) throw new Error("Order not found");

    await order.update({
      is_active: false,
      deleted_by: userInfo?.id || null,
      deleted_by_name: userInfo?.name || null,
      deleted_by_email: userInfo?.email || null,
    });

    return { message: "Order soft deleted successfully" };
  },

  // ✅ Generate next PO number
  async getLastOrder() {
    return await Order.findOne({
      order: [["createdAt", "DESC"]],
    });
  }
};

export default orderService;
