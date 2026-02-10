import radiologyOrderService from "../service/radiologyorders.service.js";
import parseZodSchema from "../../../utils/zodPharser.js";
import {
  createRadiologyOrderSchema,
  updateRadiologyOrderSchema,
  markRadiologyResultSchema,
} from "../dto/radiologyorders.dto.js";

const radiologyOrderController = {
  /**
   * ✅ Create Radiology Order
   */
  async create(req, res) {
    try {
      // Validate input
      const orderData = await parseZodSchema(createRadiologyOrderSchema, req.body);

      // Add audit info
      orderData.created_by = req.user?.id;
      orderData.created_by_name = req.user?.username;
      orderData.created_by_email = req.user?.email;

      const order = await radiologyOrderService.create(orderData);
      return res.sendSuccess(order, "Radiology order created successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to create radiology order");
    }
  },

  /**
   * ✅ Get All Radiology Orders (with filters)
   */
  async getAll(req, res) {
    try {
      const orders = await radiologyOrderService.getAll(req.query);
      return res.sendSuccess(orders, "Radiology orders fetched successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to fetch radiology orders");
    }
  },

  /**
   * ✅ Get Radiology Order by ID
   */
  async getById(req, res) {
    try {
      const { id } = req.params;
      const order = await radiologyOrderService.getById(id);
      return res.sendSuccess(order, "Radiology order fetched successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to fetch radiology order");
    }
  },

  /**
   * ✅ Update Radiology Order (status, priority, or report)
   */
  async update(req, res) {
    try {
      const { id } = req.params;
      const updateData = await parseZodSchema(updateRadiologyOrderSchema, req.body);

      // Add audit info
      updateData.updated_by = req.user?.id;
      updateData.updated_by_name = req.user?.username;
      updateData.updated_by_email = req.user?.email;

      const updatedOrder = await radiologyOrderService.update(id, updateData);
      return res.sendSuccess(updatedOrder, "Radiology order updated successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to update radiology order");
    }
  },

  /**
   * ✅ Soft Delete (Cancel) Radiology Order
   */
  async delete(req, res) {
    try {
      const { id } = req.params;
      const deletedOrder = await radiologyOrderService.delete(id, req.user);
      return res.sendSuccess(deletedOrder, "Radiology order deleted successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to delete radiology order");
    }
  },

  /**
   * ✅ Restore a Deleted Radiology Order
   */
  async restore(req, res) {
    try {
      const { id } = req.params;
      const restoredOrder = await radiologyOrderService.restore(id, req.user);
      return res.sendSuccess(restoredOrder, "Radiology order restored successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to restore radiology order");
    }
  },

  /**
   * ✅ Get Radiology Orders by Client
   */
  async getByClient(req, res) {
    try {
      const { client_id } = req.params;
      const orders = await radiologyOrderService.getByClient(client_id);
      return res.sendSuccess(orders, "Radiology orders fetched for client successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to fetch radiology orders for client");
    }
  },

  /**
   * ✅ Get Pending Radiology Orders
   */
  async getPending(req, res) {
    try {
      const orders = await radiologyOrderService.getPending();
      return res.sendSuccess(orders, "Pending radiology orders fetched successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to fetch pending radiology orders");
    }
  },

  /**
   * ✅ Mark Radiology Test as Resulted (upload report)
   */
  async markResulted(req, res) {
    try {
      const { id } = req.params; // radiology order ID
      const resultData = await parseZodSchema(markRadiologyResultSchema, req.body);

      // Add audit info
      resultData.updated_by = req.user?.id;
      resultData.updated_by_name = req.user?.username;
      resultData.updated_by_email = req.user?.email;

      const result = await radiologyOrderService.markResulted(id, resultData);
      return res.sendSuccess(result, "Radiology test marked as resulted successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to mark radiology test as resulted");
    }
  },
};

export default radiologyOrderController;
