import { sequelize } from "../../../db/index.js";
import Clients from "../models/clients.models.js";
import EndUsers from "../../../user/models/user.model.js";
import bcrypt from "bcrypt";
import { Op } from "sequelize";
import "../models/index.js";
import Encounters from "../../clinical/models/encounters.models.js"; // if encounters model sits beside clients
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

const clientService = {
  /**
   * Create client and linked EndUser within a transaction.
   * Automatically calculates age from dob (if provided).
   *
   * @param {Object} param0
   * @param {Object} param0.clientData - client payload
   * @param {string} param0.password - plaintext password for linked EndUser
   */
  async create({ clientData, password }) {
    if (!clientData || !password) {
      throw new Error("Client data and password are required");
    }

    // If dob provided, auto-calc age (overwrites incoming age)
    if (clientData.dob) {
      const calculated = calculateAge(clientData.dob);
      if (calculated !== null) {
        clientData.age = calculated;
      }
    }

    return await sequelize.transaction(async (t) => {
      // Hash password for user account
      const hashedPassword = await bcrypt.hash(password, 10);

      // 1️⃣ Create EndUser
      const username = `${clientData.first_name} ${clientData.last_name}`;
      const endUserPayload = {
        username,
        email: clientData.email,
        phone: clientData.phone,
        password: hashedPassword,
        role: "Client",
        is_active: true,
      };

      const endUser = await EndUsers.create(endUserPayload, { transaction: t });

      // 2️⃣ Generate unique client code if not provided
      if (!clientData.client_code) {
        const lastClient = await Clients.findOne({
          order: [["createdAt", "DESC"]],
          transaction: t,
        });

        const lastCodeNumber = lastClient
          ? parseInt((lastClient.client_code || "").replace("CLI-", ""), 10) || 1000
          : 1000;

        clientData.client_code = `CLI-${lastCodeNumber + 1}`;
      }

      // 3️⃣ Create client and link to EndUser
      clientData.user_id = endUser.id;

      const client = await Clients.create(clientData, { transaction: t });

      // 4️⃣ Return full created client (with EndUser)
      return {
        client,
        endUser,
      };
    });
  },

  /**
   * Get all clients with filters and pagination
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

    const { count, rows } = await Clients.findAndCountAll({
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
   * Get single client by ID
   */
  async getById(id) {
    const client = await Clients.findByPk(id, {
      include: [
        {
          model: EndUsers,
          as: "endusers",
          attributes: ["id", "username", "email", "phone", "role"],
        },
      ],
    });

    if (!client) throw new Error("Client not found");
    return client;
  },

  /**
   * Get client history (encounters, appointments, vitals, admissions, diagnoses, notes, lab orders)
   */
  async getHistory(clientId, options = {}) {
    if (!clientId) throw new Error("clientId is required");

    const { fromDate, toDate, limit = 100 } = options;
    const dateFilter = {};
    if (fromDate) dateFilter[Op.gte] = new Date(fromDate);
    if (toDate) dateFilter[Op.lte] = new Date(toDate);

    // 1) Fetch encounters first (so we get encounter IDs)
    const encounterWhere = { client_id: clientId };
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
      // Appointments for client
      Appointments.findAll({
        where: (() => {
          const w = { client_id: clientId };
          if (fromDate || toDate) w.scheduled_at = dateFilter;
          return w;
        })(),
        order: [["scheduled_at", "DESC"]],
        limit,
      }),

      // Vitals recorded for client (optionally linked to encounter)
      Vitals.findAll({
        where: (() => {
          const w = { client_id: clientId };
          if (encounterIds.length) w.encounter_id = { [Op.in]: encounterIds };
          if (fromDate || toDate) w.measured_at = dateFilter;
          return w;
        })(),
        order: [["measured_at", "DESC"]],
        limit,
      }),

      // Admissions for client
      Admissions.findAll({
        where: (() => {
          const w = { client_id: clientId };
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
          const w = { client_id: clientId };
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
   * Update client details
   * If dob present in update payload, recalc age automatically.
   */
  async update(id, data) {
    const client = await Clients.findByPk(id);
    if (!client) throw new Error("Client not found");

    // if dob present in update payload, recalc age
    if (data.dob) {
      const calculated = calculateAge(data.dob);
      if (calculated !== null) {
        data.age = calculated;
      }
    }

    await client.update(data);
    return client;
  },

  /**
   * Soft delete client
   */
  async delete(id, userInfo = {}) {
    const client = await Clients.findByPk(id);
    if (!client) throw new Error("Client not found");

    await client.update({
      is_active: false,
      deleted_by: userInfo.id || null,
      deleted_by_name: userInfo.name || null,
      deleted_by_email: userInfo.email || null,
    });

    return { message: "Client deleted successfully" };
  },

  /**
   * Restore soft-deleted client
   */
  async restore(id, userInfo = {}) {
    const client = await Clients.findByPk(id);
    if (!client) throw new Error("Client not found");

    await client.update({
      is_active: true,
      deleted_by: null,
      deleted_by_name: null,
      deleted_by_email: null,
      updated_by: userInfo.id || null,
      updated_by_name: userInfo.name || null,
      updated_by_email: userInfo.email || null,
    });

    return { message: "Client restored successfully" };
  },
};

export default clientService;
