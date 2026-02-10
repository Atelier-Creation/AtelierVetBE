import receptionistsService from "../service/receptionists.service.js";
import parseZodSchema from "../../../utils/zodPharser.js";
import {
  createReceptionistSchema,
  updateReceptionistSchema,
} from "../dto/receptionists.dto.js";

const receptionistsController = {
  /**
   * ✅ Create Receptionist (with StaffProfile and EndUser)
   */
  async create(req, res) {
    try {
      // Validate receptionist data
      const receptionistData = await parseZodSchema(createReceptionistSchema, req.body);

      // Extract password from user object
      const { password } = req.body.user || {};
      if (!password) {
        return res.sendError("Password is required for receptionist user creation");
      }

      // Extract staff profile data if provided
      const staffData = req.body.staff || {};
      const userInfo = req.user || {};

      // Add audit fields
      receptionistData.created_by = userInfo.id || null;
      receptionistData.created_by_name = userInfo.username || null;
      receptionistData.created_by_email = userInfo.email || null;

      // Create receptionist + staff profile + user in a transaction
      const receptionist = await receptionistsService.create({
        receptionistData,
        staffData,
        password,
      });

      return res.sendSuccess(
        receptionist,
        "Receptionist, Staff Profile, and User created successfully"
      );
    } catch (error) {
      return res.sendError(error.message || "Failed to create receptionist");
    }
  },

  /**
   * ✅ Get all receptionists (with filters, pagination, and search)
   */
  async getAll(req, res) {
    try {
      const receptionists = await receptionistsService.getAll({
        page: req.query.page,
        limit: req.query.limit,
        search: req.query.search,
        is_active: req.query.is_active,
        sort_by: req.query.sort_by,
        sort_order: req.query.sort_order,
      });

      return res.sendSuccess(receptionists, "Receptionists fetched successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to fetch receptionists");
    }
  },

  /**
   * ✅ Get receptionist by ID
   */
  async getById(req, res) {
    try {
      const { id } = req.params;
      const receptionist = await receptionistsService.getById(id);

      if (!receptionist) {
        return res.sendError("Receptionist not found", 404);
      }

      return res.sendSuccess(receptionist, "Receptionist fetched successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to fetch receptionist");
    }
  },

  /**
   * ✅ Update receptionist
   */
  async update(req, res) {
    try {
      const { id } = req.params;
      const validatedData = await parseZodSchema(updateReceptionistSchema, req.body);

      if (req.user) {
        validatedData.updated_by = req.user?.id;
        validatedData.updated_by_name = req.user?.username;
        validatedData.updated_by_email = req.user?.email;
      }

      const updated = await receptionistsService.update(id, validatedData);

      if (!updated) {
        return res.sendError("Receptionist not found", 404);
      }

      return res.sendSuccess(updated, "Receptionist updated successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to update receptionist");
    }
  },

  /**
   * ✅ Soft delete receptionist
   */
  async delete(req, res) {
    try {
      const { id } = req.params;
      const userInfo = req.user || {};

      const deleted = await receptionistsService.delete(id, userInfo);

      if (!deleted) {
        return res.sendError("Receptionist not found", 404);
      }

      return res.sendSuccess(deleted, "Receptionist deleted successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to delete receptionist");
    }
  },

  /**
   * ✅ Restore receptionist
   */
  async restore(req, res) {
    try {
      const { id } = req.params;
      const userInfo = req.user || {};

      const restored = await receptionistsService.restore(id, userInfo);

      if (!restored) {
        return res.sendError("Receptionist not found", 404);
      }

      return res.sendSuccess(restored, "Receptionist restored successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to restore receptionist");
    }
  },
};

export default receptionistsController;
