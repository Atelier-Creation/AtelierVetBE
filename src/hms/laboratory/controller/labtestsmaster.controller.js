import labTestService from "../service/labtestsmaster.service.js";
import {
  createLabTestSchema,
  updateLabTestSchema,
} from "../dto/labtestsmaster.dto.js";
import parseZodSchema from "../../../utils/zodPharser.js";

const labTestController = {
  /**
   * ✅ Create a new lab test
   */
  async create(req, res) {
    try {
      const validatedData = await parseZodSchema(createLabTestSchema, req.body);

      const enrichedData = {
        ...validatedData,
        created_by: req.user?.id,
        created_by_name: req.user?.username,
        created_by_email: req.user?.email,
      };

      const labTest = await labTestService.create(enrichedData);
      return res.sendSuccess(labTest, "Lab test created successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to create lab test");
    }
  },

  /**
   * ✅ Get all lab tests
   */
  async getAll(req, res) {
    try {
      const labTests = await labTestService.getAll({
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

      return res.sendSuccess(labTests, "Lab tests fetched successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to fetch lab tests");
    }
  },

  /**
   * ✅ Get lab test by ID
   */
  async getById(req, res) {
    try {
      const { id } = req.params;
      const labTest = await labTestService.getById(id);

      if (!labTest) {
        return res.sendError("Lab test not found", 404);
      }

      return res.sendSuccess(labTest, "Lab test fetched successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to fetch lab test");
    }
  },

  /**
   * ✅ Update lab test
   */
  async update(req, res) {
    try {
      const { id } = req.params;
      const validatedData = await parseZodSchema(updateLabTestSchema, req.body);

      if (req.user) {
        validatedData.updated_by = req.user?.id;
        validatedData.updated_by_name = req.user?.username;
        validatedData.updated_by_email = req.user?.email;
      }

      const updated = await labTestService.update(id, validatedData);

      if (!updated) {
        return res.sendError("Lab test not found", 404);
      }

      return res.sendSuccess(updated, "Lab test updated successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to update lab test");
    }
  },

  /**
   * ✅ Soft delete lab test
   */
  async delete(req, res) {
    try {
      const { id } = req.params;
      const userInfo = req.user || {};

      const deleted = await labTestService.delete(id, userInfo);

      if (!deleted) {
        return res.sendError("Lab test not found", 404);
      }

      return res.sendSuccess(deleted, "Lab test deleted successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to delete lab test");
    }
  },

  /**
   * ✅ Restore soft-deleted lab test
   */
  async restore(req, res) {
    try {
      const { id } = req.params;
      const userInfo = req.user || {};

      const restored = await labTestService.restore(id, userInfo);

      if (!restored) {
        return res.sendError("Lab test not found", 404);
      }

      return res.sendSuccess(restored, "Lab test restored successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to restore lab test");
    }
  },
};

export default labTestController;
