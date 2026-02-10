import { Op } from "sequelize";
import Designation from "../models/designation.models.js";

const designationService = {
  /**
   * ✅ Create a new designation
   */
  async create(data) {
    const designation = await Designation.create(data);
    return designation;
  },

  /**
   * ✅ Get all designations (with search, pagination, filters)
   */
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
      show_deleted = false,
    } = options;

    const offset = (page - 1) * limit;

    const where = {};

    // 🔍 Search by title or description
    if (search) {
      where[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
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

    // Exclude deleted if not requested
    if (!show_deleted) {
      where.deleted_by = null;
    }

    // 📜 Fetch paginated results
    const { count, rows } = await Designation.findAndCountAll({
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

  /**
   * ✅ Get designation by ID
   */
  async getById(id) {
    const designation = await Designation.findByPk(id);
    if (!designation) throw new Error("Designation not found");
    return designation;
  },

  /**
   * ✅ Update designation
   */
  async update(id, data) {
    const designation = await Designation.findByPk(id);
    if (!designation) throw new Error("Designation not found");

    await designation.update(data);
    return designation;
  },

  /**
   * ✅ Soft delete designation
   */
  async delete(id, userInfo = {}) {
    const designation = await Designation.findByPk(id);
    if (!designation) throw new Error("Designation not found");

    await designation.update({
      is_active: false,
      deleted_by: userInfo.id || null,
      deleted_by_name: userInfo.name || null,
      deleted_by_email: userInfo.email || null,
    });

    return { message: "Designation deleted successfully" };
  },

  /**
   * ✅ Restore soft-deleted designation
   */
  async restore(id, userInfo = {}) {
    const designation = await Designation.findByPk(id);
    if (!designation) throw new Error("Designation not found");

    await designation.update({
      is_active: true,
      deleted_by: null,
      deleted_by_name: null,
      deleted_by_email: null,
      updated_by: userInfo.id || null,
      updated_by_name: userInfo.name || null,
      updated_by_email: userInfo.email || null,
    });

    return { message: "Designation restored successfully" };
  },
};

export default designationService;
