import { sequelize } from "../../../db/index.js";
import Patients from "../models/patients.models.js";
import EndUsers from "../../../user/models/user.model.js";
import bcrypt from "bcrypt";
import { Op } from "sequelize";
import "../models/index.js";
import Encounters from "../../clinical/models/encounters.models.js"; // if encounters model sits beside patients
import Appointments from "../../appointments/models/appointments.models.js"; // adjust if different
import Vitals from "../../clinical/models/vitals.models.js";
import Admissions from "../../admissions/models/admissions.models.js";
import Diagnoses from "../../clinical/models/diagnoses.models.js";
import ClinicalNotes from "../../clinical/models/clinicalnotes.models.js";
import LabTestOrders from "../../laboratory/models/labtestorders.models.js";
import LabTestOrderItems from "../../laboratory/models/labtestordersiteams.models.js";
import Room from "../../admissions/models/rooms.models.js";

//
// Helper: calculate years from dob (string or Date). Returns integer >= 0 or null if invalid
//
function calculateAge(dob) {
  if (!dob) return null;
  const birth = typeof dob === "string" ? new Date(dob) : dob;
  if (!(birth instanceof Date) || isNaN(birth.getTime())) return null;
  const today = new Date();
  let years = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    years--;
  }
  return years >= 0 ? years : 0;
}

