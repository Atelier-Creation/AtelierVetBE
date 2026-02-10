import { Op } from "sequelize";
import Department from "../models/department.models.js";

const departmentService = {
  async create(data) {
    const department = await Department.create(data);
    console.log(department);
    return department;
  },

  
  async getAll(options = {}) {
    const {
      page = 1,
      limit = 10,
      search = "",
      is_active,
      start_date,
      end_date,
      sort_by = "createdAt",
      sort_order = "DESC",
      show_deleted = false, // if true, include deleted rows
    } = options;

    const offset = (page - 1) * limit;

    // 🔍 Filters
    const where = {};

    // Search by name or code
    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { code: { [Op.like]: `%${search}%` } },
      ];
    }

    // Filter by active/inactive
    if (is_active !== undefined) {
      where.is_active = is_active;
    }

    // Filter by date range
    if (start_date && end_date) {
      where.createdAt = {
        [Op.between]: [new Date(start_date), new Date(end_date)],
      };
    } else if (start_date) {
      where.createdAt = { [Op.gte]: new Date(start_date) };
    } else if (end_date) {
      where.createdAt = { [Op.lte]: new Date(end_date) };
    }

    // Handle soft delete view
    if (!show_deleted) {
      where.deleted_by = null;
    }

    // 📜 Fetch data
    const { count, rows } = await Department.findAndCountAll({
      where,
      offset,
      limit: Number(limit),
      order: [[sort_by, sort_order]],
    });

    return {
      total: count,
      currentPage: Number(page),
      totalPages: Math.ceil(count / limit),
      data: rows,
    };
  },

  
  async getById(id) {
    const department = await Department.findByPk(id);
    if (!department) throw new Error("Department not found");
    return department;
  },

  
  async update(id, data) {
    const department = await Department.findByPk(id);
    if (!department) throw new Error("Department not found");

    await department.update(data);
    return department;
  },

  
  async delete(id, userInfo = {}) {
    const department = await Department.findByPk(id);
    if (!department) throw new Error("Department not found");

    await department.update({
      is_active: false,
      deleted_by: userInfo.id || null,
      deleted_by_name: userInfo.name || null,
      deleted_by_email: userInfo.email || null,
    });

    return { message: "Department deleted successfully" };
  },

  
  async restore(id, userInfo = {}) {
    const department = await Department.findByPk(id);
    if (!department) throw new Error("Department not found");

    await department.update({
      is_active: true,
      deleted_by: null,
      deleted_by_name: null,
      deleted_by_email: null,
      updated_by: userInfo.id || null,
      updated_by_name: userInfo.name || null,
      updated_by_email: userInfo.email || null,
    });

    return { message: "Department restored successfully" };
  },
};

export default departmentService;
