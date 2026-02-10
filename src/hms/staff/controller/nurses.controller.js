import nursesService from "../service/nurses.services.js";
import parseZodSchema from "../../../utils/zodPharser.js";
import {
  createNurseSchema,
  updateNurseSchema,
} from "../dto/nurses.dto.js";

const nursesController = {
  async create(req, res) {
    try {
      // Parse and validate incoming data
      const nurseData = await parseZodSchema(createNurseSchema, req.body);

      // Extract password if new user to be created
      const { password } = req.body.user || {};
      if (!password) {
        return res.sendError("Password is required for nurse user creation");
      }

      // Extract staff data if provided
      const staffData = req.body.staff || {};
      const userInfo = req.user || {};

      // Add audit fields
      nurseData.created_by = userInfo.id || null;
      nurseData.created_by_name = userInfo.username || null;
      nurseData.created_by_email = userInfo.email || null;

      // Call service
      const nurse = await nursesService.create({
        nurseData,
        staffData,
        password,
      });

      return res.sendSuccess(nurse, "Nurse, Staff Profile, and User created successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to create nurse");
    }
  },

  /**
   * ✅ Get all nurses (with filters, pagination, search)
   */
  async getAll(req, res) {
    try {
      const nurses = await nursesService.getAll({
        page: req.query.page,
        limit: req.query.limit,
        search: req.query.search,
        is_active: req.query.is_active,
        sort_by: req.query.sort_by,
        sort_order: req.query.sort_order,
      });

      return res.sendSuccess(nurses, "Nurses fetched successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to fetch nurses");
    }
  },

  /**
   * ✅ Get nurse by ID
   */
  async getById(req, res) {
    try {
      const { id } = req.params;
      const nurse = await nursesService.getById(id);

      if (!nurse) {
        return res.sendError("Nurse not found", 404);
      }

      return res.sendSuccess(nurse, "Nurse fetched successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to fetch nurse");
    }
  },

  /**
   * ✅ Update nurse
   */
  async update(req, res) {
    try {
      const { id } = req.params;
      const validatedData = await parseZodSchema(updateNurseSchema, req.body);

      if (req.user) {
        validatedData.updated_by = req.user?.id;
        validatedData.updated_by_name = req.user?.username;
        validatedData.updated_by_email = req.user?.email;
      }

      const updated = await nursesService.update(id, validatedData);

      if (!updated) {
        return res.sendError("Nurse not found", 404);
      }

      return res.sendSuccess(updated, "Nurse updated successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to update nurse");
    }
  },

  /**
   * ✅ Soft delete nurse
   */
  async delete(req, res) {
    try {
      const { id } = req.params;
      const userInfo = req.user || {};

      const deleted = await nursesService.delete(id, userInfo);

      if (!deleted) {
        return res.sendError("Nurse not found", 404);
      }

      return res.sendSuccess(deleted, "Nurse deleted successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to delete nurse");
    }
  },

  /**
   * ✅ Restore soft-deleted nurse
   */
  async restore(req, res) {
    try {
      const { id } = req.params;
      const userInfo = req.user || {};

      const restored = await nursesService.restore(id, userInfo);

      if (!restored) {
        return res.sendError("Nurse not found", 404);
      }

      return res.sendSuccess(restored, "Nurse restored successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to restore nurse");
    }
  },
};

export default nursesController;
