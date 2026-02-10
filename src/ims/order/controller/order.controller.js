import orderService from "../service/order.service.js";
import { createOrderSchema, updateOrderSchema } from "../dto/order.dto.js";

const orderController = {

  // ✅ Create a new Order with items
  async create(req, res) {
    try {
      const validatedData = createOrderSchema.parse(req.body);

      // Attach user info from token
      if (req.user) {
        validatedData.created_by = req.user.id;
        validatedData.created_by_name = req.user.username || req.user.name;
        validatedData.created_by_email = req.user.email;
      }

      // Auto-generate PO number if not provided
      if (!validatedData.po_no) {
        const lastOrder = await orderService.getLastOrder();
        let lastNumber = 0;
        if (lastOrder && lastOrder.po_no) {
          const match = lastOrder.po_no.match(/PO(\d+)/);
          if (match) lastNumber = parseInt(match[1]);
        }
        const newCodeNumber = (lastNumber + 1).toString().padStart(5, "0");
        validatedData.po_no = `PO${newCodeNumber}`;
      }

      const order = await orderService.createOrder(validatedData, validatedData.items);
      return res.status(201).json({
        message: "Order created successfully",
        data: order,
      });
    } catch (err) {
      return res.status(400).json({
        error: err.errors || err.message,
      });
    }
  },

  // ✅ Get all orders with filters + pagination
  async getAll(req, res) {
    try {
      let { page = 1, limit = 10, ...filters } = req.query;
      page = parseInt(page, 10);
      limit = parseInt(limit, 10);
      const offset = (page - 1) * limit;

      const result = await orderService.getAllOrders({ filters, limit, offset });
      return res.json(result);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  // ✅ Get order by ID (with items and vendor)
  async getById(req, res) {
    try {
      const order = await orderService.getOrderById(req.params.id);
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
      return res.json(order);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  // ✅ Update order (and items if provided)
  async update(req, res) {
  try {
    // ✅ Validate request body
    const validatedData = updateOrderSchema.parse(req.body);
    console.log(req.body)

    // ✅ Extract items (if included)
    const items = validatedData.items || [];
    delete validatedData.items; // prevent duplication

    // ✅ Attach updater info
    if (req.user) {
      validatedData.updated_by = req.user.id;
      validatedData.updated_by_name = req.user.username || req.user.name;
      validatedData.updated_by_email = req.user.email;
    }

    // ✅ Call service (pass both order data and items)
    const order = await orderService.updateOrder(req.params.id, validatedData, items);

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    return res.json({
      message: "Order updated successfully",
      data: order,
    });
  } catch (err) {
    return res.status(400).json({
      error: err.errors || err.message,
    });
  }
},


  // ✅ Delete order (soft delete)
  async delete(req, res) {
    try {
      const order = await orderService.getOrderById(req.params.id);
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }

      const result = await orderService.deleteOrder(req.params.id, req.user || {});
      return res.json({
        message: "Order deleted successfully",
        data: result,
      });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },
};

export default orderController;
