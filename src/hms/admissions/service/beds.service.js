import { sequelize } from "../../../db/index.js";
import Beds from "../models/beds.models.js";
import Room from "../models/rooms.models.js";
import Ward from "../models/wards.models.js"
import "../models/index.js";

const bedService = {
  /**
   * ✅ Create a new Bed
   */
  async create(data, userInfo = {}) {
    const transaction = await sequelize.transaction();
    try {
      if (!data.room_id) throw new Error("room_id is required");
      if (!data.bed_no) throw new Error("bed_no is required");

      // 🧩 Verify Room Exists
      const room = await Room.findByPk(data.room_id);
      if (!room) throw new Error("Room not found");

      // 🧾 Create Bed
      const bed = await Beds.create(
        {
          room_id: data.room_id,
          bed_no: data.bed_no,
          is_occupied: data.is_occupied || false,
          is_active: true,
          created_by: userInfo.id || null,
          created_by_name: userInfo.username || userInfo.name || null,
          created_by_email: userInfo.email || null,
        },
        { transaction }
      );

      await transaction.commit();
      return { message: "Bed created successfully", bed };
    } catch (error) {
      await transaction.rollback();
      console.error("❌ Error creating bed:", error);
      throw new Error(error.message || "Failed to create bed");
    }
  },

  /**
   * ✅ Get all Beds (with pagination, search, and filters)
   */
  async getAll(options = {}) {
    const {
      page = 1,
      limit = 10,
      search = "",
      is_active,
      is_occupied,
      sort_by = "createdAt",
      sort_order = "DESC",
    } = options;

    const offset = (page - 1) * limit;
    const where = {};

    if (search) {
      where.bed_no = { [sequelize.Op.like]: `%${search}%` };
    }
    if (is_active !== undefined) {
      where.is_active = is_active;
    }
    if (is_occupied !== undefined) {
      where.is_occupied = is_occupied;
    }

    const { count, rows } = await Beds.findAndCountAll({
      where,
      offset,
      limit: Number(limit),
      order: [[sort_by, sort_order]],
      include: [{ model: Room, as: "room",
        include:[{model: Ward, as:"ward"}]
       }],
    });

    return {
      total: count,
      currentPage: page,
      totalPages: Math.ceil(count / limit),
      data: rows,
    };
  },

  /**
   * ✅ Get Bed by ID
   */
  async getById(id) {
    const bed = await Beds.findByPk(id, {
      include: [{ model: Room, as: "room" }],
    });
    if (!bed) throw new Error("Bed not found");
    return bed;
  },

  /**
   * ✅ Update Bed
   */
  async update(id, data, userInfo = {}) {
    const bed = await Beds.findByPk(id);
    if (!bed) throw new Error("Bed not found");

    await bed.update({
      ...data,
      updated_by: userInfo.id || null,
      updated_by_name: userInfo.username || userInfo.name || null,
      updated_by_email: userInfo.email || null,
    });

    return { message: "Bed updated successfully", bed };
  },

  /**
   * ✅ Mark Bed Occupied / Vacant
   */
  async updateOccupancy(id, isOccupied, userInfo = {}) {
    const bed = await Beds.findByPk(id);
    if (!bed) throw new Error("Bed not found");

    await bed.update({
      is_occupied: isOccupied,
      updated_by: userInfo.id || null,
      updated_by_name: userInfo.username || userInfo.name || null,
      updated_by_email: userInfo.email || null,
    });

    return { message: `Bed marked as ${isOccupied ? "occupied" : "vacant"}`, bed };
  },

  /**
   * ✅ Soft Delete Bed
   */
  async delete(id, userInfo = {}) {
    const bed = await Beds.findByPk(id);
    if (!bed) throw new Error("Bed not found");

    await bed.update({
      is_active: false,
      deleted_by: userInfo.id || null,
      deleted_by_name: userInfo.username || userInfo.name || null,
      deleted_by_email: userInfo.email || null,
    });

    return { message: "Bed deleted successfully" };
  },

  /**
   * ✅ Restore Soft-Deleted Bed
   */
  async restore(id, userInfo = {}) {
    const bed = await Beds.findByPk(id);
    if (!bed) throw new Error("Bed not found");

    await bed.update({
      is_active: true,
      deleted_by: null,
      deleted_by_name: null,
      deleted_by_email: null,
      updated_by: userInfo.id || null,
      updated_by_name: userInfo.username || userInfo.name || null,
      updated_by_email: userInfo.email || null,
    });

    return { message: "Bed restored successfully" };
  },
};

export default bedService;
