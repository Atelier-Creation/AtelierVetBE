// controllers/inward.controller.js
import inwardService from "../service/inward.service.js";

const inwardController = {
  // ✅ Create new Inward with items
  async create(req, res) {
    try {
      const data = req.body;

      // Attach user info from token
      if (req.user) {
        data.created_by = req.user.id;
        data.created_by_name = req.user.username || req.user.name;
        data.created_by_email = req.user.email;
      }

      const inward = await inwardService.createInwardWithItems(data);
      return res.status(201).json({
        message: "Inward created successfully",
        data: inward,
      });
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  },

  // ✅ Get all inwards with filters + pagination
  async getAll(req, res) {
    try {
      let { page = 1, limit = 10, ...filters } = req.query;

      page = parseInt(page, 10);
      limit = parseInt(limit, 10);
      const offset = (page - 1) * limit;

      const result = await inwardService.getAllInwards({
        filters,
        limit,
        offset,
      });

      return res.json(result);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  // ✅ Get inward by ID (with items)
  async getById(req, res) {
    try {
      const inward = await inwardService.getInwardById(req.params.id);
      if (!inward) {
        return res.status(404).json({ error: "Inward not found" });
      }
      return res.json(inward);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  // ✅ Update inward (and items if provided)
  async update(req, res) {
    try {
      const data = req.body;

      // Attach updater info
      if (req.user) {
        data.updated_by = req.user.id;
        data.updated_by_name = req.user.username || req.user.name;
        data.updated_by_email = req.user.email;
      }

      const inward = await inwardService.updateInwardWithItems(
        req.params.id,
        data
      );

      if (!inward) {
        return res.status(404).json({ error: "Inward not found" });
      }

      return res.json({
        message: "Inward updated successfully",
        data: inward,
      });
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  },

  // ✅ Delete inward (soft delete inward + items)
  async delete(req, res) {
    try {
      const inward = await inwardService.getInwardById(req.params.id);
      if (!inward) {
        return res.status(404).json({ error: "Inward not found" });
      }

      const result = await inwardService.deleteInwardWithItems(
        req.params.id,
        req.user || {}
      );

      return res.json({
        message: "Inward deleted successfully",
        data: result,
      });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },
};

export default inwardController;
