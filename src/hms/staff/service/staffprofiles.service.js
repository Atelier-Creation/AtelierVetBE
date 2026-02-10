import { Op } from "sequelize";
import StaffProfiles from "../models/staffprofiles.models.js";
import Departments from "../../hospital/models/department.models.js";
import Designations from "../../hospital/models/designation.models.js";
import EndUsers from "../../../user/models/user.model.js"; // update path as per your folder structure
import '../models/index.js'

const staffProfilesService = {
  /**
   * ✅ Create a new staff profile
   */
  async create(data) {
  // ✅ Auto-generate employee_code if not provided
  if (!data.employee_code) {
    // Example format: EMP-1001, EMP-1002, ...
    const lastStaff = await StaffProfiles.findOne({
      order: [["createdAt", "DESC"]],
    });

    const lastCodeNumber = lastStaff
      ? parseInt(lastStaff.employee_code.replace("EMP-", "")) || 1000
      : 1000;

    data.employee_code = `EMP-${lastCodeNumber + 1}`;
  }

  const staff = await StaffProfiles.create(data);
  return staff;
},


  /**
   * ✅ Get all staff profiles (with search, filters, pagination, and includes)
   */
  async getAll(options = {}) {
    const {
      page = 1,
      limit = 10,
      search = "",
      is_active,
      department_id,
      designation_id,
      start_date,
      end_date,
      sort_by = "createdAt",
      sort_order = "DESC",
      show_deleted = false,
    } = options;

    const offset = (page - 1) * limit;
    const where = {};

    // 🔍 Search by first name, last name, or employee code
    if (search) {
      where[Op.or] = [
        { first_name: { [Op.like]: `%${search}%` } },
        { last_name: { [Op.like]: `%${search}%` } },
        { employee_code: { [Op.like]: `%${search}%` } },
      ];
    }

    // Filter by department
    if (department_id) {
      where.department_id = department_id;
    }

    // Filter by designation
    if (designation_id) {
      where.designation_id = designation_id;
    }

    // Filter by active/inactive
    if (is_active !== undefined) {
      where.is_active = is_active;
    }

    // Filter by date range (createdAt)
    if (start_date && end_date) {
      where.createdAt = {
        [Op.between]: [new Date(start_date), new Date(end_date)],
      };
    } else if (start_date) {
      where.createdAt = { [Op.gte]: new Date(start_date) };
    } else if (end_date) {
      where.createdAt = { [Op.lte]: new Date(end_date) };
    }

    // Exclude soft-deleted if not requested
    if (!show_deleted) {
      where.deleted_by = null;
    }

    // 📜 Fetch paginated results with includes
    const { count, rows } = await StaffProfiles.findAndCountAll({
      where,
      offset,
      limit: Number(limit),
      order: [[sort_by, sort_order]],
      include: [
        {
          model: Departments,
          as: "department",
          attributes: ["id", "name"],
        },
        {
          model: Designations,
          as: "designation",
          attributes: ["id", "title"],
        },
        {
          model: EndUsers,
          as: "endusers",
          attributes: ["id", "email", "phone", "username"],
        },
      ],
    });

    return {
      total: count,
      currentPage: Number(page),
      totalPages: Math.ceil(count / limit),
      data: rows,
    };
  },

  /**
   * ✅ Get a staff profile by ID (with includes)
   */
  async getById(id) {
    const staff = await StaffProfiles.findByPk(id, {
      include: [
        {
          model: Departments,
          as: "department",
          attributes: ["id", "name"],
        },
        {
          model: Designations,
          as: "designation",
          attributes: ["id", "title"],
        },
        {
          model: EndUsers,
          as: "endusers",
          attributes: ["id", "email", "phone", "username"],
        },
      ],
    });

    if (!staff) throw new Error("Staff profile not found");
    return staff;
  },

  /**
   * ✅ Update staff profile
   */
  async update(id, data) {
    const staff = await StaffProfiles.findByPk(id);
    if (!staff) throw new Error("Staff profile not found");

    await staff.update(data);
    return staff;
  },

  /**
   * ✅ Soft delete staff profile
   */
  async delete(id, userInfo = {}) {
    const staff = await StaffProfiles.findByPk(id);
    if (!staff) throw new Error("Staff profile not found");

    await staff.update({
      is_active: false,
      deleted_by: userInfo.id || null,
      deleted_by_name: userInfo.name || null,
      deleted_by_email: userInfo.email || null,
    });

    return { message: "Staff profile deleted successfully" };
  },

  /**
   * ✅ Restore soft-deleted staff profile
   */
  async restore(id, userInfo = {}) {
    const staff = await StaffProfiles.findByPk(id);
    if (!staff) throw new Error("Staff profile not found");

    await staff.update({
      is_active: true,
      deleted_by: null,
      deleted_by_name: null,
      deleted_by_email: null,
      updated_by: userInfo.id || null,
      updated_by_name: userInfo.name || null,
      updated_by_email: userInfo.email || null,
    });

    return { message: "Staff profile restored successfully" };
  },
};

export default staffProfilesService;
