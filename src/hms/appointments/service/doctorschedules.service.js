import { sequelize } from "../../../db/index.js";
import DoctorSchedules from "../models/doctorschedules.models.js";
import Doctor from "../../staff/models/doctor.models.js";
import "../models/index.js"

function timeToMinutes(time) {
  const [h, m, s = 0] = time.split(":").map(Number);
  return h * 60 + m;
}

/**
 * Helper: Convert minutes to HH:MM format
 */
function minutesToTime(minutes) {
  const h = Math.floor(minutes / 60).toString().padStart(2, "0");
  const m = (minutes % 60).toString().padStart(2, "0");
  return `${h}:${m}:00`;
}

const doctorSchedulesService = {
  /**
   * ✅ Create Doctor Schedule
   */
  async create(data) {
  const requiredFields = [
    "doctor_id",
    "start_time",
    "end_time",
    "weekoffday",
    "slot_duration_minutes",
    "location",
  ];

  for (const field of requiredFields) {
    if (!data[field]) throw new Error(`${field} is required`);
  }

  // 🩺 Check if doctor schedule already exists
  const existingSchedule = await DoctorSchedules.findOne({
    where: { doctor_id: data.doctor_id, is_active: true },
  });

  if (existingSchedule) {
    throw new Error("Doctor schedule already exists");
  }

  // ✅ Create new schedule
  const schedule = await DoctorSchedules.create(data);
  return schedule;
},


  /**
   * ✅ Get All Doctor Schedules
   */
  async getAll(options = {}) {
    const {
      page = 1,
      limit = 10,
      search = "",
      is_active,
      sort_by = "createdAt",
      sort_order = "DESC",
      doctor_id, // optional filter
    } = options;

    const offset = (page - 1) * limit;
    const where = {};

    if (doctor_id) {
      where.doctor_id = doctor_id;
    }

    if (search) {
      where.location = { [sequelize.Op.like]: `%${search}%` };
    }

    if (is_active !== undefined) {
      where.is_active = is_active;
    }

    const { count, rows } = await DoctorSchedules.findAndCountAll({
      where,
      offset,
      limit: Number(limit),
      order: [[sort_by, sort_order]],
      include: [
        {
          model: Doctor,
          as: "doctor",
        },
      ]
    });

    return {
      total: count,
      currentPage: page,
      totalPages: Math.ceil(count / limit),
      data: rows,
    };
  },

  /**
   * ✅ Get Doctor Schedule by ID
   */
  async getById(id) {
    const schedule = await DoctorSchedules.findByPk(id);
    if (!schedule) throw new Error("Doctor schedule not found");
    return schedule;
  },

  async getByDoctorId(id) {
    const schedule = await DoctorSchedules.findOne({
      where: { doctor_id: id, is_active: true },
    });
    if (!schedule) throw new Error("Doctor schedule not found");
    return schedule;
  },

  /**
   * ✅ Update Doctor Schedule
   */
  async update(id, data) {
    const schedule = await DoctorSchedules.findByPk(id);
    if (!schedule) throw new Error("Doctor schedule not found");

    await schedule.update(data);
    return schedule;
  },

  /**
   * ✅ Soft Delete Doctor Schedule
   */
  async delete(id, userInfo = {}) {
    const schedule = await DoctorSchedules.findByPk(id);
    if (!schedule) throw new Error("Doctor schedule not found");

    await schedule.update({
      is_active: false,
      deleted_by: userInfo.id || null,
      deleted_by_name: userInfo.name || null,
      deleted_by_email: userInfo.email || null,
    });

    return { message: "Doctor schedule deleted successfully" };
  },

  /**
   * ✅ Restore Soft-Deleted Doctor Schedule
   */
  async restore(id, userInfo = {}) {
    const schedule = await DoctorSchedules.findByPk(id);
    if (!schedule) throw new Error("Doctor schedule not found");

    await schedule.update({
      is_active: true,
      deleted_by: null,
      deleted_by_name: null,
      deleted_by_email: null,
      updated_by: userInfo.id || null,
      updated_by_name: userInfo.name || null,
      updated_by_email: userInfo.email || null,
    });

    return { message: "Doctor schedule restored successfully" };
  },

 
};

export default doctorSchedulesService;