const patientService = {
  /**
   * Create patient and linked EndUser within a transaction.
   * Automatically calculates age from dob (if provided).
   *
   * @param {Object} param0
   * @param {Object} param0.patientData - patient payload
   * @param {string} param0.password - plaintext password for linked EndUser
   */
  async create({ patientData, password }) {
    if (!patientData || !password) {
      throw new Error("Patient data and password are required");
    }

    // If dob provided, auto-calc age (overwrites incoming age)
    if (patientData.dob) {
      const calculated = calculateAge(patientData.dob);
      if (calculated !== null) {
        patientData.age = calculated;
      }
    }

    return await sequelize.transaction(async (t) => {
      // Hash password for user account
      const hashedPassword = await bcrypt.hash(password, 10);

      // 1️⃣ Create EndUser
      const username = `${patientData.first_name} ${patientData.last_name}`;
      const endUserPayload = {
        username,
        email: patientData.email,
        phone: patientData.phone,
        password: hashedPassword,
        role: "Patient",
        is_active: true,
      };

      const endUser = await EndUsers.create(endUserPayload, { transaction: t });

      // 2️⃣ Generate unique patient code if not provided
      if (!patientData.patient_code) {
        const lastPatient = await Patients.findOne({
          order: [["createdAt", "DESC"]],
          transaction: t,
        });

        const lastCodeNumber = lastPatient
          ? parseInt((lastPatient.patient_code || "").replace("PAT-", ""), 10) || 1000
          : 1000;

        patientData.patient_code = `PAT-${lastCodeNumber + 1}`;
      }

      // 3️⃣ Create patient and link to EndUser
      patientData.user_id = endUser.id;

      const patient = await Patients.create(patientData, { transaction: t });

      // 4️⃣ Return full created patient (with EndUser)
      return {
        patient,
        endUser,
      };
    });
  },

  /**
   * Get all patients with filters and pagination
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
      // simple search on first_name (you can expand to include last_name/email/phone)
      where.first_name = { [Op.like]: `%${search}%` };
      where.phone = {[Op.like]: `%${search}%`};
      where.id = {[Op.like]: `%${search}%`}
    }

    if (is_active !== undefined) {
      where.is_active = is_active;
    }

    const { count, rows } = await Patients.findAndCountAll({
      where,
      offset,
      limit: Number(limit),
      order: [[sort_by, sort_order]],
      include: [
        {
          model: EndUsers,
          as: "endusers",
          attributes: ["id", "username", "email", "phone", "role"],
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
   * Get single patient by ID
   */
  async getById(id) {
    const patient = await Patients.findByPk(id, {
      include: [
        {
          model: EndUsers,
          as: "endusers",
          attributes: ["id", "username", "email", "phone", "role"],
        },
      ],
    });

    if (!patient) throw new Error("Patient not found");
    return patient;
  },

  /**
   * Get patient history (encounters, appointments, vitals, admissions, diagnoses, notes, lab orders)
   */
  async getHistory(patientId, options = {}) {
    if (!patientId) throw new Error("patientId is required");

    const { fromDate, toDate, limit = 100 } = options;
    const dateFilter = {};
    if (fromDate) dateFilter[Op.gte] = new Date(fromDate);
    if (toDate) dateFilter[Op.lte] = new Date(toDate);

    // 1) Fetch encounters first (so we get encounter IDs)
    const encounterWhere = { patient_id: patientId };
    if (fromDate || toDate) encounterWhere.encounter_date = dateFilter;

    const encounters = await Encounters.findAll({
      where: encounterWhere,
      order: [["encounter_date", "DESC"]],
      limit,
    });

    const encounterIds = encounters.map((e) => e.id);

    // 2) Parallel fetch of related resources
    const [
      appointments,
      vitals,
      admissions,
      diagnoses,
      clinicalNotes,
      labOrders,
    ] = await Promise.all([
      // Appointments for patient
      Appointments.findAll({
        where: (() => {
          const w = { patient_id: patientId };
          if (fromDate || toDate) w.scheduled_at = dateFilter;
          return w;
        })(),
        order: [["scheduled_at", "DESC"]],
        limit,
      }),

      // Vitals recorded for patient (optionally linked to encounter)
      Vitals.findAll({
        where: (() => {
          const w = { patient_id: patientId };
          if (encounterIds.length) w.encounter_id = { [Op.in]: encounterIds };
          if (fromDate || toDate) w.measured_at = dateFilter;
          return w;
        })(),
        order: [["measured_at", "DESC"]],
        limit,
      }),

      // Admissions for patient
      Admissions.findAll({
        where: (() => {
          const w = { patient_id: patientId };
          if (fromDate || toDate) w.admission_date = dateFilter;
          return w;
        })(),
        order: [["admission_date", "DESC"]],
        limit,
        include: [
          {
            model: Room,
            as: "room",
          },
        ],
      }),

      // Diagnoses (linked by encounter_id)
      Diagnoses.findAll({
        where: encounterIds.length ? { encounter_id: { [Op.in]: encounterIds } } : { encounter_id: null },
        order: [["createdAt", "DESC"]],
        limit,
      }),

      // Clinical notes (by encounter)
      ClinicalNotes.findAll({
        where: encounterIds.length ? { encounter_id: { [Op.in]: encounterIds } } : { encounter_id: null },
        order: [["createdAt", "DESC"]],
        limit,
      }),

      // Lab orders + items
      LabTestOrders.findAll({
        where: (() => {
          const w = { patient_id: patientId };
          if (encounterIds.length) w.encounter_id = { [Op.in]: encounterIds };
          if (fromDate || toDate) w.order_date = dateFilter;
          return w;
        })(),
        include: [
          {
            model: LabTestOrderItems,
            as: "items", // ensure your model association uses 'items' alias
          },
        ],
        order: [["order_date", "DESC"]],
        limit,
      }),
    ]);

    return {
      encounters,
      appointments,
      vitals,
      admissions,
      diagnoses,
      clinicalNotes,
      labOrders,
    };
  },

  /**
   * Update patient details
   * If dob present in update payload, recalc age automatically.
   */
  async update(id, data) {
    const patient = await Patients.findByPk(id);
    if (!patient) throw new Error("Patient not found");

    // if dob present in update payload, recalc age
    if (data.dob) {
      const calculated = calculateAge(data.dob);
      if (calculated !== null) {
        data.age = calculated;
      }
    }

    await patient.update(data);
    return patient;
  },

  /**
   * Soft delete patient
   */
  async delete(id, userInfo = {}) {
    const patient = await Patients.findByPk(id);
    if (!patient) throw new Error("Patient not found");

    await patient.update({
      is_active: false,
      deleted_by: userInfo.id || null,
      deleted_by_name: userInfo.name || null,
      deleted_by_email: userInfo.email || null,
    });

    return { message: "Patient deleted successfully" };
  },

  /**
   * Restore soft-deleted patient
   */
  async restore(id, userInfo = {}) {
    const patient = await Patients.findByPk(id);
    if (!patient) throw new Error("Patient not found");

    await patient.update({
      is_active: true,
      deleted_by: null,
      deleted_by_name: null,
      deleted_by_email: null,
      updated_by: userInfo.id || null,
      updated_by_name: userInfo.name || null,
      updated_by_email: userInfo.email || null,
    });

    return { message: "Patient restored successfully" };
  },
};

export default patientService;
