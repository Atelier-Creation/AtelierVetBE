// bedtransfers.controller.js
import bedTransfersService from "../service/bedtransfers.service.js";
import parseZodSchema from "../../../utils/zodPharser.js";
import {
  createBedTransferSchema,
  updateBedTransferSchema,
} from "../dto/bedtransfers.dto.js";

const bedTransfersController = {
  /**
   * ✅ Create Bed Transfer
   */
  async create(req, res) {
    try {
      const validatedData = await parseZodSchema(createBedTransferSchema, req.body);

      const transferData = {
        ...validatedData,
        created_by: req.user?.id,
        created_by_name: req.user?.username,
        created_by_email: req.user?.email,
      };

      const result = await bedTransfersService.create(transferData);
      return res.sendSuccess(result, "Bed transferred successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to transfer bed");
    }
  },

  /**
   * ✅ Get All Bed Transfers (with filters, pagination, etc.)
   */
  async getAll(req, res) {
    try {
      const transfers = await bedTransfersService.getAll(req.query);
      return res.sendSuccess(transfers, "Bed transfers fetched successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to fetch bed transfers");
    }
  },

  /**
   * ✅ Get Bed Transfer by ID
   */
  async getById(req, res) {
    try {
      const { id } = req.params;
      const transfer = await bedTransfersService.getById(id);
      if (!transfer) return res.sendError("Bed transfer not found", 404);
      return res.sendSuccess(transfer, "Bed transfer fetched successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to fetch bed transfer");
    }
  },

  /**
   * ✅ Update Bed Transfer (e.g., correction or note update)
   */
  async update(req, res) {
    try {
      const { id } = req.params;
      const validatedData = await parseZodSchema(updateBedTransferSchema, req.body);

      const updateData = {
        ...validatedData,
        updated_by: req.user?.id,
        updated_by_name: req.user?.username,
        updated_by_email: req.user?.email,
      };

      const result = await bedTransfersService.update(id, updateData);
      return res.sendSuccess(result, "Bed transfer updated successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to update bed transfer");
    }
  },

  /**
   * ✅ Delete Bed Transfer (soft delete)
   */
  async delete(req, res) {
    try {
      const { id } = req.params;
      const result = await bedTransfersService.delete(id, req.user);
      return res.sendSuccess(result, "Bed transfer deleted successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to delete bed transfer");
    }
  },

  /**
   * ✅ Restore Bed Transfer (undo soft delete)
   */
  async restore(req, res) {
    try {
      const { id } = req.params;
      const result = await bedTransfersService.restore(id, req.user);
      return res.sendSuccess(result, "Bed transfer restored successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to restore bed transfer");
    }
  },
};

export default bedTransfersController;
