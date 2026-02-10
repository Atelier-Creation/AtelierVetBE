import proceduresService from "../service/procedures.service.js";
import {
  createProcedureSchema,
  updateProcedureSchema,
} from "../dto/procedures.dto.js";
import parseZodSchema from "../../../utils/zodPharser.js";

const proceduresController = {
  /**
   * ✅ Create a new procedure
   */
  async create(req, res) {
    try {
      const validatedData = await parseZodSchema(createProcedureSchema, req.body);

      const enrichedData = {
        ...validatedData,
        created_by: req.user?.id,
        created_by_name: req.user?.username,
        created_by_email: req.user?.email,
      };

      const procedure = await proceduresService.create(enrichedData);
      return res.sendSuccess(procedure, "Procedure created successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to create procedure");
    }
  },

  /**
   * ✅ Get all procedures
   */
  async getAll(req, res) {
    try {
      const procedures = await proceduresService.getAll({
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

      return res.sendSuccess(procedures, "Procedures fetched successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to fetch procedures");
    }
  },

  /**
   * ✅ Get procedure by ID
   */
  async getById(req, res) {
    try {
      const { id } = req.params;
      const procedure = await proceduresService.getById(id);

      if (!procedure) {
        return res.sendError("Procedure not found", 404);
      }

      return res.sendSuccess(procedure, "Procedure fetched successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to fetch procedure");
    }
  },

  /**
   * ✅ Update procedure
   */
  async update(req, res) {
    try {
      const { id } = req.params;
      const validatedData = await parseZodSchema(updateProcedureSchema, req.body);

      if (req.user) {
        validatedData.updated_by = req.user?.id;
        validatedData.updated_by_name = req.user?.username;
        validatedData.updated_by_email = req.user?.email;
      }

      const updated = await proceduresService.update(id, validatedData);

      if (!updated) {
        return res.sendError("Procedure not found", 404);
      }

      return res.sendSuccess(updated, "Procedure updated successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to update procedure");
    }
  },

  /**
   * ✅ Soft delete procedure
   */
  async delete(req, res) {
    try {
      const { id } = req.params;
      const userInfo = req.user || {};

      const deleted = await proceduresService.delete(id, userInfo);

      if (!deleted) {
        return res.sendError("Procedure not found", 404);
      }

      return res.sendSuccess(deleted, "Procedure deleted successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to delete procedure");
    }
  },

  /**
   * ✅ Restore soft-deleted procedure
   */
  async restore(req, res) {
    try {
      const { id } = req.params;
      const userInfo = req.user || {};

      const restored = await proceduresService.restore(id, userInfo);

      if (!restored) {
        return res.sendError("Procedure not found", 404);
      }

      return res.sendSuccess(restored, "Procedure restored successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to restore procedure");
    }
  },
};

export default proceduresController;
