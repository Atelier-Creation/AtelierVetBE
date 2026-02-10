import pharmacistsService from "../service/pharmacists.service.js";
import parseZodSchema from "../../../utils/zodPharser.js";
import {
  createPharmacistSchema,
  updatePharmacistSchema,
} from "../dto/pharmacists.dto.js";

const pharmacistsController = {
  /**
   * ✅ Create Pharmacist (with optional staff profile and user)
   */
  async create(req, res) {
    try {
      const pharmacistData = await parseZodSchema(createPharmacistSchema, req.body);

      // Extract password if creating a user
      const { password } = req.body.user || {};
      if (!password) {
        return res.sendError("Password is required for pharmacist user creation");
      }

      const staffData = req.body.staff || {};
      const userInfo = req.user || {};

      // Add audit fields
      pharmacistData.created_by = userInfo.id || null;
      pharmacistData.created_by_name = userInfo.username || null;
      pharmacistData.created_by_email = userInfo.email || null;

      const pharmacist = await pharmacistsService.create({
        pharmacistData,
        staffData,
        password,
      });

      return res.sendSuccess(pharmacist, "Pharmacist, Staff Profile, and User created successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to create pharmacist");
    }
  },

  /**
   * ✅ Get all pharmacists (with filters, pagination, search)
   */
  async getAll(req, res) {
    try {
      const pharmacists = await pharmacistsService.getAll({
        page: req.query.page,
        limit: req.query.limit,
        search: req.query.search,
        is_active: req.query.is_active,
        sort_by: req.query.sort_by,
        sort_order: req.query.sort_order,
      });

      return res.sendSuccess(pharmacists, "Pharmacists fetched successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to fetch pharmacists");
    }
  },

  /**
   * ✅ Get pharmacist by ID
   */
  async getById(req, res) {
    try {
      const { id } = req.params;
      const pharmacist = await pharmacistsService.getById(id);

      if (!pharmacist) {
        return res.sendError("Pharmacist not found", 404);
      }

      return res.sendSuccess(pharmacist, "Pharmacist fetched successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to fetch pharmacist");
    }
  },

  /**
   * ✅ Update pharmacist
   */
  async update(req, res) {
    try {
      const { id } = req.params;
      const validatedData = await parseZodSchema(updatePharmacistSchema, req.body);

      if (req.user) {
        validatedData.updated_by = req.user?.id;
        validatedData.updated_by_name = req.user?.username;
        validatedData.updated_by_email = req.user?.email;
      }

      const updated = await pharmacistsService.update(id, validatedData);

      if (!updated) {
        return res.sendError("Pharmacist not found", 404);
      }

      return res.sendSuccess(updated, "Pharmacist updated successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to update pharmacist");
    }
  },

  /**
   * ✅ Soft delete pharmacist
   */
  async delete(req, res) {
    try {
      const { id } = req.params;
      const userInfo = req.user || {};

      const deleted = await pharmacistsService.delete(id, userInfo);

      if (!deleted) {
        return res.sendError("Pharmacist not found", 404);
      }

      return res.sendSuccess(deleted, "Pharmacist deleted successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to delete pharmacist");
    }
  },

  /**
   * ✅ Restore soft-deleted pharmacist
   */
  async restore(req, res) {
    try {
      const { id } = req.params;
      const userInfo = req.user || {};

      const restored = await pharmacistsService.restore(id, userInfo);

      if (!restored) {
        return res.sendError("Pharmacist not found", 404);
      }

      return res.sendSuccess(restored, "Pharmacist restored successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to restore pharmacist");
    }
  },
};

export default pharmacistsController;
