import roomsService from "../service/rooms.service.js";
import parseZodSchema from "../../../utils/zodPharser.js";
import { createRoomSchema, updateRoomSchema } from "../dto/rooms.dto.js";

const roomsController = {
  /**
   * ✅ Create Room
   */
  async create(req, res) {
    try {
      const validatedData = await parseZodSchema(createRoomSchema, req.body);

      const roomData = {
        ...validatedData,
        created_by: req.user?.id,
        created_by_name: req.user?.username,
        created_by_email: req.user?.email,
      };

      const result = await roomsService.create(roomData);
      return res.sendSuccess(result, "Room created successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to create room");
    }
  },

  /**
   * ✅ Get All Rooms (with filters if any)
   */
  async getAll(req, res) {
    try {
      const rooms = await roomsService.getAll(req.query);
      return res.sendSuccess(rooms, "Rooms fetched successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to fetch rooms");
    }
  },

  /**
   * ✅ Get Room by ID
   */
  async getById(req, res) {
    try {
      const { id } = req.params;
      const room = await roomsService.getById(id);
      if (!room) return res.sendError("Room not found", 404);
      return res.sendSuccess(room, "Room fetched successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to fetch room");
    }
  },

  /**
   * ✅ Update Room
   */
  async update(req, res) {
    try {
      const { id } = req.params;
      const validatedData = await parseZodSchema(updateRoomSchema, req.body);

      const updateData = {
        ...validatedData,
        updated_by: req.user?.id,
        updated_by_name: req.user?.username,
        updated_by_email: req.user?.email,
      };

      const result = await roomsService.update(id, updateData);
      return res.sendSuccess(result, "Room updated successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to update room");
    }
  },

  /**
   * ✅ Delete Room (soft delete)
   */
  async delete(req, res) {
    try {
      const { id } = req.params;
      const result = await roomsService.delete(id, req.user);
      return res.sendSuccess(result, "Room deleted successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to delete room");
    }
  },

  /**
   * ✅ Restore Room
   */
  async restore(req, res) {
    try {
      const { id } = req.params;
      const result = await roomsService.restore(id, req.user);
      return res.sendSuccess(result, "Room restored successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to restore room");
    }
  },
};

export default roomsController;
