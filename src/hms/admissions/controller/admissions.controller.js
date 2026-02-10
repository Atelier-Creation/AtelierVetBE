import admissionsService from "../service/admissions.service.js";
import parseZodSchema from "../../../utils/zodPharser.js";
import {
  createAdmissionSchema,
  updateAdmissionSchema,
  dischargeAdmissionSchema,
} from "../dto/admissions.dto.js";

const admissionsController = {
  /**
   * ✅ Create Admission
   */
  async create(req, res) {
    try {
      const validatedData = await parseZodSchema(createAdmissionSchema, req.body);
      console.log("user: ",req.user)
      const admissionData = {
        ...validatedData,
        admitted_by: req.user?.id,
        created_by: req.user?.id,
        created_by_name: req.user?.username,
        created_by_email: req.user?.email,
      };
      console.log("admissionData",admissionData)

      const result = await admissionsService.create(admissionData, req.user);

      return res.sendSuccess(result, "Patient admitted successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to admit patient");
    }
  },

  /**
   * ✅ Get All Admissions (with filters, pagination, etc.)
   */
  async getAll(req, res) {
    try {
      const admissions = await admissionsService.getAll(req.query);
      return res.sendSuccess(admissions, "Admissions fetched successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to fetch admissions");
    }
  },

  /**
   * ✅ Get Admission by ID
   */
  async getById(req, res) {
    try {
      const { id } = req.params;
      const admission = await admissionsService.getById(id);
      if (!admission) return res.sendError("Admission not found", 404);
      return res.sendSuccess(admission, "Admission fetched successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to fetch admission");
    }
  },

  /**
   * ✅ Update Admission (e.g., ward/bed change, transfer)
   */
  async update(req, res) {
    try {
      const { id } = req.params;
      const validatedData = await parseZodSchema(updateAdmissionSchema, req.body);

      const updateData = {
        ...validatedData,
        updated_by: req.user?.id,
        updated_by_name: req.user?.username,
        updated_by_email: req.user?.email,
      };

      const result = await admissionsService.update(id, updateData);
      return res.sendSuccess(result, "Admission updated successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to update admission");
    }
  },

  /**
   * ✅ Discharge Patient
   */
  async discharge(req, res) {
    try {
      const { id } = req.params;
      const validatedData = await parseZodSchema(dischargeAdmissionSchema, req.body);

      const dischargeData = {
        ...validatedData,
        discharge_by: req.user?.id,
        updated_by: req.user?.id,
        updated_by_name: req.user?.username,
        updated_by_email: req.user?.email,
      };

      const result = await admissionsService.discharge(id, dischargeData);
      return res.sendSuccess(result, "Patient discharged successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to discharge patient");
    }
  },

  /**
   * ✅ Delete Admission (soft delete)
   */
  async delete(req, res) {
    try {
      const { id } = req.params;
      const result = await admissionsService.delete(id, req.user);
      return res.sendSuccess(result, "Admission deleted successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to delete admission");
    }
  },

  /**
   * ✅ Restore Admission (undo soft delete)
   */
  async restore(req, res) {
    try {
      const { id } = req.params;
      const result = await admissionsService.restore(id, req.user);
      return res.sendSuccess(result, "Admission restored successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to restore admission");
    }
  },
};

export default admissionsController;
