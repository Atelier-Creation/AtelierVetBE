import diagnosesService from "../service/diagnoses.service.js";
import parseZodSchema from "../../../utils/zodPharser.js";
import { createDiagnosisSchema, updateDiagnosisSchema } from "../dto/diagnoses.dto.js";

const diagnosesController = {
  /**
   * ✅ Create Diagnosis
   */
  async create(req, res) {
    try {
      const diagnosisData = await parseZodSchema(createDiagnosisSchema, req.body);

      // Add audit info
      diagnosisData.created_by = req.user?.id;
      diagnosisData.created_by_name = req.user?.username;
      diagnosisData.created_by_email = req.user?.email;

      const diagnosis = await diagnosesService.create(diagnosisData, req.user);
      return res.sendSuccess(diagnosis, "Diagnosis recorded successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to record diagnosis");
    }
  },

  /**
   * ✅ Get all Diagnoses (with filters, pagination)
   */
  async getAll(req, res) {
    try {
      const diagnoses = await diagnosesService.getAll(req.query);
      return res.sendSuccess(diagnoses, "Diagnoses fetched successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to fetch diagnoses");
    }
  },

  /**
   * ✅ Get Diagnosis by ID
   */
  async getById(req, res) {
    try {
      const { id } = req.params;
      const diagnosis = await diagnosesService.getById(id);
      return res.sendSuccess(diagnosis, "Diagnosis fetched successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to fetch diagnosis");
    }
  },

  async getByEncounterId(req, res) {
    try {
      const { id } = req.params;
      const diagnoses = await diagnosesService.getDiagnosesByEncounterId(id);
      return res.sendSuccess(diagnoses, "Diagnoses fetched successfully for encounter");
    } catch (error) {
      return res.sendError(error.message || "Failed to fetch diagnoses for encounter");
    }
  },

  /**
   * ✅ Update Diagnosis
   */
  async update(req, res) {
    try {
      const { id } = req.params;
      const data = await parseZodSchema(updateDiagnosisSchema, req.body);

      // Add audit info
      data.updated_by = req.user?.id;
      data.updated_by_name = req.user?.username;
      data.updated_by_email = req.user?.email;

      const updatedDiagnosis = await diagnosesService.update(id, data, req.user);
      return res.sendSuccess(updatedDiagnosis, "Diagnosis updated successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to update diagnosis");
    }
  },

  /**
   * ✅ Delete Diagnosis (Soft delete)
   */
  async delete(req, res) {
    try {
      const { id } = req.params;
      const result = await diagnosesService.delete(id, req.user);
      return res.sendSuccess(result, "Diagnosis deleted successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to delete diagnosis");
    }
  },
};

export default diagnosesController;
