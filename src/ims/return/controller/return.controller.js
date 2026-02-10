// controllers/return.controller.js
import returnService from "../service/return.service.js";
import { createReturnSchema, updateReturnSchema } from "../dto/return.dto.js";
import { ZodError } from "zod";

const returnController = {
  // Create a return (optionally processed immediately if status === 'processed')
  async create(req, res) {
    try {
      // validate request body
      const data = createReturnSchema.parse(req.body);

      // attach audit fields from token/user if present
      if (req.user) {
        data.created_by = req.user.id;
        data.created_by_name = req.user.username || req.user.name;
        data.created_by_email = req.user.email;
      }

      const created = await returnService.createReturnWithItems(data);

      return res.status(201).json({
        message: "Return created successfully",
        data: created,
      });
    } catch (err) {
      if (err instanceof ZodError) {
        return res.status(422).json({ error: "Validation failed", details: err.errors });
      }
      return res.status(400).json({ error: err.message });
    }
  },

  // Get list of returns (filters + pagination)
  async getAll(req, res) {
    try {
      let { page = 1, limit = 10, ...filters } = req.query;
      page = parseInt(page, 10);
      limit = parseInt(limit, 10);
      const offset = (page - 1) * limit;

      const result = await returnService.getAllReturns({
        filters,
        limit,
        offset,
      });

      return res.json(result);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  // Get return by id (with items)
  async getById(req, res) {
    try {
      const id = req.params.id;
      const ret = await returnService.getReturnById(id);
      if (!ret) return res.status(404).json({ error: "Return not found" });
      return res.json(ret);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  // Process a pending return by id (runs FIFO allocation / updates stock)
  // POST /returns/:id/process
  async process(req, res) {
    try {
      const id = req.params.id;
      const processed = await returnService.processReturnById(id);
      return res.json({
        message: "Return processed successfully",
        data: processed,
      });
    } catch (err) {
      // insufficient stock / other business errors return 400
      return res.status(400).json({ error: err.message });
    }
  },

  // Update a return (only allowed while pending — service enforces)
  async update(req, res) {
    try {
      // validate partial update
      const data = updateReturnSchema.parse(req.body);

      // attach updater info
      if (req.user) {
        data.updated_by = req.user.id;
        data.updated_by_name = req.user.username || req.user.name;
        data.updated_by_email = req.user.email;
      }

      const updated = await returnService.updateReturnWithItems(req.params.id, data);

      if (!updated) return res.status(404).json({ error: "Return not found" });

      return res.json({
        message: "Return updated successfully",
        data: updated,
      });
    } catch (err) {
      if (err instanceof ZodError) {
        return res.status(422).json({ error: "Validation failed", details: err.errors });
      }
      // service may throw business errors (e.g., cannot update processed returns)
      return res.status(400).json({ error: err.message });
    }
  },

  // Soft delete a return (and its items)
  async delete(req, res) {
    try {
      const user = req.user || {};
      const result = await returnService.deleteReturn(req.params.id, user);
      if (!result) return res.status(404).json({ error: "Return not found" });
      return res.json({
        message: "Return deleted successfully",
        data: result,
      });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },
};

export default returnController;
