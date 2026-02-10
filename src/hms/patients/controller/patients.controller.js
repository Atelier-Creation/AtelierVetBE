import patientService from "../service/patients.service.js";
import parseZodSchema from "../../../utils/zodPharser.js";
import { createPatientSchema, updatePatientSchema } from "../dto/patients.dto.js";

const patientController = {
  /**
   * ✅ Create Patient (with linked EndUser)
   */
  async create(req, res) {
    try {
      // 1️⃣ Extract password from request
      const { password } = req.body.user || {};
      if (!password) return res.sendError("Password is required for user creation");

      // 2️⃣ Validate patient data with Zod
      const patientData = await parseZodSchema(createPatientSchema, req.body);

      // 3️⃣ Add audit info
      patientData.created_by = req.user?.id;
      patientData.created_by_name = req.user?.username;
      patientData.created_by_email = req.user?.email;

      // 4️⃣ Call service to create patient and linked EndUser
      const result = await patientService.create({ patientData, password });

      return res.sendSuccess(result, "Patient and User created successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to create patient");
    }
  },

  /**
   * ✅ Get all patients
   */
  async getAll(req, res) {
    try {
      const patients = await patientService.getAll(req.query);
      return res.sendSuccess(patients, "Patients fetched successfully");
    } catch (err) {
      return res.sendError(err.message || "Failed to fetch patients");
    }
  },

  /**
   * ✅ Get patient by ID
   */
  async getById(req, res) {
    try {
      const { id } = req.params;
      const patient = await patientService.getById(id);
      return res.sendSuccess(patient, "Patient fetched successfully");
    } catch (err) {
      return res.sendError(err.message || "Failed to fetch patient");
    }
  },


async getHistory(req, res) {
  try {
    const { id } = req.params;
    if (!id) return res.sendError("Patient id is required");

    const { fromDate, toDate, limit } = req.query;

    // Basic validation for dates
    if (fromDate && isNaN(Date.parse(fromDate))) {
      return res.sendError("Invalid fromDate. Use ISO date format (e.g. 2025-10-01).");
    }
    if (toDate && isNaN(Date.parse(toDate))) {
      return res.sendError("Invalid toDate. Use ISO date format (e.g. 2025-10-31).");
    }

    const opts = {};
    if (fromDate) opts.fromDate = fromDate;
    if (toDate) opts.toDate = toDate;
    if (limit) opts.limit = Number(limit) || undefined;

    const history = await patientService.getHistory(id, opts);
    return res.sendSuccess(history, "Patient history fetched successfully");
  } catch (error) {
    console.error("Error in getHistory:", error);
    return res.sendError(error.message || "Failed to fetch patient history");
  }
},


  /**
   * ✅ Update patient
   */
  async update(req, res) {
    try {
      const { id } = req.params;
      const data = await parseZodSchema(updatePatientSchema, req.body);

      data.updated_by = req.user?.id;
      data.updated_by_name = req.user?.username;
      data.updated_by_email = req.user?.email;

      const updated = await patientService.update(id, data);
      return res.sendSuccess(updated, "Patient updated successfully");
    } catch (err) {
      return res.sendError(err.message || "Failed to update patient");
    }
  },

  /**
   * ✅ Soft delete patient
   */
  async delete(req, res) {
    try {
      const { id } = req.params;
      const result = await patientService.delete(id, req.user);
      return res.sendSuccess(result, "Patient deleted successfully");
    } catch (err) {
      return res.sendError(err.message || "Failed to delete patient");
    }
  },

  /**
   * ✅ Restore patient
   */
  async restore(req, res) {
    try {
      const { id } = req.params;
      const result = await patientService.restore(id, req.user);
      return res.sendSuccess(result, "Patient restored successfully");
    } catch (err) {
      return res.sendError(err.message || "Failed to restore patient");
    }
  },
};

export default patientController;
