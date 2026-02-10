import doctorService from "../service/doctor.service.js";
// import staffProfilesService from "../../staff/service/staffprofiles.service.js";
// import userService from "../../../user/services/user.service.js";
import parseZodSchema from "../../../utils/zodPharser.js";
import { createStaffProfileSchema } from "../../staff/dto/staffprofiles.dto.js";
// import { registerSchema } from "../../../user/dto/user.dto.js"; // assuming you have this

const doctorController = {
  /**
   * ✅ Create a doctor with StaffProfile and EndUser
   */
  async create(req, res) {
    try {
      // 1️⃣ Extract password from body
      const { password } = req.body.user || {};
      if (!password) return res.sendError("Password is required for user creation");

      // 2️⃣ Validate and prepare staff profile data
      const staffData = await parseZodSchema(createStaffProfileSchema, req.body.staff);

      // 3️⃣ Prepare doctor data
      const doctorData = {
        doctor_name: req.body.doctor_name,
        doctor_email: req.body.doctor_email,
        doctor_phone: req.body.doctor_phone,
        specialties: req.body.specialties,
        consultation_fee: req.body.consultation_fee,
        available_online: req.body.available_online || false,
        is_active: true,
        created_by: req.user?.id,
        created_by_name: req.user?.username,
        created_by_email: req.user?.email,
      };

      // 4️⃣ Prepare user data for EndUser creation
      const username = `${staffData.first_name} ${staffData.last_name}`;
      const userData = {
        username,
        email: doctorData.doctor_email,
        phone: doctorData.doctor_phone,
        password,
        role: "Doctor",
        is_active: true,
      };

      // 5️⃣ Call service to create EndUser, StaffProfile, and Doctor
      const result = await doctorService.create({ doctorData, staffData, password });

      return res.sendSuccess(result, "Doctor, Staff Profile, and User created successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to create doctor");
    }
  },


  /**
   * ✅ Get all doctors
   */
  async getAll(req, res) {
    try {
      const doctors = await doctorService.getAll(req.query);
      return res.sendSuccess(doctors, "Doctors fetched successfully");
    } catch (err) {
      return res.sendError(err.message || "Failed to fetch doctors");
    }
  },

  /**
   * ✅ Get doctor by ID
   */
  async getById(req, res) {
    try {
      const { id } = req.params;
      const doctor = await doctorService.getById(id);
      return res.sendSuccess(doctor, "Doctor fetched successfully");
    } catch (err) {
      return res.sendError(err.message || "Failed to fetch doctor");
    }
  },

  /**
   * ✅ Update doctor
   */
  async update(req, res) {
    try {
      const { id } = req.params;
      const doctor = await doctorService.update(id, req.body);
      return res.sendSuccess(doctor, "Doctor updated successfully");
    } catch (err) {
      return res.sendError(err.message || "Failed to update doctor");
    }
  },

  /**
   * ✅ Delete doctor
   */
  async delete(req, res) {
    try {
      const { id } = req.params;
      const result = await doctorService.delete(id, req.user);
      return res.sendSuccess(result, "Doctor deleted successfully");
    } catch (err) {
      return res.sendError(err.message || "Failed to delete doctor");
    }
  },

  /**
   * ✅ Restore doctor
   */
  async restore(req, res) {
    try {
      const { id } = req.params;
      const result = await doctorService.restore(id, req.user);
      return res.sendSuccess(result, "Doctor restored successfully");
    } catch (err) {
      return res.sendError(err.message || "Failed to restore doctor");
    }
  },
};

export default doctorController;
