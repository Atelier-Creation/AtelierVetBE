import staffProfilesService from "../service/staffprofiles.service.js";
import {
  createStaffProfileSchema,
  updateStaffProfileSchema,
} from "../dto/staffprofiles.dto.js";
import parseZodSchema from "../../../utils/zodPharser.js";

const staffProfilesController = {
  async create(req, res) {
    try {
      const validatedData = await parseZodSchema(createStaffProfileSchema, req.body);

      const enrichedData = {
        ...validatedData,
        created_by: req.user?.id,
        created_by_name: req.user?.username,
        created_by_email: req.user?.email,
      };

      const staff = await staffProfilesService.create(enrichedData);
      return res.sendSuccess(staff, "Staff profile created successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to create staff profile");
    }
  },

  /**
   * ✅ Get all staff profiles (with filters, pagination, search)
   */
  async getAll(req, res) {
    try {
      const staffProfiles = await staffProfilesService.getAll({
        page: req.query.page,
        limit: req.query.limit,
        search: req.query.search,
        is_active: req.query.is_active,
        department_id: req.query.department_id,
        designation_id: req.query.designation_id,
        start_date: req.query.start_date,
        end_date: req.query.end_date,
        sort_by: req.query.sort_by,
        sort_order: req.query.sort_order,
        show_deleted: req.query.show_deleted === "true",
      });

      return res.sendSuccess(staffProfiles, "Staff profiles fetched successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to fetch staff profiles");
    }
  },

  /**
   * ✅ Get staff profile by ID
   */
  async getById(req, res) {
    try {
      const { id } = req.params;
      const staff = await staffProfilesService.getById(id);

      if (!staff) {
        return res.sendError("Staff profile not found", 404);
      }

      return res.sendSuccess(staff, "Staff profile fetched successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to fetch staff profile");
    }
  },

  /**
   * ✅ Update staff profile
   */
  async update(req, res) {
    try {
      const { id } = req.params;
      const validatedData = await parseZodSchema(updateStaffProfileSchema, req.body);

      if (req.user) {
        validatedData.updated_by = req.user?.id;
        validatedData.updated_by_name = req.user?.username;
        validatedData.updated_by_email = req.user?.email;
      }

      const updated = await staffProfilesService.update(id, validatedData);

      if (!updated) {
        return res.sendError("Staff profile not found", 404);
      }

      return res.sendSuccess(updated, "Staff profile updated successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to update staff profile");
    }
  },

  /**
   * ✅ Soft delete staff profile
   */
  async delete(req, res) {
    try {
      const { id } = req.params;
      const userInfo = req.user || {};

      const deleted = await staffProfilesService.delete(id, userInfo);

      if (!deleted) {
        return res.sendError("Staff profile not found", 404);
      }

      return res.sendSuccess(deleted, "Staff profile deleted successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to delete staff profile");
    }
  },

  /**
   * ✅ Restore soft-deleted staff profile
   */
  async restore(req, res) {
    try {
      const { id } = req.params;
      const userInfo = req.user || {};

      const restored = await staffProfilesService.restore(id, userInfo);

      if (!restored) {
        return res.sendError("Staff profile not found", 404);
      }

      return res.sendSuccess(restored, "Staff profile restored successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to restore staff profile");
    }
  },
};

export default staffProfilesController;
