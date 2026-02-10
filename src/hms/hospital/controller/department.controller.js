import departmentService from "../service/department.service.js";
import {
  createDepartmentSchema,
  updateDepartmentSchema,
} from "../dto/department.dto.js";
import parseZodSchema from "../../../utils/zodPharser.js";

const departmentController = {
  async create(req, res) {
  try {
    const validatedData = await parseZodSchema(createDepartmentSchema, req.body);

    const enrichedData = {
      ...validatedData,
      created_by: req.user?.id,
      created_by_name: req.user?.username,
      created_by_email: req.user?.email,
    };


    const department = await departmentService.create(enrichedData);
    return res.sendSuccess(department, "Department created successfully");
  } catch (error) {
    return res.sendError(error.message || "Failed to create department");
  }
},
  async getAll(req, res) {
    try {
      const departments = await departmentService.getAll({
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

      return res.sendSuccess(departments, "Departments fetched successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to fetch departments");
    }
  },

  /**
   * ✅ Get by ID
   */
  async getById(req, res) {
    try {
      const { id } = req.params;
      const department = await departmentService.getById(id);

      if (!department) {
        // Return controlled "not found" response
        return res.sendError("Department not found", 404);
      }

      return res.sendSuccess(department, "Department fetched successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to fetch department");
    }
  },

  /**
   * ✅ Update
   */
  async update(req, res) {
    try {
      const { id } = req.params;
      const validatedData = parseZodSchema(updateDepartmentSchema, req.body);

      if (req.user) {
        validatedData.updated_by = req.user.id;
        validatedData.updated_by_name = req.user.name;
        validatedData.updated_by_email = req.user.email;
      }

      const updated = await departmentService.update(id, validatedData);
      if (!updated) {
        return res.sendError("Department not found", 404);
      }

      return res.sendSuccess(updated, "Department updated successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to update department");
    }
  },

  /**
   * ✅ Soft delete
   */
  async delete(req, res) {
    try {
      const { id } = req.params;
      const userInfo = req.user || {};

      const deleted = await departmentService.delete(id, userInfo);
      if (!deleted) {
        return res.sendError("Department not found", 404);
      }

      return res.sendSuccess(deleted, "Department deleted successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to delete department");
    }
  },

  /**
   * ✅ Restore
   */
  async restore(req, res) {
    try {
      const { id } = req.params;
      const userInfo = req.user || {};

      const restored = await departmentService.restore(id, userInfo);
      if (!restored) {
        return res.sendError("Department not found", 404);
      }

      return res.sendSuccess(restored, "Department restored successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to restore department");
    }
  },
};

export default departmentController;
