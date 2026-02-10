import clinicalNotesService from "../service/clinicalnotes.service.js";
import parseZodSchema from "../../../utils/zodPharser.js";
import {
  createClinicalNoteSchema,
  updateClinicalNoteSchema,
} from "../dto/clinicalnotes.dto.js";

const clinicalNotesController = {
  /**
   * ✅ Create Clinical Note
   */
  async create(req, res) {
    try {
      const noteData = await parseZodSchema(createClinicalNoteSchema, req.body);

      // Add audit info
      noteData.created_by = req.user?.id;
      noteData.created_by_name = req.user?.username;
      noteData.created_by_email = req.user?.email;

      const note = await clinicalNotesService.create(noteData, req.user);
      return res.sendSuccess(note, "Clinical note added successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to add clinical note");
    }
  },

  /**
   * ✅ Get All Clinical Notes (with pagination & filters)
   */
  async getAll(req, res) {
    try {
      const notes = await clinicalNotesService.getAll(req.query);
      return res.sendSuccess(notes, "Clinical notes fetched successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to fetch clinical notes");
    }
  },

  /**
   * ✅ Get Clinical Note by ID
   */
  async getById(req, res) {
    try {
      const { id } = req.params;
      const note = await clinicalNotesService.getById(id);
      return res.sendSuccess(note, "Clinical note fetched successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to fetch clinical note");
    }
  },

  /**
   * ✅ Get Clinical Notes by Encounter ID
   */
  async getByEncounterId(req, res) {
    try {
      const { id } = req.params;
      const notes = await clinicalNotesService.getByEncounterId(id);
      return res.sendSuccess(notes, "Clinical notes fetched successfully by encounter ID");
    } catch (error) {
      return res.sendError(error.message || "Failed to fetch clinical notes by encounter ID");
    }
  },

  /**
   * ✅ Update Clinical Note
   */
  async update(req, res) {
    try {
      const { id } = req.params;
      const data = await parseZodSchema(updateClinicalNoteSchema, req.body);

      // Add audit info
      data.updated_by = req.user?.id;
      data.updated_by_name = req.user?.username;
      data.updated_by_email = req.user?.email;

      const updatedNote = await clinicalNotesService.update(id, data, req.user);
      return res.sendSuccess(updatedNote, "Clinical note updated successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to update clinical note");
    }
  },

  /**
   * ✅ Delete Clinical Note (Soft delete)
   */
  async delete(req, res) {
    try {
      const { id } = req.params;
      const result = await clinicalNotesService.delete(id, req.user);
      return res.sendSuccess(result, "Clinical note deleted successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to delete clinical note");
    }
  },
};

export default clinicalNotesController;
