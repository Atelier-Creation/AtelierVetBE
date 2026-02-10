// bedtransfers.service.js
import { sequelize } from "../../../db/index.js";
import { Op } from "sequelize";
import BedTransfers from "../models/bedtransfers.models.js";
import Admissions from "../models/admissions.models.js";
import Beds from "../models/beds.models.js";
import Rooms from "../models/rooms.models.js";
import Ward from "../models/wards.models.js";
import Patient from "../../patients/models/patients.models.js";
import "../models/index.js"; // ensure associations are loaded

const bedTransfersService = {
  async create(data, userInfo = {}) {
    const transaction = await sequelize.transaction();
    try {
      // Required fields
      const required = ["admission_id", "from_bed_id", "to_bed_id", "reason"];
      for (const f of required) {
        if (!data[f]) throw new Error(`${f} is required`);
      }

      if (data.from_bed_id === data.to_bed_id) {
        throw new Error("from_bed_id and to_bed_id cannot be the same");
      }

      // Fetch admission
      const admission = await Admissions.findByPk(data.admission_id, { transaction });
      if (!admission) throw new Error("Admission not found");

      if (admission.status === "discharged")
        throw new Error("Cannot transfer. Patient is already discharged");

      // Ensure from_bed matches current admission bed
      if (String(admission.bed_id) !== String(data.from_bed_id)) {
        throw new Error("from_bed_id does not match current admission bed");
      }

      // Fetch fromBed and toBed with room -> ward includes
      const fromBed = await Beds.findByPk(data.from_bed_id, {
        include: [{ model: Rooms, as: "room", include: [{ model: Ward, as: "ward" }] }],
        transaction,
      });
      if (!fromBed) throw new Error("from_bed not found");

      const toBed = await Beds.findByPk(data.to_bed_id, {
        include: [{ model: Rooms, as: "room", include: [{ model: Ward, as: "ward" }] }],
        transaction,
      });
      if (!toBed) throw new Error("to_bed not found");

      if (toBed.is_occupied) throw new Error("Target bed is already occupied");

      // Derive new room/ward from target bed
      const newRoomId = toBed.room?.id;
      const newWardId = toBed.room?.ward?.id;
      if (!newRoomId || !newWardId) throw new Error("Target bed must be linked to a room and ward");

      // Mark fromBed vacant, toBed occupied
      await fromBed.update({ is_occupied: false }, { transaction });
      await toBed.update({ is_occupied: true }, { transaction });

      // Update admission to point to new bed/room/ward & set transferred status
      await admission.update(
        {
          bed_id: toBed.id,
          room_id: newRoomId,
          ward_id: newWardId,
          status: "transferred",
          updated_by: userInfo.id || null,
          updated_by_name: userInfo.username || userInfo.name || null,
          updated_by_email: userInfo.email || null,
        },
        { transaction }
      );

      // Create bed transfer record
      const transfer = await BedTransfers.create(
        {
          admission_id: data.admission_id,
          from_bed_id: fromBed.id,
          to_bed_id: toBed.id,
          transferred_at: data.transferred_at || new Date(),
          reason: data.reason,
          status: "transferred",
          is_active: true,
          created_by: userInfo.id || null,
          created_by_name: userInfo.username || userInfo.name || null,
          created_by_email: userInfo.email || null,
        },
        { transaction }
      );

      await transaction.commit();

      // Reload created transfer with includes for response
      const created = await BedTransfers.findByPk(transfer.id, {
        include: [
          {
            model: Admissions,
            as: "admission",
            include: [
              { model: Patient, as: "patient" },
              { model: Rooms, as: "room" },
              { model: Ward, as: "ward" },
            ],
          },
          { model: Beds, as: "fromBed", include: [{ model: Rooms, as: "room" }] },
          { model: Beds, as: "toBed", include: [{ model: Rooms, as: "room" }] },
        ],
      });

      return { message: "Bed transfer completed successfully", transfer: created };
    } catch (error) {
      await transaction.rollback();
      console.error("❌ Error creating bed transfer:", error);
      throw new Error(error.message || "Failed to create bed transfer");
    }
  },

  /**
   * Get all transfers (with filters)
   */
  async getAll(options = {}) {
    const {
      page = 1,
      limit = 10,
      search = "",
      admission_id,
      patient_id,
      status,
      sort_by = "createdAt",
      sort_order = "DESC",
    } = options;

    const where = {};
    if (admission_id) where.admission_id = admission_id;
    if (status) where.status = status;
    if (search) where.reason = { [Op.like]: `%${search}%` };

    const offset = (page - 1) * limit;

    const { count, rows } = await BedTransfers.findAndCountAll({
      where,
      offset,
      limit: Number(limit),
      order: [[sort_by, sort_order]],
      include: [
        {
          model: Admissions,
          as: "admission",
          include: [{ model: Patient, as: "patient" }],
        },
        { model: Beds, as: "fromBed", include: [{ model: Rooms, as: "room" }] },
        { model: Beds, as: "toBed", include: [{ model: Rooms, as: "room" }] },
      ],
    });

    // If patient_id filter provided, filter on included admission.patient
    let filteredRows = rows;
    let filteredCount = count;
    if (patient_id) {
      filteredRows = rows.filter((r) => r.admission?.patient_id === patient_id);
      filteredCount = filteredRows.length;
    }

    return {
      total: filteredCount,
      currentPage: page,
      totalPages: Math.ceil(filteredCount / limit),
      data: filteredRows,
    };
  },

  /**
   * Get transfer by ID
   */
  async getById(id) {
    const transfer = await BedTransfers.findByPk(id, {
      include: [
        {
          model: Admissions,
          as: "admission",
          include: [{ model: Patient, as: "patient" }, { model: Rooms, as: "room" }, { model: Ward, as: "ward" }],
        },
        { model: Beds, as: "fromBed", include: [{ model: Rooms, as: "room" }] },
        { model: Beds, as: "toBed", include: [{ model: Rooms, as: "room" }] },
      ],
    });
    if (!transfer) throw new Error("Bed transfer not found");
    return transfer;
  },

  /**
   * Get transfers by admission id
   */
  async getByAdmission(admission_id) {
    if (!admission_id) throw new Error("admission_id is required");
    const rows = await BedTransfers.findAll({
      where: { admission_id },
      order: [["createdAt", "DESC"]],
      include: [
        { model: Beds, as: "fromBed", include: [{ model: Rooms, as: "room" }] },
        { model: Beds, as: "toBed", include: [{ model: Rooms, as: "room" }] },
      ],
    });
    return rows;
  },

  /**
   * Update transfer metadata (reason/status). Does NOT move beds.
   */
  async update(id, data, userInfo = {}) {
    const transfer = await BedTransfers.findByPk(id);
    if (!transfer) throw new Error("Bed transfer not found");

    await transfer.update({
      ...data,
      updated_by: userInfo.id || null,
      updated_by_name: userInfo.username || userInfo.name || null,
      updated_by_email: userInfo.email || userInfo.email || null,
    });

    return { message: "Bed transfer updated successfully", transfer };
  },

  /**
   * Soft delete transfer
   */
  async delete(id, userInfo = {}) {
    const transfer = await BedTransfers.findByPk(id);
    if (!transfer) throw new Error("Bed transfer not found");

    await transfer.update({
      is_active: false,
      deleted_by: userInfo.id || null,
      deleted_by_name: userInfo.username || userInfo.name || null,
      deleted_by_email: userInfo.email || userInfo.email || null,
    });

    return { message: "Bed transfer deleted successfully" };
  },
};

export default bedTransfersService;
