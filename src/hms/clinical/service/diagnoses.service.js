import { v4 as uuidv4 } from "uuid";
import Diagnoses from "../models/diagnoses.models.js";
import Encounters from "../models/encounters.models.js";

const diagnosesService = {
  /**
   * ✅ Create Diagnosis
   * Auto-fill encounter validation: encounter must exist
   */
  async create(data, user) {
  try {
    // ✅ Check encounter existence
    if (data.encounter_id) {
      const encounter = await Encounters.findOne({
        where: { id: data.encounter_id },
        attributes: ["id", "status"],
      });

      if (!encounter) {
        throw new Error("Invalid encounter_id — encounter not found");
      }

      // Optional: Check if encounter is Open
      if (encounter.status !== "Open") {
        throw new Error(
          `Cannot add diagnosis. Encounter is '${encounter.status}'`
        );
      }

      // ✅ Check if a diagnosis already exists for this encounter
      const existingDiagnosis = await Diagnoses.findOne({
        where: { encounter_id: data.encounter_id },
      });

      if (existingDiagnosis) {
        throw new Error(
          "A diagnosis for this encounter already exists"
        );
      }

    } else {
      throw new Error("encounter_id is required");
    }

    // ✅ Required fields validation
    const requiredFields = ["icd_code", "description"];
    for (const field of requiredFields) {
      if (!data[field]) throw new Error(`${field} is required`);
    }

    // ✅ Create diagnosis
    const diagnosis = await Diagnoses.create({
      id: uuidv4(),
      ...data,
      created_by: user?.id || null,
      created_by_name: user?.username || null,
      created_by_email: user?.email || null,
    });

    return diagnosis;
  } catch (error) {
    console.error("❌ Error creating diagnosis:", error.message);
    throw error;
  }
},


  /**
   * ✅ Get all diagnoses
   */
  async getAll(options = {}) {
    const { page = 1, limit = 10, encounter_id, sort_by = "createdAt", sort_order = "DESC" } = options;

    const where = {};
    if (encounter_id) where.encounter_id = encounter_id;

    const offset = (page - 1) * limit;

    const { count, rows } = await Diagnoses.findAndCountAll({
      where,
      include: [
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
   * ✅ Get Diagnosis by ID
   */
  async getById(id) {
    const diagnosis = await Diagnoses.findByPk(id, {
      include: [
        {
          model: Encounters,
          as: "encounter",
          attributes: ["id", "encounter_no", "status", "encounter_date"],
        },
      ],
    });

    if (!diagnosis) throw new Error("Diagnosis not found");
    return diagnosis;
  },

  async getDiagnosesByEncounterId(id) {
    const diagnoses = await Diagnoses.findAll({
      where: { encounter_id: id },
    });
    return diagnoses;
  },

  /**
   * ✅ Update Diagnosis
   */
  async update(id, data, user) {
    const diagnosis = await Diagnoses.findByPk(id);
    if (!diagnosis) throw new Error("Diagnosis not found");

    await diagnosis.update({
      ...data,
      updated_by: user?.id || null,
      updated_by_name: user?.username || null,
      updated_by_email: user?.email || null,
    });

    return diagnosis;
  },

  /**
   * ✅ Delete Diagnosis (Soft delete)
   */
  async delete(id, user) {
    const diagnosis = await Diagnoses.findByPk(id);
    if (!diagnosis) throw new Error("Diagnosis not found");

    await diagnosis.update({
      deleted_by: user?.id || null,
      deleted_by_name: user?.username || null,
      deleted_by_email: user?.email || null,
    });

    await diagnosis.destroy(); // hard delete

    return { message: "Diagnosis deleted successfully" };
  },
};

export default diagnosesService;
