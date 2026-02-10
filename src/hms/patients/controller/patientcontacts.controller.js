import patientContactsService from "../service/patientcontacts.service.js";
import parseZodSchema from "../../../utils/zodPharser.js";
import { createPatientContactSchema, updatePatientContactSchema } from "../dto/patientcontacts.dto.js";

const patientContactsController = {
  /**
   * ✅ Create patient contact
   */
  async create(req, res) {
    try {
      const contactData = await parseZodSchema(createPatientContactSchema, req.body);

      // Add audit info
      contactData.created_by = req.user?.id;
      contactData.created_by_name = req.user?.username;
      contactData.created_by_email = req.user?.email;

      const contact = await patientContactsService.create(contactData);
      return res.sendSuccess(contact, "Patient contact created successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to create patient contact");
    }
  },

  /**
   * ✅ Get all patient contacts
   */
  async getAll(req, res) {
    try {
      const contacts = await patientContactsService.getAll(req.query);
      return res.sendSuccess(contacts, "Patient contacts fetched successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to fetch patient contacts");
    }
  },

  /**
   * ✅ Get patient contact by ID
   */
  async getById(req, res) {
    try {
      const { id } = req.params;
      const contact = await patientContactsService.getById(id);
      return res.sendSuccess(contact, "Patient contact fetched successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to fetch patient contact");
    }
  },

  /**
   * ✅ Update patient contact
   */
  async update(req, res) {
    try {
      const { id } = req.params;
      const data = await parseZodSchema(updatePatientContactSchema, req.body);

      data.updated_by = req.user?.id;
      data.updated_by_name = req.user?.username;
      data.updated_by_email = req.user?.email;

      const updated = await patientContactsService.update(id, data);
      return res.sendSuccess(updated, "Patient contact updated successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to update patient contact");
    }
  },

  /**
   * ✅ Soft delete patient contact
   */
  async delete(req, res) {
    try {
      const { id } = req.params;
      const result = await patientContactsService.delete(id, req.user);
      return res.sendSuccess(result, "Patient contact deleted successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to delete patient contact");
    }
  },

  /**
   * ✅ Restore patient contact
   */
  async restore(req, res) {
    try {
      const { id } = req.params;
      const result = await patientContactsService.restore(id, req.user);
      return res.sendSuccess(result, "Patient contact restored successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to restore patient contact");
    }
  },
};

export default patientContactsController;
