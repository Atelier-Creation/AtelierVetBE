import vitalsService from "../service/vitals.service.js";
import parseZodSchema from "../../../utils/zodPharser.js";
import { createVitalsSchema, updateVitalsSchema } from "../dto/vitals.dto.js";

const vitalsController = {
  /**
   * ✅ Create Vitals
   */
  async create(req, res) {
    try {
      // Validate request data
      const vitalsData = await parseZodSchema(createVitalsSchema, req.body);

      // Add audit info
      vitalsData.created_by = req.user?.id;
      vitalsData.created_by_name = req.user?.username;
      vitalsData.created_by_email = req.user?.email;

      // Call service
      const vitals = await vitalsService.create(vitalsData, req.user);
      return res.sendSuccess(vitals, "Vitals recorded successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to record vitals");
    }
  },

  /**
   * ✅ Get All Vitals (with filters, pagination)
   */
  async getAll(req, res) {
    try {
      const vitals = await vitalsService.getAll(req.query);
      return res.sendSuccess(vitals, "Vitals fetched successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to fetch vitals");
    }
  },

  /**
   * ✅ Get Vitals by ID
   */
  async getById(req, res) {
    try {
      const { id } = req.params;
      const vitals = await vitalsService.getById(id);
      return res.sendSuccess(vitals, "Vitals fetched successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to fetch vitals");
    }
  },

  async getByEncountorId(req, res) {
    try {
      const { id } = req.params;
      const vitals = await vitalsService.getVitalsByencountorID(id);
      return res.sendSuccess(vitals, "Vitals fetched successfully by admission ID");
    } catch (error) {
      return res.sendError(error.message || "Failed to fetch vitals by admission ID");
    }
  },

  /**
   * ✅ Update Vitals
   */
  async update(req, res) {
    try {
      const { id } = req.params;
      const data = await parseZodSchema(updateVitalsSchema, req.body);

      // Add audit info
      data.updated_by = req.user?.id;
      data.updated_by_name = req.user?.username;
      data.updated_by_email = req.user?.email;

      const updatedVitals = await vitalsService.update(id, data, req.user);
      return res.sendSuccess(updatedVitals, "Vitals updated successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to update vitals");
    }
  },

  /**
   * ✅ Soft Delete Vitals
   */
  async delete(req, res) {
    try {
      const { id } = req.params;
      const result = await vitalsService.delete(id, req.user);
      return res.sendSuccess(result, "Vitals deleted successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to delete vitals");
    }
  },
};

export default vitalsController;
