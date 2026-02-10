import { Op } from "sequelize";
import LabTestsMaster from "../models/labtestsmaster.models.js";

const labTestsMasterService = {
  /**
   * ✅ Create a new lab test
   */
  async create(data) {
    const labTest = await LabTestsMaster.create(data);
    return labTest;
  },

  /**
   * ✅ Get all lab tests (with search, pagination, filters)
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

    // 🔍 Search by name or code
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

    // Exclude deleted if not requested
    if (!show_deleted) {
      where.deleted_by = null;
    }

    // 📜 Fetch paginated results
    const { count, rows } = await LabTestsMaster.findAndCountAll({
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
   * ✅ Get lab test by ID
   */
  async getById(id) {
    const labTest = await LabTestsMaster.findByPk(id);
    if (!labTest) throw new Error("Lab Test not found");
    return labTest;
  },

  /**
   * ✅ Update lab test
   */
  async update(id, data) {
    const labTest = await LabTestsMaster.findByPk(id);
    if (!labTest) throw new Error("Lab Test not found");

    await labTest.update(data);
    return labTest;
  },

  /**
   * ✅ Soft delete lab test
   */
  async delete(id, userInfo = {}) {
    const labTest = await LabTestsMaster.findByPk(id);
    if (!labTest) throw new Error("Lab Test not found");

    await labTest.update({
      is_active: false,
      deleted_by: userInfo.id || null,
      deleted_by_name: userInfo.name || null,
      deleted_by_email: userInfo.email || null,
    });

    return { message: "Lab Test deleted successfully" };
  },

  /**
   * ✅ Restore soft-deleted lab test
   */
  async restore(id, userInfo = {}) {
    const labTest = await LabTestsMaster.findByPk(id);
    if (!labTest) throw new Error("Lab Test not found");

    await labTest.update({
      is_active: true,
      deleted_by: null,
      deleted_by_name: null,
      deleted_by_email: null,
      updated_by: userInfo.id || null,
      updated_by_name: userInfo.name || null,
      updated_by_email: userInfo.email || null,
    });

    return { message: "Lab Test restored successfully" };
  },
};

export default labTestsMasterService;
