import bedsService from "../service/beds.service.js";
import parseZodSchema from "../../../utils/zodPharser.js";
import { createBedSchema, updateBedSchema } from "../dto/beds.dto.js";

const bedsController = {
  /**
   * ✅ Create Bed
   */
  async create(req, res) {
    try {
      const validatedData = await parseZodSchema(createBedSchema, req.body);

      const bedData = {
        ...validatedData,
        created_by: req.user?.id,
        created_by_name: req.user?.username,
        created_by_email: req.user?.email,
      };

      const result = await bedsService.create(bedData);
      return res.sendSuccess(result, "Bed created successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to create bed");
    }
  },

  /**
   * ✅ Get All Beds (with filters if any)
   */
  async getAll(req, res) {
    try {
      const beds = await bedsService.getAll(req.query);
      return res.sendSuccess(beds, "Beds fetched successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to fetch beds");
    }
  },

  /**
   * ✅ Get Bed by ID
   */
  async getById(req, res) {
    try {
      const { id } = req.params;
      const bed = await bedsService.getById(id);
      if (!bed) return res.sendError("Bed not found", 404);
      return res.sendSuccess(bed, "Bed fetched successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to fetch bed");
    }
  },

  /**
   * ✅ Update Bed
   */
  async update(req, res) {
    try {
      const { id } = req.params;
      const validatedData = await parseZodSchema(updateBedSchema, req.body);

      const updateData = {
        ...validatedData,
        updated_by: req.user?.id,
        updated_by_name: req.user?.username,
        updated_by_email: req.user?.email,
      };

      const result = await bedsService.update(id, updateData);
      return res.sendSuccess(result, "Bed updated successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to update bed");
    }
  },

  /**
   * ✅ Delete Bed (soft delete)
   */
  async delete(req, res) {
    try {
      const { id } = req.params;
      const result = await bedsService.delete(id, req.user);
      return res.sendSuccess(result, "Bed deleted successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to delete bed");
    }
  },

  /**
   * ✅ Restore Bed
   */
  async restore(req, res) {
    try {
      const { id } = req.params;
      const result = await bedsService.restore(id, req.user);
      return res.sendSuccess(result, "Bed restored successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to restore bed");
    }
  },
};

export default bedsController;
