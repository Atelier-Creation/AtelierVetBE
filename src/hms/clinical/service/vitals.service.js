import { sequelize } from "../../../db/index.js";
import Vitals from "../models/vitals.models.js";
import Encounters from "../models/encounters.models.js";
import Client from "../../clients/models/clients.models.js";

const vitalsService = {
  /**
   * ✅ Create vitals
   */
  async create(data, user) {
    try {
      // ✅ If encounter_id is provided, fetch client_id automatically
      if (data.encounter_id) {
        const encounter = await Encounters.findOne({
          where: { id: data.encounter_id },
          attributes: ["id", "client_id", "status"],
        });

        if (!encounter) {
          throw new Error("Encounter not found");
        }

        if (encounter.status === "Closed") {
          throw new Error("Cannot add vitals to a closed encounter");
        }

        if (encounter.status === "Cancelled") {
          throw new Error("Cannot add vitals to a cancelled encounter");
        }

        // Auto-fill client_id
        data.client_id = encounter.client_id;
      }

      // ✅ Required fields validation
      const requiredFields = ["client_id", "encounter_id", "temperature"];
      for (const field of requiredFields) {
        if (!data[field]) throw new Error(`${field} is required`);
      }

      // ✅ Create vitals
      const vitals = await Vitals.create({
        ...data,
        measured_at: data.measured_at || new Date(),
        created_by: user?.id || null,
        created_by_name: user?.name || null,
        created_by_email: user?.email || null,
      });

      return vitals;
    } catch (error) {
      console.error("❌ Error creating vitals:", error);
      throw new Error(error.message || "Failed to create vitals");
    }
  },

  /**
   * ✅ Get all vitals (with filters & pagination)
   */
  async getAll(options = {}) {
    const {
      page = 1,
      limit = 10,
      client_id,
      encounter_id,
      sort_by = "createdAt",
      sort_order = "DESC",
    } = options;

    const where = {};
    if (client_id) where.client_id = client_id;
    if (encounter_id) where.encounter_id = encounter_id;

    const offset = (page - 1) * limit;

    const { count, rows } = await Vitals.findAndCountAll({
      where,
      include: [
        {
          model: Client,
          as: "client",
          attributes: ["id", "first_name", "last_name", "client_code"],
        },
        {
          model: Encounters,
          as: "encounter",
          attributes: ["id", "encounter_no", "status", "encounter_date"],
        },
      ],
      limit: Number(limit),
      offset,
      order: [[sort_by, sort_order]],
    });

    return {
      total: count,
      currentPage: page,
      totalPages: Math.ceil(count / limit),
      data: rows,
    };
  },

  /**
   * ✅ Get vitals by ID
   */
  async getById(id) {
    const vitals = await Vitals.findByPk(id, {
      include: [
        {
          model: Client,
          as: "client",
          attributes: ["id", "first_name", "last_name", "client_code"],
        },
        {
          model: Encounters,
          as: "encounter",
          attributes: ["id", "encounter_no", "status", "encounter_date"],
        },
      ],
    });

    if (!vitals) throw new Error("Vitals not found");
    return vitals;
  },

  async getVitalsByencountorID(id) {
    const vitals = await Vitals.findAll({
      where: {
        encounter_id: id,
      },
      include: [
        {
          model: Client,
          as: "client",
          attributes: ["id", "first_name", "last_name", "client_code"],
        },
        {
          model: Encounters,
          as: "encounter",
          attributes: ["id", "encounter_no", "status", "encounter_date"],
        },
      ],
    });
    if (!vitals) throw new Error("Vitals not found");
    return vitals;
  },

  /**
   * ✅ Update vitals
   */
  async update(id, data, user) {
    const vitals = await Vitals.findByPk(id);
    if (!vitals) throw new Error("Vitals not found");

    await vitals.update({
      ...data,
      updated_by: user?.id || null,
      updated_by_name: user?.name || null,
      updated_by_email: user?.email || null,
    });

    return vitals;
  },

  /**
   * ✅ Delete (Soft Delete) vitals
   */
  async delete(id, user) {
    const vitals = await Vitals.findByPk(id);
    if (!vitals) throw new Error("Vitals not found");

    await vitals.update({
      deleted_by: user?.id || null,
      deleted_by_name: user?.name || null,
      deleted_by_email: user?.email || null,
    });

    return { message: "Vitals deleted successfully" };
  },
};

export default vitalsService;
