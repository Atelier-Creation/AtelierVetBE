import { sequelize } from "../../../db/index.js";
import Admissions from "../models/admissions.models.js";
import Client from "../../clients/models/clients.models.js";
import Ward from "../models/wards.models.js";
import Room from "../models/rooms.models.js";
import Beds from "../models/beds.models.js";
import User from "../../../user/models/user.model.js";
import "../models/index.js";

const admissionService = {
  /**
   * ✅ Create a new Admission
   */
  async create(data, userInfo = {}) {
  const transaction = await sequelize.transaction();
  try {
    // 🧩 Basic validations
    if (!data.client_id) throw new Error("client_id is required");
    if (!data.reason) throw new Error("reason is required");
    if (!data.bed_id) throw new Error("bed_id is required");

    // ✅ Check if client exists
    const client = await Client.findByPk(data.client_id);
    if (!client) throw new Error("Client not found");

    // ✅ Get bed and related room → ward
    const bed = await Beds.findByPk(data.bed_id, {
      include: [
        {
          model: Room,
          as: "room",
          include: [{ model: Ward, as: "ward" }],
        },
      ],
    });

    if (!bed) throw new Error("Bed not found");
    if (bed.is_occupied) throw new Error("Selected bed is already occupied");

    // ✅ Derive room_id and ward_id automatically
    const room_id = bed.room?.id;
    const ward_id = bed.room?.ward?.id;

    if (!room_id) throw new Error("Room not linked to bed");
    if (!ward_id) throw new Error("Ward not linked to room");

    // 🛏️ Mark bed as occupied
    await bed.update({ is_occupied: true }, { transaction });

    // 🧾 Create admission record
    const admission = await Admissions.create(
      {
        client_id: data.client_id,
        admission_date: data.admission_date || new Date(),
        admitted_by: data.admitted_by,
        reason: data.reason,
        ward_id,
        room_id,
        bed_id: data.bed_id,
        status: "admitted",
        is_active: true,
        created_by: userInfo.id || null,
        created_by_name: userInfo.username || userInfo.name || null,
        created_by_email: userInfo.email || null,
      },
      { transaction }
    );

    await transaction.commit();
    return { message: "Admission created successfully", admission };
  } catch (error) {
    await transaction.rollback();
    console.error("❌ Error creating admission:", error);
    throw new Error(error.message || "Failed to create admission");
  }
},


  /**
   * ✅ Get all Admissions
   */
  async getAll(options = {}) {
    const {
      page = 1,
      limit = 10,
      search = "",
      status,
      is_active,
      sort_by = "createdAt",
      sort_order = "DESC",
    } = options;

    const offset = (page - 1) * limit;
    const where = {};

    if (status) where.status = status;
    if (is_active !== undefined) where.is_active = is_active;
    if (search) where.reason = { [sequelize.Op.like]: `%${search}%` };

    const { count, rows } = await Admissions.findAndCountAll({
      where,
      offset,
      limit: Number(limit),
      order: [[sort_by, sort_order]],
      include: [
        { model: Client, as: "client" },
        { model: Ward, as: "ward" },
        { model: Room, as: "room" },
        { model: Beds, as: "bed" },
        { model: User, as: "admittedBy", attributes: ["id", "username", "email"] },
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
   * ✅ Get Admission by ID
   */
  async getById(id) {
    const admission = await Admissions.findByPk(id, {
      include: [
        { model: Client, as: "client" },
        { model: Ward, as: "ward" },
        { model: Room, as: "room" },
        { model: Beds, as: "bed" },
        { model: User, as: "admittedBy", attributes: ["id", "username", "email"] },
        { model: User, as: "dischargedBy", attributes: ["id", "username", "email"] },
      ],
    });
    if (!admission) throw new Error("Admission not found");
    return admission;
  },

  /**
   * ✅ Update Admission (e.g., update diagnosis or reason)
   */
  async update(id, data, userInfo = {}) {
    const admission = await Admissions.findByPk(id);
    if (!admission) throw new Error("Admission not found");

    await admission.update({
      ...data,
      updated_by: userInfo.id || null,
      updated_by_name: userInfo.username || userInfo.name || null,
      updated_by_email: userInfo.email || null,
    });

    return { message: "Admission updated successfully", admission };
  },

  /**
   * ✅ Discharge Client
   */
  async discharge(id, dischargeData, userInfo = {}) {
    const transaction = await sequelize.transaction();
    try {
      const admission = await Admissions.findByPk(id);
      if (!admission) throw new Error("Admission not found");
      if (admission.status === "discharged")
        throw new Error("Client is already discharged");

      const bed = await Beds.findByPk(admission.bed_id);
      if (bed) {
        await bed.update({ is_occupied: false }, { transaction });
      }

      await admission.update(
        {
          discharge_datetime: dischargeData.discharge_datetime || new Date(),
          discharge_by: userInfo.id,
          discharge_reason: dischargeData.discharge_reason,
          final_diagnosis: dischargeData.final_diagnosis,
          status: "discharged",
          updated_by: userInfo.id || null,
          updated_by_name: userInfo.username || userInfo.name || null,
          updated_by_email: userInfo.email || null,
        },
        { transaction }
      );

      await transaction.commit();
      return { message: "Client discharged successfully", admission };
    } catch (error) {
      await transaction.rollback();
      console.error("❌ Error discharging client:", error);
      throw new Error(error.message || "Failed to discharge client");
    }
  },

  /**
   * ✅ Soft Delete Admission
   */
  async delete(id, userInfo = {}) {
    const admission = await Admissions.findByPk(id);
    if (!admission) throw new Error("Admission not found");

    await admission.update({
      is_active: false,
      deleted_by: userInfo.id || null,
      deleted_by_name: userInfo.username || userInfo.name || null,
      deleted_by_email: userInfo.email || null,
    });

    return { message: "Admission deleted successfully" };
  },

  /**
   * ✅ Restore Admission
   */
  async restore(id, userInfo = {}) {
    const admission = await Admissions.findByPk(id);
    if (!admission) throw new Error("Admission not found");

    await admission.update({
      is_active: true,
      deleted_by: null,
      deleted_by_name: null,
      deleted_by_email: null,
      updated_by: userInfo.id || null,
      updated_by_name: userInfo.username || userInfo.name || null,
      updated_by_email: userInfo.email || null,
    });

    return { message: "Admission restored successfully" };
  },
};

export default admissionService;
