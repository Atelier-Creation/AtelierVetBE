import { sequelize } from "../../../db/index.js";
import Doctor from "../models/doctor.models.js";
import bcrypt from "bcrypt";
import StaffProfiles from "../../staff/models/staffprofiles.models.js";
import EndUsers from "../../../user/models/user.model.js";
import Department from "../../hospital/models/department.models.js";
import Designation from "../../hospital/models/designation.models.js";

const doctorService = {
  /**
   * ✅ Create a doctor with optional staff profile and enduser
   */
  async create({ doctorData, staffData, password }) {
    if (!doctorData || !staffData || !password) {
      throw new Error("Doctor data, staff profile data, and password are required");
    }

    return await sequelize.transaction(async (t) => {
      let staffProfileId;
      let endUser;

      const hashed = await bcrypt.hash(password, 10);

      // 1️⃣ Create EndUser for Doctor
      const username = `${staffData.first_name} ${staffData.last_name}`;
      const userPayload = {
        username,
        email: doctorData.doctor_email,
        phone: doctorData.doctor_phone,
        password: hashed,
        role: "Doctor",
        is_active: true,
      };

      endUser = await EndUsers.create(userPayload, { transaction: t });

      // 2️⃣ Create StaffProfile
      staffData.user_id = endUser.id; // Link EndUser

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

      // 3️⃣ Create Doctor
      doctorData.staff_profile_id = staffProfileId;
      doctorData.doctor_name = `${staffData.first_name} ${staffData.last_name}`;
      const doctor = await Doctor.create(doctorData, { transaction: t });

      // 4️⃣ Return full created doctor (with staffProfileId and endUserId)
      return {
        doctor,
        staffProfile,
        endUser,
      };
    });
  },


  /**
   * ✅ Get all doctors (with staff profile and enduser)
   */
  async getAll(options = {}) {
    const { page = 1, limit = 10, search = "", is_active, sort_by = "createdAt", sort_order = "DESC" } = options;
    const offset = (page - 1) * limit;
    const where = {};

    if (search) {
      where.doctor_name = { [sequelize.Op.like]: `%${search}%` };
    }
    if (is_active !== undefined) {
      where.is_active = is_active;
    }

    const { count, rows } = await Doctor.findAndCountAll({
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
   * ✅ Get doctor by ID
   */
  async getById(id) {
    const doctor = await Doctor.findByPk(id, {
      include: [
        {
          model: StaffProfiles,
          as: "staff_profiles",
          include: [{ model: EndUsers, as: "endusers", attributes: ["id", "email", "username", "phone"] },
        { model: Department, as: "department", attributes: ["id", "name"] },
        { model: Designation, as: "designation", attributes: ["id", "title"] },],
        },
      ],
    });
    if (!doctor) throw new Error("Doctor not found");
    return doctor;
  },

  /**
   * ✅ Update doctor
   */
  async update(id, data) {
    const doctor = await Doctor.findByPk(id);
    if (!doctor) throw new Error("Doctor not found");
    await doctor.update(data);
    return doctor;
  },

  /**
   * ✅ Soft delete doctor
   */
  async delete(id, userInfo = {}) {
    const doctor = await Doctor.findByPk(id);
    if (!doctor) throw new Error("Doctor not found");

    await doctor.update({
      is_active: false,
      deleted_by: userInfo.id || null,
      deleted_by_name: userInfo.name || null,
      deleted_by_email: userInfo.email || null,
    });

    return { message: "Doctor deleted successfully" };
  },

  /**
   * ✅ Restore soft-deleted doctor
   */
  async restore(id, userInfo = {}) {
    const doctor = await Doctor.findByPk(id);
    if (!doctor) throw new Error("Doctor not found");

    await doctor.update({
      is_active: true,
      deleted_by: null,
      deleted_by_name: null,
      deleted_by_email: null,
      updated_by: userInfo.id || null,
      updated_by_name: userInfo.name || null,
      updated_by_email: userInfo.email || null,
    });

    return { message: "Doctor restored successfully" };
  },
};

export default doctorService;
