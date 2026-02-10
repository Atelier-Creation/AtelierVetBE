import { sequelize } from "../../../db/index.js";
import bcrypt from "bcrypt";
import Receptionists from "../models/receptionists.models.js";
import StaffProfiles from "../../staff/models/staffprofiles.models.js";
import EndUsers from "../../../user/models/user.model.js";
import Department from "../../hospital/models/department.models.js";
import Designation from "../../hospital/models/designation.models.js";

const receptionistsService = {
  /**
   * ✅ Create Receptionist with StaffProfile and EndUser
   */
  async create({ receptionistData, staffData, password }) {
    if (!receptionistData || !staffData || !password) {
      throw new Error("Receptionist data, staff profile data, and password are required");
    }

    return await sequelize.transaction(async (t) => {
      // 1️⃣ Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // 2️⃣ Create EndUser
      const username = `${staffData.first_name} ${staffData.last_name}`;
      const userPayload = {
        username,
        email: receptionistData.receptionist_email,
        phone: receptionistData.receptionist_phone,
        password: hashedPassword,
        role: "Receptionist",
        is_active: true,
      };
      const endUser = await EndUsers.create(userPayload, { transaction: t });

      // 3️⃣ Create Staff Profile
      staffData.user_id = endUser.id;

      // Auto-generate employee_code if not provided
      if (!staffData.employee_code) {
        const lastStaff = await StaffProfiles.findOne({
          order: [["createdAt", "DESC"]],
          transaction: t,
        });
        const lastCodeNumber = lastStaff
          ? parseInt(lastStaff.employee_code.replace("EMP-", "")) || 1000
          : 1000;
        staffData.employee_code = `EMP-${lastCodeNumber + 1}`;
      }

      const staffProfile = await StaffProfiles.create(staffData, { transaction: t });

      // 4️⃣ Create Receptionist
      receptionistData.staff_profile_id = staffProfile.id;
      const receptionist = await Receptionists.create(receptionistData, { transaction: t });

      // 5️⃣ Return all created records
      return {
        receptionist,
        staffProfile,
        endUser,
      };
    });
  },

  /**
   * ✅ Get all Receptionists (with staff profile, department, designation, user)
   */
  async getAll(options = {}) {
    const {
      page = 1,
      limit = 10,
      search = "",
      is_active,
      sort_by = "createdAt",
      sort_order = "DESC",
    } = options;

    const offset = (page - 1) * limit;
    const where = {};

    if (search) {
      where.receptionist_name = { [sequelize.Op.like]: `%${search}%` };
    }
    if (is_active !== undefined) {
      where.is_active = is_active;
    }

    const { count, rows } = await Receptionists.findAndCountAll({
      where,
      offset,
      limit: Number(limit),
      order: [[sort_by, sort_order]],
      include: [
        {
          model: StaffProfiles,
          as: "staff_profiles",
          include: [
            { model: EndUsers, as: "endusers", attributes: ["id", "email", "username", "phone"] },
            { model: Department, as: "department", attributes: ["id", "name"] },
            { model: Designation, as: "designation", attributes: ["id", "title"] },
          ],
        },
      ],
    });

    return {
      total: count,
      currentPage: page,
      totalPages: Math.ceil(count / limit),
      data: rows,
    };
  },

  /**
   * ✅ Get Receptionist by ID
   */
  async getById(id) {
    const receptionist = await Receptionists.findByPk(id, {
      include: [
        {
          model: StaffProfiles,
          as: "staff_profiles",
          include: [
            { model: EndUsers, as: "endusers", attributes: ["id", "email", "username", "phone"] },
            { model: Department, as: "department", attributes: ["id", "name"] },
            { model: Designation, as: "designation", attributes: ["id", "title"] },
          ],
        },
      ],
    });
    if (!receptionist) throw new Error("Receptionist not found");
    return receptionist;
  },

  /**
   * ✅ Update Receptionist
   */
  async update(id, data) {
    const receptionist = await Receptionists.findByPk(id);
    if (!receptionist) throw new Error("Receptionist not found");
    await receptionist.update(data);
    return receptionist;
  },

  /**
   * ✅ Soft Delete Receptionist
   */
  async delete(id, userInfo = {}) {
    const receptionist = await Receptionists.findByPk(id);
    if (!receptionist) throw new Error("Receptionist not found");

    await receptionist.update({
      is_active: false,
      deleted_by: userInfo.id || null,
      deleted_by_name: userInfo.name || null,
      deleted_by_email: userInfo.email || null,
    });

    return { message: "Receptionist deleted successfully" };
  },

  /**
   * ✅ Restore Soft-Deleted Receptionist
   */
  async restore(id, userInfo = {}) {
    const receptionist = await Receptionists.findByPk(id);
    if (!receptionist) throw new Error("Receptionist not found");

    await receptionist.update({
      is_active: true,
      deleted_by: null,
      deleted_by_name: null,
      deleted_by_email: null,
      updated_by: userInfo.id || null,
      updated_by_name: userInfo.name || null,
      updated_by_email: userInfo.email || null,
    });

    return { message: "Receptionist restored successfully" };
  },
};

export default receptionistsService;
