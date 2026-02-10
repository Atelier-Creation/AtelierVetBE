// services/vendor.service.js
import Vendor from "../models/vendor.models.js";
import { Op } from "sequelize";

const vendorService = {
  // ✅ Create a new vendor
  async createVendor(data) {
    // Check if vendor with same GST or email already exists
    if (data.gst_number) {
      const gstExists = await Vendor.findOne({ where: { gst_number: data.gst_number } });
      if (gstExists) {
        throw new Error("Vendor with this GST number already exists.");
      }
    }

    if (data.email) {
      const emailExists = await Vendor.findOne({ where: { email: data.email } });
      if (emailExists) {
        throw new Error("Vendor with this email already exists.");
      }
    }

    // Create vendor
    const vendor = await Vendor.create(data);
    return vendor;
  },

  // ✅ Get all vendors with filters and pagination
  async getAllVendors({ filters = {}, limit = 10, offset = 0 } = {}) {
    const where = { is_active: true };

    // 🔎 Global search on name, contact person, or phone
    if (filters.search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${filters.search}%` } },
        { contact_person: { [Op.like]: `%${filters.search}%` } },
        { phone: { [Op.like]: `%${filters.search}%` } },
      ];
    }

    // Filter by status
    if (filters.status) {
      where.status = filters.status;
    }

    // Filter by GST number
    if (filters.gst_number) {
      where.gst_number = filters.gst_number;
    }

    const { count, rows } = await Vendor.findAndCountAll({
      where,
      limit,
      offset,
      order: [["createdAt", "DESC"]],
    });

    return {
      total: count,
      page: Math.floor(offset / limit) + 1,
      limit,
      data: rows,
    };
  },

  // ✅ Get vendor by ID
  async getVendorById(id) {
    const vendor = await Vendor.findByPk(id);
    if (!vendor || !vendor.is_active) throw new Error("Vendor not found or inactive.");
    return vendor;
  },

  // ✅ Update vendor
  async updateVendor(id, data) {
    const vendor = await Vendor.findByPk(id);
    if (!vendor) throw new Error("Vendor not found");

    // Optional: Prevent duplicate GST/email
    if (data.gst_number && data.gst_number !== vendor.gst_number) {
      const gstExists = await Vendor.findOne({ where: { gst_number: data.gst_number } });
      if (gstExists) throw new Error("Another vendor with this GST number already exists.");
    }

    if (data.email && data.email !== vendor.email) {
      const emailExists = await Vendor.findOne({ where: { email: data.email } });
      if (emailExists) throw new Error("Another vendor with this email already exists.");
    }

    await vendor.update(data);
    return vendor;
  },

  // ✅ Soft delete vendor
  async deleteVendor(id, deletedBy = {}) {
    const vendor = await Vendor.findByPk(id);
    if (!vendor) throw new Error("Vendor not found");

    vendor.is_active = false;
    vendor.status = "inactive";
    if (deletedBy) {
      vendor.deleted_by = deletedBy.id || null;
      vendor.deleted_by_name = deletedBy.name || null;
      vendor.deleted_by_email = deletedBy.email || null;
    }
    await vendor.save();

    return { message: "Vendor soft deleted successfully" };
  },

  // ✅ Restore vendor (optional)
  async restoreVendor(id) {
    const vendor = await Vendor.findByPk(id);
    if (!vendor) throw new Error("Vendor not found");

    vendor.is_active = true;
    vendor.status = "active";
    await vendor.save();

    return { message: "Vendor restored successfully" };
  },
};

export default vendorService;
