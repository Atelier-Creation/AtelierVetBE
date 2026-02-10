import petService from "../service/pet.service.js";
import parseZodSchema from "../../../utils/zodPharser.js";
import { createPetSchema, updatePetSchema } from "../dto/pet.dto.js";

const petController = {
  /**
   * ✅ Create pet
   */
  async create(req, res) {
    try {
      const petData = await parseZodSchema(createPetSchema, req.body);

      // Add audit info
      petData.created_by = req.user?.id;
      petData.created_by_name = req.user?.username;
      petData.created_by_email = req.user?.email;

      const pet = await petService.create(petData);
      return res.sendSuccess(pet, "Pet created successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to create pet");
    }
  },

  /**
   * ✅ Get all pets
   */
  async getAll(req, res) {
    try {
      const pets = await petService.getAll(req.query);
      return res.sendSuccess(pets, "Pets fetched successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to fetch pets");
    }
  },

  /**
   * ✅ Get pet by ID
   */
  async getById(req, res) {
    try {
      const { id } = req.params;
      const pet = await petService.getById(id);
      return res.sendSuccess(pet, "Pet fetched successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to fetch pet");
    }
  },

  /**
   * ✅ Update pet
   */
  async update(req, res) {
    try {
      const { id } = req.params;
      const data = await parseZodSchema(updatePetSchema, req.body);

      data.updated_by = req.user?.id;
      data.updated_by_name = req.user?.username;
      data.updated_by_email = req.user?.email;

      const updatedPet = await petService.update(id, data);
      return res.sendSuccess(updatedPet, "Pet updated successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to update pet");
    }
  },

  /**
   * ✅ Soft delete pet
   */
  async delete(req, res) {
    try {
      const { id } = req.params;
      const result = await petService.delete(id, req.user);
      return res.sendSuccess(result, "Pet deleted successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to delete pet");
    }
  },

  /**
   * ✅ Restore pet
   */
  async restore(req, res) {
    try {
      const { id } = req.params;
      const result = await petService.restore(id, req.user);
      return res.sendSuccess(result, "Pet restored successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to restore pet");
    }
  },
};

export default petController;
