import clientInsuranceService from "../service/clientinsurance.service.js";
import parseZodSchema from "../../../utils/zodPharser.js";
import {
  createClientInsuranceSchema,
  updateClientInsuranceSchema,
} from "../dto/clientinsurance.dto.js";

const clientInsuranceController = {
  /**
   * ✅ Create Client Insurance
   */
  async create(req, res) {
    try {
      // 1️⃣ Validate insurance data
      const insuranceData = await parseZodSchema(createClientInsuranceSchema, req.body);

      // 2️⃣ Add audit info
      insuranceData.created_by = req.user?.id;
      insuranceData.created_by_name = req.user?.username;
      insuranceData.created_by_email = req.user?.email;

      // 3️⃣ Call service to create client insurance
      const insurance = await clientInsuranceService.create(insuranceData);

      return res.sendSuccess(insurance, "Client insurance created successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to create client insurance");
    }
  },

  /**
   * ✅ Get all client insurances
   */
  async getAll(req, res) {
    try {
      const insurances = await clientInsuranceService.getAll(req.query);
      return res.sendSuccess(insurances, "Client insurances fetched successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to fetch client insurances");
    }
  },

  /**
   * ✅ Get client insurance by ID
   */
  async getById(req, res) {
    try {
      const { id } = req.params;
      const insurance = await clientInsuranceService.getById(id);
      return res.sendSuccess(insurance, "Client insurance fetched successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to fetch client insurance");
    }
  },

  /**
   * ✅ Update client insurance
   */
  async update(req, res) {
    try {
      const { id } = req.params;
      const data = await parseZodSchema(updateClientInsuranceSchema, req.body);

      data.updated_by = req.user?.id;
      data.updated_by_name = req.user?.username;
      data.updated_by_email = req.user?.email;

      const updated = await clientInsuranceService.update(id, data);
      return res.sendSuccess(updated, "Client insurance updated successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to update client insurance");
    }
  },

  /**
   * ✅ Soft delete client insurance
   */
  async delete(req, res) {
    try {
      const { id } = req.params;
      const result = await clientInsuranceService.delete(id, req.user);
      return res.sendSuccess(result, "Client insurance deleted successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to delete client insurance");
    }
  },

  /**
   * ✅ Restore client insurance
   */
  async restore(req, res) {
    try {
      const { id } = req.params;
      const result = await clientInsuranceService.restore(id, req.user);
      return res.sendSuccess(result, "Client insurance restored successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to restore client insurance");
    }
  },
};

export default clientInsuranceController;
