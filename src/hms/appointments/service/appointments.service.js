import { sequelize } from "../../../db/index.js";
import Appointments from "../models/appointments.models.js";
import DoctorSchedules from "../models/doctorschedules.models.js";
import Doctor from "../../staff/models/doctor.models.js";
import Client from "../../clients/models/clients.models.js";
import StaffProfile from "../../staff/models/staffprofiles.models.js";
import Department from "../../hospital/models/department.models.js";
import { Op } from "sequelize";

/**
 * Helper: Convert HH:MM:SS to minutes
 */
function timeToMinutes(time) {
  const [h, m, s = 0] = time.split(":").map(Number);
  return h * 60 + m;
}

function minutesToTime(minutes) {
  const h = Math.floor(minutes / 60).toString().padStart(2, "0");
  const m = (minutes % 60).toString().padStart(2, "0");
  return `${h}:${m}:00`;
}

const appointmentsService = {
  /**
   * ✅ Create Appointment
   */
  async create(data) {
    // Required fields
    const requiredFields = [
      "client_id",
      "doctor_id",
      "scheduled_at",
      "scheduled_time",
      "visit_type",
    ];
    for (const field of requiredFields) {
      if (!data[field]) throw new Error(`${field} is required`);
    }

    // Check doctor schedule availability
    const doctorSchedule = await DoctorSchedules.findOne({
      where: { doctor_id: data.doctor_id, is_active: true },
    });
    if (!doctorSchedule) {
      throw new Error("Doctor schedule not found. The doctor may be unavailable.");
    }

    // Check doctor's week-off
    const dayOfWeek = new Date(data.scheduled_at).toLocaleString("en-US", {
      weekday: "long",
    });
    if (doctorSchedule.weekoffday === dayOfWeek) {
      throw new Error(`Doctor is not available on ${dayOfWeek}`);
    }

    // Convert times to minutes
    const appointmentMinutes = timeToMinutes(data.scheduled_time);
    const scheduleStart = timeToMinutes(doctorSchedule.start_time);
    const scheduleEnd = timeToMinutes(doctorSchedule.end_time);
    const slotDuration = doctorSchedule.slot_duration_minutes;

    // Check if appointment is within schedule
    if (appointmentMinutes < scheduleStart || appointmentMinutes + slotDuration > scheduleEnd) {
      throw new Error(
        `Doctor is only available between ${doctorSchedule.start_time} and ${doctorSchedule.end_time}`
      );
    }

    // Fetch existing appointments for the doctor on the scheduled date
    const startOfDay = new Date(data.scheduled_at);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(data.scheduled_at);
    endOfDay.setHours(23, 59, 59, 999);

    const existingAppointments = await Appointments.findAll({
      where: {
        doctor_id: data.doctor_id,
        scheduled_at: { [Op.between]: [startOfDay, endOfDay] },
        status: { [Op.ne]: "Cancelled" },
      },
    });

    // Check for overlapping appointments
    for (const appt of existingAppointments) {
      const existingStart = timeToMinutes(appt.scheduled_time);
      const existingEnd = existingStart + slotDuration;
      const newStart = appointmentMinutes;
      const newEnd = appointmentMinutes + slotDuration;

      if (newStart < existingEnd && newEnd > existingStart) {
        throw new Error("This time slot is already booked for the doctor.");
      }
    }

    // Generate appointment number
    const count = await Appointments.count();
    data.appointment_no = `APT-${String(count + 1).padStart(5, "0")}`;

    // Create appointment
    const appointment = await Appointments.create(data);
    return appointment;
  },

  /**
   * ✅ Get All Appointments
   */
  async getAll(options = {}) {
    const {
      page = 1,
      limit = 10,
      search = "",
      status,
      doctor_id,
      client_id,
      start_date,
      end_date,
      sort_by = "createdAt",
      sort_order = "DESC",
    } = options;

    const offset = (page - 1) * limit;
    const where = {};

    if (search) {
      where[Op.or] = [
        { appointment_no: { [Op.like]: `%${search}%` } },
        { reason: { [Op.like]: `%${search}%` } },
      ];
    }

    if (status) where.status = status;
    if (doctor_id) where.doctor_id = doctor_id;
    if (client_id) where.client_id = client_id;
    if (start_date && end_date)
      where.scheduled_at = { [Op.between]: [new Date(start_date), new Date(end_date)] };

    const { count, rows } = await Appointments.findAndCountAll({
      where,
      offset,
      limit: Number(limit),
      order: [[sort_by, sort_order]],
      include: [
        { model: Doctor, as: "doctor" },
        { model: Client, as: "client" },
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
   * ✅ Get Appointment by ID
   */
  async getById(id) {
    const appointment = await Appointments.findByPk(id, {
      include: [
        { model: Doctor, as: "doctor" },
        { model: Client, as: "client" },
      ],
    });
    if (!appointment) throw new Error("Appointment not found");
    return appointment;
  },

  /**
   * ✅ Update Appointment
   */
  async update(id, data) {
    const appointment = await Appointments.findByPk(id);
    if (!appointment) throw new Error("Appointment not found");

    await appointment.update(data);
    return appointment;
  },

  /**
   * ✅ Soft Delete Appointment
   */
  async delete(id, userInfo = {}) {
    const appointment = await Appointments.findByPk(id);
    if (!appointment) throw new Error("Appointment not found");

    await appointment.update({
      status: "Cancelled",
      deleted_by: userInfo.id || null,
      deleted_by_name: userInfo.name || null,
      deleted_by_email: userInfo.email || null,
    });

    return { message: "Appointment cancelled successfully" };
  },

  /**
   * ✅ Restore Appointment
   */
  async restore(id, userInfo = {}) {
    const appointment = await Appointments.findByPk(id);
    if (!appointment) throw new Error("Appointment not found");

    await appointment.update({
      status: "Pending",
      deleted_by: null,
      deleted_by_name: null,
      deleted_by_email: null,
      updated_by: userInfo.id || null,
      updated_by_name: userInfo.name || null,
      updated_by_email: userInfo.email || null,
    });

    return { message: "Appointment restored successfully" };
  },

  async getAvailableSlots() {
    // Get all active doctor schedules with doctor + staff profile + department
    const schedules = await DoctorSchedules.findAll({
      where: { is_active: true },
      include: [
        {
          model: Doctor,
          as: "doctor",
          include: [
            {
              model: StaffProfile,
              as: "staff_profiles",
              include: [
                {
                  model: Department,
                  as: "department",
                },
              ],
            },
          ],
        },
      ],
    });
    console.log(schedules);

    const today = new Date();
    const results = [];

    for (const schedule of schedules) {
      const doctorId = schedule.doctor_id;
      const slotDuration = schedule.slot_duration_minutes;

      // Loop through today + next 5 days
      for (let dayOffset = 0; dayOffset < 6; dayOffset++) {
        const date = new Date(today);
        date.setDate(today.getDate() + dayOffset);
        const dayOfWeek = date.toLocaleString("en-US", { weekday: "long" });

        // Skip if doctor has a week-off
        if (schedule.weekoffday === dayOfWeek) continue;

        // Generate all possible slots for the day
        const startMinutes = timeToMinutes(schedule.start_time);
        const endMinutes = timeToMinutes(schedule.end_time);

        const slots = [];
        for (let t = startMinutes; t + slotDuration <= endMinutes; t += slotDuration) {
          slots.push(minutesToTime(t));
        }

        // Fetch existing appointments for this doctor on this date
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        const bookedAppointments = await Appointments.findAll({
          where: {
            doctor_id: doctorId,
            scheduled_at: { [Op.between]: [startOfDay, endOfDay] },
            status: { [Op.ne]: "Cancelled" },
          },
        });

        const bookedTimes = bookedAppointments.map(a => a.scheduled_time);

        // Filter out booked slots
        const availableSlots = slots.filter(slot => !bookedTimes.includes(slot));

        results.push({
          doctor_id: doctorId,
          doctor_name: schedule.doctor?.doctor_name,
          doctor_speciality: schedule.doctor?.specialties || null,
          department_id: schedule.doctor?.staff_profiles?.department?.id || null,
          department_name: schedule.doctor?.staff_profiles?.department?.name || null,
          date: date.toISOString().split("T")[0],
          available_slots: availableSlots,
        });
      }
    }

    return results;
  },

  async  getAppointmentsTodayByDoctorId(userId) {
  try {
    // 🧩 Step 1: Find staff profile for the logged-in user
    const staffProfile = await StaffProfile.findOne({
      where: { user_id: userId },
    });
    if (!staffProfile) throw new Error("Staff profile not found for this user");

    // 🧩 Step 2: Find the doctor record linked to the staff profile
    const doctor = await Doctor.findOne({
      where: { staff_profile_id: staffProfile.id },
    });
    if (!doctor) throw new Error("Doctor not found for this user");

    // 🗓 Step 3: Compute today’s date range (local time)
    const today = new Date();
    const startOfDay = new Date(today);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999);

    // 🧾 Step 4: Fetch today’s appointments
    const appointments = await Appointments.findAll({
      where: {
        doctor_id: doctor.id,
        scheduled_at: {
          [Op.between]: [startOfDay, endOfDay],
        },
        status: { [Op.ne]: "Cancelled" }, // exclude cancelled ones
      },
      include: [
        {
          model: Client,
          as: "client",
          attributes: ["id", "first_name", "last_name", "client_code"],
        },
      ],
      order: [["scheduled_time", "ASC"]],
    });

    return appointments;
  } catch (error) {
    console.error("❌ Error fetching today's appointments:", error.message);
    throw new Error(error.message || "Unable to fetch today's appointments");
  }
},
};

export default appointmentsService;
