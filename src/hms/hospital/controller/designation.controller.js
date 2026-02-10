import designationService from "../service/designation.service.js";
import {
  createDesignationSchema,
  updateDesignationSchema,
} from "../dto/designation.dto.js";
import parseZodSchema from "../../../utils/zodPharser.js";

const designationController = {
  /**
   * ✅ Create a new designation
   */
  async create(req, res) {
    try {
      const validatedData = await parseZodSchema(createDesignationSchema, req.body);

      const enrichedData = {
        ...validatedData,
        created_by: req.user?.id,
        created_by_name: req.user?.username,
        created_by_email: req.user?.email,
      };

      const designation = await designationService.create(enrichedData);
      return res.sendSuccess(designation, "Designation created successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to create designation");
    }
  },

  /**
   * ✅ Get all designations
   */
  async getAll(req, res) {
    try {
      const designations = await designationService.getAll({
        page: req.query.page,
        limit: req.query.limit,
        search: req.query.search,
        is_active: req.query.is_active,
        start_date: req.query.start_date,
        end_date: req.query.end_date,
        sort_by: req.query.sort_by,
        sort_order: req.query.sort_order,
        show_deleted: req.query.show_deleted === "true",
      });

      return res.sendSuccess(designations, "Designations fetched successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to fetch designations");
    }
  },

  /**
   * ✅ Get designation by ID
   */
  async getById(req, res) {
    try {
      const { id } = req.params;
      const designation = await designationService.getById(id);

      if (!designation) {
        return res.sendError("Designation not found", 404);
      }

      return res.sendSuccess(designation, "Designation fetched successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to fetch designation");
    }
  },

  /**
   * ✅ Update designation
   */
  async update(req, res) {
    try {
      const { id } = req.params;
      const validatedData = await parseZodSchema(updateDesignationSchema, req.body);

      if (req.user) {
        validatedData.updated_by = req.user.id;
        validatedData.updated_by_name = req.user.username;
        validatedData.updated_by_email = req.user.email;
      }

      const updated = await designationService.update(id, validatedData);

      if (!updated) {
        return res.sendError("Designation not found", 404);
      }

      return res.sendSuccess(updated, "Designation updated successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to update designation");
    }
  },

  /**
   * ✅ Soft delete designation
   */
  async delete(req, res) {
    try {
      const { id } = req.params;
      const userInfo = req.user || {};

      const deleted = await designationService.delete(id, userInfo);

      if (!deleted) {
        return res.sendError("Designation not found", 404);
      }

      return res.sendSuccess(deleted, "Designation deleted successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to delete designation");
    }
  },

  /**
   * ✅ Restore soft-deleted designation
   */
  async restore(req, res) {
    try {
      const { id } = req.params;
      const userInfo = req.user || {};

      const restored = await designationService.restore(id, userInfo);

      if (!restored) {
        return res.sendError("Designation not found", 404);
      }

      return res.sendSuccess(restored, "Designation restored successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to restore designation");
    }
  },
};

export default designationController;
