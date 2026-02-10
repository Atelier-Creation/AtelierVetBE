import encountersService from "../service/encounters.service.js";
import parseZodSchema from "../../../utils/zodPharser.js";
import {
  createEncounterSchema,
  updateEncounterSchema,
} from "../dto/encounters.dto.js";

const encountersController = {
  /**
   * ✅ Create Encounter
   */
  async create(req, res) {
    try {
      const encounterData = await parseZodSchema(createEncounterSchema, req.body);

      // Add audit info
      encounterData.created_by = req.user?.id;
      encounterData.created_by_name = req.user?.username;
      encounterData.created_by_email = req.user?.email;

      const encounter = await encountersService.create(encounterData, req.user);
      return res.sendSuccess(encounter, "Encounter created successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to create encounter");
    }
  },

  /**
   * ✅ Get All Encounters (with filters, pagination)
   */
  async getAll(req, res) {
    try {
      const encounters = await encountersService.getAll(req.query);
      return res.sendSuccess(encounters, "Encounters fetched successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to fetch encounters");
    }
  },

  /**
   * ✅ Get Encounter by ID
   */
  async getById(req, res) {
    try {
      const { id } = req.params;
      const encounter = await encountersService.getById(id);
      return res.sendSuccess(encounter, "Encounter fetched successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to fetch encounter");
    }
  },

  /**
   * ✅ Get Encounter by Admission ID
   */
  async getByAdmissionId(req, res) {
    try {
      const { admission_id } = req.params;

      if (!admission_id) {
        return res.sendError("Admission ID is required");
      }

      const encounter = await encountersService.getEncounterbyadmmisionID(admission_id);

      if (!encounter) {
        return res.sendError("No encounter found for the given admission ID", 404);
      }

      return res.sendSuccess(encounter, "Encounter fetched successfully by admission ID");
    } catch (error) {
      return res.sendError(error.message || "Failed to fetch encounter by admission ID");
    }
  },

  /**
   * ✅ Update Encounter
   */
  async update(req, res) {
    try {
      const { id } = req.params;
      const data = await parseZodSchema(updateEncounterSchema, req.body);

      data.updated_by = req.user?.id;
      data.updated_by_name = req.user?.username;
      data.updated_by_email = req.user?.email;

      const updatedEncounter = await encountersService.update(id, data);
      return res.sendSuccess(updatedEncounter, "Encounter updated successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to update encounter");
    }
  },

  /**
   * ✅ Soft Delete Encounter
   */
  async delete(req, res) {
    try {
      const { id } = req.params;
      const result = await encountersService.delete(id, req.user);
      return res.sendSuccess(result, "Encounter deleted successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to delete encounter");
    }
  },

  /**
   * ✅ Restore Soft Deleted Encounter
   */
  async restore(req, res) {
    try {
      const { id } = req.params;
      const result = await encountersService.restore(id, req.user);
      return res.sendSuccess(result, "Encounter restored successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to restore encounter");
    }
  },
};

export default encountersController;
