import patientInsuranceService from "../service/patientinsurance.service.js";
import parseZodSchema from "../../../utils/zodPharser.js";
import {
  createPatientInsuranceSchema,
  updatePatientInsuranceSchema,
} from "../dto/patientinsurance.dto.js";

const patientInsuranceController = {
  /**
   * ✅ Create Patient Insurance
   */
  async create(req, res) {
    try {
      // 1️⃣ Validate insurance data
      const insuranceData = await parseZodSchema(createPatientInsuranceSchema, req.body);

      // 2️⃣ Add audit info
      insuranceData.created_by = req.user?.id;
      insuranceData.created_by_name = req.user?.username;
      insuranceData.created_by_email = req.user?.email;

      // 3️⃣ Call service to create patient insurance
      const insurance = await patientInsuranceService.create(insuranceData);

      return res.sendSuccess(insurance, "Patient insurance created successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to create patient insurance");
    }
  },

  /**
   * ✅ Get all patient insurances
   */
  async getAll(req, res) {
    try {
      const insurances = await patientInsuranceService.getAll(req.query);
      return res.sendSuccess(insurances, "Patient insurances fetched successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to fetch patient insurances");
    }
  },

  /**
   * ✅ Get patient insurance by ID
   */
  async getById(req, res) {
    try {
      const { id } = req.params;
      const insurance = await patientInsuranceService.getById(id);
      return res.sendSuccess(insurance, "Patient insurance fetched successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to fetch patient insurance");
    }
  },

  /**
   * ✅ Update patient insurance
   */
  async update(req, res) {
    try {
      const { id } = req.params;
      const data = await parseZodSchema(updatePatientInsuranceSchema, req.body);

      data.updated_by = req.user?.id;
      data.updated_by_name = req.user?.username;
      data.updated_by_email = req.user?.email;

      const updated = await patientInsuranceService.update(id, data);
      return res.sendSuccess(updated, "Patient insurance updated successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to update patient insurance");
    }
  },

  /**
   * ✅ Soft delete patient insurance
   */
  async delete(req, res) {
    try {
      const { id } = req.params;
      const result = await patientInsuranceService.delete(id, req.user);
      return res.sendSuccess(result, "Patient insurance deleted successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to delete patient insurance");
    }
  },

  /**
   * ✅ Restore patient insurance
   */
  async restore(req, res) {
    try {
      const { id } = req.params;
      const result = await patientInsuranceService.restore(id, req.user);
      return res.sendSuccess(result, "Patient insurance restored successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to restore patient insurance");
    }
  },
};

export default patientInsuranceController;
