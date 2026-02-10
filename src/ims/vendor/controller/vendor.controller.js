// controllers/vendor.controller.js
import vendorService from "../service/vendor.service.js";
import { createVendorSchema, updateVendorSchema } from "../dto/vendor.dto.js";

const vendorController = {
  // ✅ Create Vendor
  async create(req, res) {
    try {
      const validatedData = createVendorSchema.parse(req.body);

      // Attach user info from token
      if (req.user) {
        validatedData.created_by = req.user.id;
        validatedData.created_by_name = req.user.username || req.user.name;
        validatedData.created_by_email = req.user.email;
      }

      // Auto-generate vendor code (optional)
      const lastVendor = await vendorService.getLastVendor?.();
      let lastNumber = 0;
      if (lastVendor && lastVendor.vendor_code) {
        const match = lastVendor.vendor_code.match(/VNO(\d+)/);
        if (match) lastNumber = parseInt(match[1]);
      }
      const newCodeNumber = (lastNumber + 1).toString().padStart(5, "0");
      validatedData.vendor_code = `VNO${newCodeNumber}`;

      const vendor = await vendorService.createVendor(validatedData);
      return res.status(201).json(vendor);
    } catch (err) {
      return res.status(400).json({
        error: err.errors || err.message,
      });
    }
  },

  // ✅ Get All Vendors
  async getAll(req, res) {
    try {
      let { page = 1, limit = 10, search, name, status, email, phone } = req.query;

      page = parseInt(page, 10);
      limit = parseInt(limit, 10);
      const offset = (page - 1) * limit;

      const filters = {};
      if (search) filters.search = search;
      if (name) filters.name = name;
      if (status) filters.status = status;
      if (email) filters.email = email;
      if (phone) filters.phone = phone;

      const result = await vendorService.getAllVendors({ filters, limit, offset });
      return res.json(result);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  // ✅ Get Vendor by ID
  async getById(req, res) {
    try {
      const vendor = await vendorService.getVendorById(req.params.id);
      if (!vendor) {
        return res.status(404).json({ error: "Vendor not found" });
      }
      return res.json(vendor);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  // ✅ Get Vendor by Code (optional)
  async getByCode(req, res) {
    try {
      const { code } = req.params;
      if (!code) {
        return res.status(400).json({ message: "Vendor code is required" });
      }

      const vendor = await vendorService.getVendorByCode(code);
      return res.json(vendor);
    } catch (err) {
      console.error("Error fetching vendor by code:", err.message);
      return res.status(404).json({ message: err.message || "Vendor not found" });
    }
  },

  // ✅ Update Vendor
  async update(req, res) {
    try {
      const validatedData = updateVendorSchema.parse(req.body);

      if (req.user) {
        validatedData.updated_by = req.user.id;
        validatedData.updated_by_name = req.user.username || req.user.name;
        validatedData.updated_by_email = req.user.email;
      }

      // Check duplicate vendor code
      if (validatedData.vendor_code) {
        const existing = await vendorService.findByCode(validatedData.vendor_code);
        if (existing && existing.id !== req.params.id) {
          return res.status(400).json({ error: "Vendor code already exists" });
        }
      }

      const vendor = await vendorService.updateVendor(req.params.id, validatedData);
      if (!vendor) {
        return res.status(404).json({ error: "Vendor not found" });
      }

      return res.json(vendor);
    } catch (err) {
      return res.status(400).json({
        error: err.errors || err.message,
      });
    }
  },

  // ✅ Delete Vendor (Soft Delete)
  async delete(req, res) {
    try {
      const vendor = await vendorService.getVendorById(req.params.id);
      if (!vendor) {
        return res.status(404).json({ error: "Vendor not found" });
      }

      const updateData = {
        is_active: false,
        deleted_by: req.user?.id || null,
        deleted_by_name: req.user?.username || req.user?.name || null,
        deleted_by_email: req.user?.email || null,
      };

      await vendorService.updateVendor(req.params.id, updateData);

      return res.json({ message: "Vendor soft deleted successfully" });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: err.message });
    }
  },
};

export default vendorController;
