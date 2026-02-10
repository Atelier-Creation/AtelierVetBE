import { Op } from "sequelize";
import { v4 as uuidv4 } from "uuid";
import Vitals from "../models/vitals.models.js";
import Encounters from "../models/encounters.models.js";
import Patient from "../../patients/models/patients.models.js";

const vitalsService = {
  /**
   * ✅ Create Vitals
   */
  async create(data, user) {
    try {
      // ✅ If encounter_id is provided, fetch patient_id automatically
      if (data.encounter_id) {
        const encounter = await Encounters.findOne({
          where: { id: data.encounter_id },
          attributes: ["id", "patient_id", "status"],
        });

        if (!encounter) {
          throw new Error("Invalid encounter_id — encounter not found");
        }

        // ✅ Check encounter status
        if (encounter.status !== "Open") {
          throw new Error(
            `Cannot add vitals. Encounter is '${encounter.status}'`
          );
        }

        // ✅ Check if vitals already exist for this encounter
        const existingVitals = await Vitals.findOne({
          where: { encounter_id: data.encounter_id },
        });

        if (existingVitals) {
          throw new Error(
            "Vitals for this encounter already exist"
          );
        }

        // Auto-fill patient_id
        data.patient_id = encounter.patient_id;
      }

      // ✅ Required fields validation
      const requiredFields = ["patient_id", "encounter_id", "temperature"];
      for (const field of requiredFields) {
        if (!data[field]) throw new Error(`${field} is required`);
      }

      // ✅ Create vitals record
      const vitals = await Vitals.create({
        id: uuidv4(),
        ...data,
        recorded_by: user?.id || null,
        created_by: user?.id || null,
        created_by_name: user?.username || null,
        created_by_email: user?.email || null,
      });

      return vitals;
    } catch (error) {
      console.error("❌ Error creating vitals:", error.message);
      throw error;
    }
  },

  /**
   * ✅ Get all vitals
   */
  async getAll(options = {}) {
    const {
      page = 1,
      limit = 10,
      patient_id,
      encounter_id,
      sort_by = "createdAt",
      sort_order = "DESC",
    } = options;

    const where = {};
    if (patient_id) where.patient_id = patient_id;
    if (encounter_id) where.encounter_id = encounter_id;

    const offset = (page - 1) * limit;

    const { count, rows } = await Vitals.findAndCountAll({
      where,
      include: [
        {
          model: Patient,
          as: "patient",
          attributes: ["id", "first_name", "last_name", "patient_code"],
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
          model: Patient,
          as: "patient",
          attributes: ["id", "first_name", "last_name", "patient_code"],
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
          model: Patient,
          as: "patient",
          attributes: ["id", "first_name", "last_name", "patient_code"],
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
   * ✅ Update Vitals
   */
  async update(id, data, user) {
    const vitals = await Vitals.findByPk(id);
    if (!vitals) throw new Error("Vitals not found");

    await vitals.update({
      ...data,
      updated_by: user?.id || null,
      updated_by_name: user?.username || null,
      updated_by_email: user?.email || null,
    });

    return vitals;
  },

  /**
   * ✅ Delete Vitals (Soft delete)
   */
  async delete(id, user) {
    const vitals = await Vitals.findByPk(id);
    if (!vitals) throw new Error("Vitals not found");

    await vitals.update({
      deleted_by: user?.id || null,
      deleted_by_name: user?.username || null,
      deleted_by_email: user?.email || null,
    });

    await vitals.destroy(); // hard delete

    return { message: "Vitals deleted successfully" };
  },
};

export default vitalsService;
