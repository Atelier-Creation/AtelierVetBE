import { sequelize } from "../../../db/index.js";
import Room from "../models/rooms.models.js";
import Ward from "../models/wards.models.js";
import "../models/index.js"

const roomService = {
  /**
   * ✅ Create a new Room
   */
  async create(data, userInfo = {}) {
    const transaction = await sequelize.transaction();
    try {
      if (!data.ward_id) throw new Error("ward_id is required");
      if (!data.room_no) throw new Error("room_no is required");
      if (!data.room_type) throw new Error("room_type is required");
      if (!data.capacity) throw new Error("capacity is required");
      if (!data.price_per_day) throw new Error("price_per_day is required");

      // 🧩 Verify Ward Exists
      const ward = await Ward.findByPk(data.ward_id);
      if (!ward) throw new Error("Ward not found");

      // 🧾 Create Room
      const room = await Room.create(
        {
          ward_id: data.ward_id,
          room_no: data.room_no,
          room_type: data.room_type,
          capacity: data.capacity,
          price_per_day: data.price_per_day,
          is_active: true,
          created_by: userInfo.id || null,
          created_by_name: userInfo.username || userInfo.name || null,
          created_by_email: userInfo.email || null,
        },
        { transaction }
      );

      await transaction.commit();
      return { message: "Room created successfully", room };
    } catch (error) {
      await transaction.rollback();
      console.error("❌ Error creating room:", error);
      throw new Error(error.message || "Failed to create room");
    }
  },

  /**
   * ✅ Get all Rooms (with pagination, search, and filter)
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
      where.room_no = { [sequelize.Op.like]: `%${search}%` };
    }
    if (is_active !== undefined) {
      where.is_active = is_active;
    }

    const { count, rows } = await Room.findAndCountAll({
      where,
      offset,
      limit: Number(limit),
      order: [[sort_by, sort_order]],
      include: [{ model: Ward, as: "ward"}],
    });

    return {
      total: count,
      currentPage: page,
      totalPages: Math.ceil(count / limit),
      data: rows,
    };
  },

  /**
   * ✅ Get Room by ID
   */
  async getById(id) {
    const room = await Room.findByPk(id, {
      include: [{ model: Ward, as: "ward" }],
    });
    if (!room) throw new Error("Room not found");
    return room;
  },

  /**
   * ✅ Update Room
   */
  async update(id, data, userInfo = {}) {
    const room = await Room.findByPk(id);
    if (!room) throw new Error("Room not found");

    await room.update({
      ...data,
      updated_by: userInfo.id || null,
      updated_by_name: userInfo.username || userInfo.name || null,
      updated_by_email: userInfo.email || null,
    });

    return { message: "Room updated successfully", room };
  },

  /**
   * ✅ Soft Delete Room
   */
  async delete(id, userInfo = {}) {
    const room = await Room.findByPk(id);
    if (!room) throw new Error("Room not found");

    await room.update({
      is_active: false,
      deleted_by: userInfo.id || null,
      deleted_by_name: userInfo.username || userInfo.name || null,
      deleted_by_email: userInfo.email || null,
    });

    return { message: "Room deleted successfully" };
  },

  /**
   * ✅ Restore Room
   */
  async restore(id, userInfo = {}) {
    const room = await Room.findByPk(id);
    if (!room) throw new Error("Room not found");

    await room.update({
      is_active: true,
      deleted_by: null,
      deleted_by_name: null,
      deleted_by_email: null,
      updated_by: userInfo.id || null,
      updated_by_name: userInfo.username || userInfo.name || null,
      updated_by_email: userInfo.email || null,
    });

    return { message: "Room restored successfully" };
  },
};

export default roomService;
