import wardsService from "../service/wards.service.js";
import { createWardSchema, updateWardSchema } from "../dto/wards.dto.js";
import parseZodSchema from "../../../utils/zodPharser.js";

const wardsController = {
  /**
   * ✅ Create a new ward
   */
  async create(req, res) {
    try {
      const validatedData = await parseZodSchema(createWardSchema, req.body);

      const enrichedData = {
        ...validatedData,
        created_by: req.user?.id,
        created_by_name: req.user?.username,
        created_by_email: req.user?.email,
      };

      const ward = await wardsService.create(enrichedData);
      return res.sendSuccess(ward, "Ward created successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to create ward");
    }
  },

  /**
   * ✅ Get all wards
   */
  async getAll(req, res) {
    try {
      const wards = await wardsService.getAll({
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

      return res.sendSuccess(wards, "Wards fetched successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to fetch wards");
    }
  },

  /**
   * ✅ Get ward by ID
   */
  async getById(req, res) {
    try {
      const { id } = req.params;
      const ward = await wardsService.getById(id);

      if (!ward) {
        return res.sendError("Ward not found", 404);
      }

      return res.sendSuccess(ward, "Ward fetched successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to fetch ward");
    }
  },

  /**
   * ✅ Update ward
   */
  async update(req, res) {
    try {
      const { id } = req.params;
      const validatedData = await parseZodSchema(updateWardSchema, req.body);

      if (req.user) {
        validatedData.updated_by = req.user.id;
        validatedData.updated_by_name = req.user.username;
        validatedData.updated_by_email = req.user.email;
      }

      const updated = await wardsService.update(id, validatedData);

      if (!updated) {
        return res.sendError("Ward not found", 404);
      }

      return res.sendSuccess(updated, "Ward updated successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to update ward");
    }
  },

  /**
   * ✅ Soft delete ward
   */
  async delete(req, res) {
    try {
      const { id } = req.params;
      const userInfo = req.user || {};

      const deleted = await wardsService.delete(id, userInfo);

      if (!deleted) {
        return res.sendError("Ward not found", 404);
      }

      return res.sendSuccess(deleted, "Ward deleted successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to delete ward");
    }
  },

  /**
   * ✅ Restore soft-deleted ward
   */
  async restore(req, res) {
    try {
      const { id } = req.params;
      const userInfo = req.user || {};

      const restored = await wardsService.restore(id, userInfo);

      if (!restored) {
        return res.sendError("Ward not found", 404);
      }

      return res.sendSuccess(restored, "Ward restored successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to restore ward");
    }
  },
};

export default wardsController;
