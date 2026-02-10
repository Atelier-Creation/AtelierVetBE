import { Op } from "sequelize";
import Procedures from "../models/procedures.models.js";

const proceduresService = {
  /**
   * ✅ Create a new procedure
   */
  async create(data) {
    const procedure = await Procedures.create(data);
    return procedure;
  },

  /**
   * ✅ Get all procedures (with search, pagination, filters)
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

    // 🔍 Search by name or procedure_code or description
    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { procedure_code: { [Op.like]: `%${search}%` } },
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
    const { count, rows } = await Procedures.findAndCountAll({
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
   * ✅ Get procedure by ID
   */
  async getById(id) {
    const procedure = await Procedures.findByPk(id);
    if (!procedure) throw new Error("Procedure not found");
    return procedure;
  },

  /**
   * ✅ Update procedure
   */
  async update(id, data) {
    const procedure = await Procedures.findByPk(id);
    if (!procedure) throw new Error("Procedure not found");

    await procedure.update(data);
    return procedure;
  },

  /**
   * ✅ Soft delete procedure
   */
  async delete(id, userInfo = {}) {
    const procedure = await Procedures.findByPk(id);
    if (!procedure) throw new Error("Procedure not found");

    await procedure.update({
      is_active: false,
      deleted_by: userInfo.id || null,
      deleted_by_name: userInfo.name || null,
      deleted_by_email: userInfo.email || null,
    });

    return { message: "Procedure deleted successfully" };
  },

  /**
   * ✅ Restore soft-deleted procedure
   */
  async restore(id, userInfo = {}) {
    const procedure = await Procedures.findByPk(id);
    if (!procedure) throw new Error("Procedure not found");

    await procedure.update({
      is_active: true,
      deleted_by: null,
      deleted_by_name: null,
      deleted_by_email: null,
      updated_by: userInfo.id || null,
      updated_by_name: userInfo.name || null,
      updated_by_email: userInfo.email || null,
    });

    return { message: "Procedure restored successfully" };
  },
};

export default proceduresService;
