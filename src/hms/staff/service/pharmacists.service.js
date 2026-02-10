import { sequelize } from "../../../db/index.js";
import bcrypt from "bcrypt";
import Pharmacists from "../models/pharmacists.models.js";
import StaffProfiles from "../../staff/models/staffprofiles.models.js";
import EndUsers from "../../../user/models/user.model.js";
import Department from "../../hospital/models/department.models.js";
import Designation from "../../hospital/models/designation.models.js";

const pharmacistService = {
  /**
   * ✅ Create a pharmacist with StaffProfile and EndUser
   */
  async create({ pharmacistData, staffData, password }) {
    if (!pharmacistData || !staffData || !password) {
      throw new Error("Pharmacist data, staff profile data, and password are required");
    }

    return await sequelize.transaction(async (t) => {
      let staffProfileId;
      let endUser;

      // 1️⃣ Hash password
      const hashed = await bcrypt.hash(password, 10);

      // 2️⃣ Create EndUser
      const username = `${staffData.first_name} ${staffData.last_name}`;
      const userPayload = {
        username,
        email: pharmacistData.pharmacist_email,
        phone: pharmacistData.pharmacist_phone,
        password: hashed,
        role: "Pharmacist",
        is_active: true,
      };

      endUser = await EndUsers.create(userPayload, { transaction: t });

      // 3️⃣ Create StaffProfile
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
      staffProfileId = staffProfile.id;

      // 4️⃣ Create Pharmacist
      pharmacistData.staff_profile_id = staffProfileId;
      const pharmacist = await Pharmacists.create(pharmacistData, { transaction: t });

      // 5️⃣ Return full created pharmacist
      return {
        pharmacist,
        staffProfile,
        endUser,
      };
    });
  },

  /**
   * ✅ Get all pharmacists (with staff profile, department, designation, user)
   */
  async getAll(options = {}) {
    const { page = 1, limit = 10, search = "", is_active, sort_by = "createdAt", sort_order = "DESC" } = options;
    const offset = (page - 1) * limit;
    const where = {};

    if (search) {
      where.pharmacist_name = { [sequelize.Op.like]: `%${search}%` };
    }
    if (is_active !== undefined) {
      where.is_active = is_active;
    }

    const { count, rows } = await Pharmacists.findAndCountAll({
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
   * ✅ Get pharmacist by ID
   */
  async getById(id) {
    const pharmacist = await Pharmacists.findByPk(id, {
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

    if (!pharmacist) throw new Error("Pharmacist not found");
    return pharmacist;
  },

  /**
   * ✅ Update pharmacist
   */
  async update(id, data) {
    const pharmacist = await Pharmacists.findByPk(id);
    if (!pharmacist) throw new Error("Pharmacist not found");
    await pharmacist.update(data);
    return pharmacist;
  },

  /**
   * ✅ Soft delete pharmacist
   */
  async delete(id, userInfo = {}) {
    const pharmacist = await Pharmacists.findByPk(id);
    if (!pharmacist) throw new Error("Pharmacist not found");

    await pharmacist.update({
      is_active: false,
      deleted_by: userInfo.id || null,
      deleted_by_name: userInfo.name || null,
      deleted_by_email: userInfo.email || null,
    });

    return { message: "Pharmacist deleted successfully" };
  },

  /**
   * ✅ Restore pharmacist
   */
  async restore(id, userInfo = {}) {
    const pharmacist = await Pharmacists.findByPk(id);
    if (!pharmacist) throw new Error("Pharmacist not found");

    await pharmacist.update({
      is_active: true,
      deleted_by: null,
      deleted_by_name: null,
      deleted_by_email: null,
      updated_by: userInfo.id || null,
      updated_by_name: userInfo.name || null,
      updated_by_email: userInfo.email || null,
    });

    return { message: "Pharmacist restored successfully" };
  },
};

export default pharmacistService;
