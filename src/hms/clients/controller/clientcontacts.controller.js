import clientContactsService from "../service/clientcontacts.service.js";
import parseZodSchema from "../../../utils/zodPharser.js";
import { createClientContactSchema, updateClientContactSchema } from "../dto/clientcontacts.dto.js";

const clientContactsController = {
  /**
   * ✅ Create client contact
   */
  async create(req, res) {
    try {
      const contactData = await parseZodSchema(createClientContactSchema, req.body);

      // Add audit info
      contactData.created_by = req.user?.id;
      contactData.created_by_name = req.user?.username;
      contactData.created_by_email = req.user?.email;

      const contact = await clientContactsService.create(contactData);
      return res.sendSuccess(contact, "Client contact created successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to create client contact");
    }
  },

  /**
   * ✅ Get all client contacts
   */
  async getAll(req, res) {
    try {
      const contacts = await clientContactsService.getAll(req.query);
      return res.sendSuccess(contacts, "Client contacts fetched successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to fetch client contacts");
    }
  },

  /**
   * ✅ Get client contact by ID
   */
  async getById(req, res) {
    try {
      const { id } = req.params;
      const contact = await clientContactsService.getById(id);
      return res.sendSuccess(contact, "Client contact fetched successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to fetch client contact");
    }
  },

  /**
   * ✅ Update client contact
   */
  async update(req, res) {
    try {
      const { id } = req.params;
      const data = await parseZodSchema(updateClientContactSchema, req.body);

      data.updated_by = req.user?.id;
      data.updated_by_name = req.user?.username;
      data.updated_by_email = req.user?.email;

      const updated = await clientContactsService.update(id, data);
      return res.sendSuccess(updated, "Client contact updated successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to update client contact");
    }
  },

  /**
   * ✅ Soft delete client contact
   */
  async delete(req, res) {
    try {
      const { id } = req.params;
      const result = await clientContactsService.delete(id, req.user);
      return res.sendSuccess(result, "Client contact deleted successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to delete client contact");
    }
  },

  /**
   * ✅ Restore client contact
   */
  async restore(req, res) {
    try {
      const { id } = req.params;
      const result = await clientContactsService.restore(id, req.user);
      return res.sendSuccess(result, "Client contact restored successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to restore client contact");
    }
  },
};

export default clientContactsController;
