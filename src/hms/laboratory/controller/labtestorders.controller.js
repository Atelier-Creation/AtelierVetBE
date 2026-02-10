import labTestOrderService from "../service/labtestorders.service.js";
import parseZodSchema from "../../../utils/zodPharser.js";
import {
  createLabTestOrderSchema,
  updateLabTestOrderSchema,
} from "../dto/labtestorders.dto.js";

const labTestOrderController = {
  /**
   * ✅ Create Lab Test Order
   */
  async create(req, res) {
    try {
      // Validate input
      const orderData = await parseZodSchema(createLabTestOrderSchema, req.body);

      // Add audit info
      orderData.created_by = req.user?.id;
      orderData.created_by_name = req.user?.username;
      orderData.created_by_email = req.user?.email;

      const order = await labTestOrderService.create(orderData);
      return res.sendSuccess(order, "Lab test order created successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to create lab test order");
    }
  },

  /**
   * ✅ Get All Lab Test Orders (with optional filters)
   */
  async getAll(req, res) {
    try {
      const orders = await labTestOrderService.getAll(req.query);
      return res.sendSuccess(orders, "Lab test orders fetched successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to fetch lab test orders");
    }
  },

  /**
   * ✅ Get Lab Test Order by ID
   */
  async getById(req, res) {
    try {
      const { id } = req.params;
      const order = await labTestOrderService.getById(id);
      return res.sendSuccess(order, "Lab test order fetched successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to fetch lab test order");
    }
  },


  /**
 * ✅ Get Lab Test Order by Encounter ID
 */
async getByEncounterId(req, res) {
  try {
    const { id } = req.params;
    const order = await labTestOrderService.getByEncounterId(id);
    return res.sendSuccess(order, "Lab test order fetched successfully for this encounter");
  } catch (error) {
    return res.sendError(error.message || "Failed to fetch lab test order for this encounter");
  }
},


  /**
   * ✅ Update Lab Test Order
   */
  async update(req, res) {
    try {
      const { id } = req.params;
      const updateData = await parseZodSchema(updateLabTestOrderSchema, req.body);

      // Add audit info
      updateData.updated_by = req.user?.id;
      updateData.updated_by_name = req.user?.username;
      updateData.updated_by_email = req.user?.email;

      const updatedOrder = await labTestOrderService.update(id, updateData);
      return res.sendSuccess(updatedOrder, "Lab test order updated successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to update lab test order");
    }
  },

  /**
   * ✅ Soft Delete (Cancel) Lab Test Order
   */
  async delete(req, res) {
    try {
      const { id } = req.params;
      const deletedOrder = await labTestOrderService.delete(id, req.user);
      return res.sendSuccess(deletedOrder, "Lab test order deleted successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to delete lab test order");
    }
  },

  /**
   * ✅ Restore Soft Deleted Lab Test Order
   */
  async restore(req, res) {
    try {
      const { id } = req.params;
      const restoredOrder = await labTestOrderService.restore(id, req.user);
      return res.sendSuccess(restoredOrder, "Lab test order restored successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to restore lab test order");
    }
  },

  /**
   * ✅ Get Lab Test Orders by Patient
   */
  async getByPatient(req, res) {
    try {
      const { patient_id } = req.params;
      const orders = await labTestOrderService.getByPatient(patient_id);
      return res.sendSuccess(orders, "Lab test orders fetched for patient successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to fetch lab test orders for patient");
    }
  },

  /**
   * ✅ Get Pending Lab Tests (e.g., for collection or processing)
   */
  async getPending(req, res) {
    try {
      const orders = await labTestOrderService.getPending();
      return res.sendSuccess(orders, "Pending lab tests fetched successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to fetch pending lab tests");
    }
  },

  /**
   * ✅ Mark Lab Test Item as Resulted
   */
  async markResulted(req, res) {
    try {
      const { item_id } = req.params;
      const { result_value, result_file_url } = req.body;

      const result = await labTestOrderService.markResulted(item_id, {
        result_value,
        result_file_url,
        resulted_by: req.user?.id,
      });

      return res.sendSuccess(result, "Lab test item marked as resulted successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to update lab test result");
    }
  },
};

export default labTestOrderController;
