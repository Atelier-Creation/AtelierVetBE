import clientService from "../service/clients.service.js";
import parseZodSchema from "../../../utils/zodPharser.js";
import { createClientSchema, updateClientSchema } from "../dto/clients.dto.js";

const clientController = {
  /**
   * ✅ Create Client (with linked EndUser)
   */
  async create(req, res) {
    try {
      // 1️⃣ Extract password from request
      const { password } = req.body.user || {};
      if (!password) return res.sendError("Password is required for user creation");

      // 2️⃣ Validate client data with Zod
      const clientData = await parseZodSchema(createClientSchema, req.body);

      // 3️⃣ Add audit info
      clientData.created_by = req.user?.id;
      clientData.created_by_name = req.user?.username;
      clientData.created_by_email = req.user?.email;

      // 4️⃣ Call service to create client and linked EndUser
      const result = await clientService.create({ clientData, password });

      return res.sendSuccess(result, "Client and User created successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to create client");
    }
  },

  /**
   * ✅ Get all clients
   */
  async getAll(req, res) {
    try {
      const clients = await clientService.getAll(req.query);
      return res.sendSuccess(clients, "Clients fetched successfully");
    } catch (err) {
      return res.sendError(err.message || "Failed to fetch clients");
    }
  },

  /**
   * ✅ Get client by ID
   */
  async getById(req, res) {
    try {
      const { id } = req.params;
      const client = await clientService.getById(id);
      return res.sendSuccess(client, "Client fetched successfully");
    } catch (err) {
      return res.sendError(err.message || "Failed to fetch client");
    }
  },


async getHistory(req, res) {
  try {
    const { id } = req.params;
    if (!id) return res.sendError("Client id is required");

    const { fromDate, toDate, limit } = req.query;

    // Basic validation for dates
    if (fromDate && isNaN(Date.parse(fromDate))) {
      return res.sendError("Invalid fromDate. Use ISO date format (e.g. 2025-10-01).");
    }
    if (toDate && isNaN(Date.parse(toDate))) {
      return res.sendError("Invalid toDate. Use ISO date format (e.g. 2025-10-31).");
    }

    const opts = {};
    if (fromDate) opts.fromDate = fromDate;
    if (toDate) opts.toDate = toDate;
    if (limit) opts.limit = Number(limit) || undefined;

    const history = await clientService.getHistory(id, opts);
    return res.sendSuccess(history, "Client history fetched successfully");
  } catch (error) {
    console.error("Error in getHistory:", error);
    return res.sendError(error.message || "Failed to fetch client history");
  }
},


  /**
   * ✅ Update client
   */
  async update(req, res) {
    try {
      const { id } = req.params;
      const data = await parseZodSchema(updateClientSchema, req.body);

      data.updated_by = req.user?.id;
      data.updated_by_name = req.user?.username;
      data.updated_by_email = req.user?.email;

      const updated = await clientService.update(id, data);
      return res.sendSuccess(updated, "Client updated successfully");
    } catch (err) {
      return res.sendError(err.message || "Failed to update client");
    }
  },

  /**
   * ✅ Soft delete client
   */
  async delete(req, res) {
    try {
      const { id } = req.params;
      const result = await clientService.delete(id, req.user);
      return res.sendSuccess(result, "Client deleted successfully");
    } catch (err) {
      return res.sendError(err.message || "Failed to delete client");
    }
  },

  /**
   * ✅ Restore client
   */
  async restore(req, res) {
    try {
      const { id } = req.params;
      const result = await clientService.restore(id, req.user);
      return res.sendSuccess(result, "Client restored successfully");
    } catch (err) {
      return res.sendError(err.message || "Failed to restore client");
    }
  },
};

export default clientController;
