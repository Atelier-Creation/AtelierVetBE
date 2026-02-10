import { v4 as uuidv4 } from "uuid";
import ClinicalNotes from "../models/clinicalnotes.models.js";
import Encounters from "../models/encounters.models.js";

const clinicalNotesService = {
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

        // Optional: Check if encounter is open
        if (encounter.status !== "Open") {
          throw new Error(`Cannot add note. Encounter is '${encounter.status}'`);
        }
      } else {
        throw new Error("encounter_id is required");
      }

      // ✅ Required fields
      const requiredFields = ["note_type", "note"];
      for (const field of requiredFields) {
        if (!data[field]) throw new Error(`${field} is required`);
      }

      // ✅ Create note
      const note = await ClinicalNotes.create({
        id: uuidv4(),
        ...data,
        created_by: user?.id || null,
        created_by_name: user?.username || null,
        created_by_email: user?.email || null,
      });

      return note;
    } catch (error) {
      console.error("❌ Error creating clinical note:", error.message);
      throw error;
    }
  },

  /**
   * ✅ Get all clinical notes (with filters + pagination)
   */
  async getAll(options = {}) {
    const {
      page = 1,
      limit = 10,
      encounter_id,
      note_type,
      sort_by = "createdAt",
      sort_order = "DESC",
    } = options;

    const where = {};
    if (encounter_id) where.encounter_id = encounter_id;
    if (note_type) where.note_type = note_type;

    const offset = (page - 1) * limit;

    const { count, rows } = await ClinicalNotes.findAndCountAll({
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

  async getByEncounterId(id) {
    const notes = await ClinicalNotes.findAll({
      where: { encounter_id: id },
    });
    return notes;
  },

  /**
   * ✅ Get Clinical Note by ID
   */
  async getById(id) {
    const note = await ClinicalNotes.findByPk(id, {
      include: [
        {
          model: Encounters,
          as: "encounter",
          attributes: ["id", "encounter_no", "status", "encounter_date"],
        },
      ],
    });

    if (!note) throw new Error("Clinical note not found");
    return note;
  },

  /**
   * ✅ Update Clinical Note
   */
  async update(id, data, user) {
    const note = await ClinicalNotes.findByPk(id);
    if (!note) throw new Error("Clinical note not found");

    await note.update({
      ...data,
      updated_by: user?.id || null,
      updated_by_name: user?.username || null,
      updated_by_email: user?.email || null,
    });

    return note;
  },

  /**
   * ✅ Delete Clinical Note (Soft delete)
   */
  async delete(id, user) {
    const note = await ClinicalNotes.findByPk(id);
    if (!note) throw new Error("Clinical note not found");

    await note.update({
      deleted_by: user?.id || null,
      deleted_by_name: user?.username || null,
      deleted_by_email: user?.email || null,
    });

    await note.destroy(); // soft delete (paranoid: true)
    return { message: "Clinical note deleted successfully" };
  },
};

export default clinicalNotesService;
