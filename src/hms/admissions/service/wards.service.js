import { Op } from "sequelize";
import Wards from "../models/wards.models.js";

const wardsService = {
  /**
   * ✅ Create a new ward
   */
  async create(data) {
    const ward = await Wards.create(data);
    return ward;
  },

  /**
   * ✅ Get all wards (with search, pagination, filters)
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

    // 🔍 Search by name or description
    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
      ];
    }

    // Filter by active/inactive
    if (is_active !== undefined) {
      where.is_active = is_active;
    }

    // Filter by date range
    if (start_date && end_date) {
      where.createdAt = { [Op.between]: [new Date(start_date), new Date(end_date)] };
    } else if (start_date) {
      where.createdAt = { [Op.gte]: new Date(start_date) };
    } else if (end_date) {
      where.createdAt = { [Op.lte]: new Date(end_date) };
    }

    // Exclude deleted if not requested
    if (!show_deleted) {
      where.deleted_by = null;
    }

    const { count, rows } = await Wards.findAndCountAll({
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
   * ✅ Get ward by ID
   */
  async getById(id) {
    const ward = await Wards.findByPk(id);
    if (!ward) throw new Error("Ward not found");
    return ward;
  },

  /**
   * ✅ Update ward
   */
  async update(id, data) {
    const ward = await Wards.findByPk(id);
    if (!ward) throw new Error("Ward not found");

    await ward.update(data);
    return ward;
  },

  /**
   * ✅ Soft delete ward
   */
  async delete(id, userInfo = {}) {
    const ward = await Wards.findByPk(id);
    if (!ward) throw new Error("Ward not found");

    await ward.update({
      is_active: false,
      deleted_by: userInfo.id || null,
      deleted_by_name: userInfo.name || null,
      deleted_by_email: userInfo.email || null,
    });

    return { message: "Ward deleted successfully" };
  },

  /**
   * ✅ Restore soft-deleted ward
   */
  async restore(id, userInfo = {}) {
    const ward = await Wards.findByPk(id);
    if (!ward) throw new Error("Ward not found");

    await ward.update({
      is_active: true,
      deleted_by: null,
      deleted_by_name: null,
      deleted_by_email: null,
      updated_by: userInfo.id || null,
      updated_by_name: userInfo.name || null,
      updated_by_email: userInfo.email || null,
    });

    return { message: "Ward restored successfully" };
  },
};

export default wardsService;