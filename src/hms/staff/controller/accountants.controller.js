import accountantService from "../service/accountants.service.js";
import parseZodSchema from "../../../utils/zodPharser.js";
import { createAccountantSchema, updateAccountantSchema } from "../dto/accountants.dto.js";

const accountantsController = {
  /**
   * ✅ Create an Accountant with StaffProfile and EndUser
   */
  async create(req, res) {
    try {
      // 1️⃣ Extract password from request body
      const { password } = req.body.user || {};
      if (!password) return res.sendError("Password is required for accountant user creation");

      // 2️⃣ Extract staff profile data if provided
      const staffData = req.body.staff || {};

      // 3️⃣ Parse and validate accountant data
      const accountantData = await parseZodSchema(createAccountantSchema, req.body);

      // 4️⃣ Add audit fields
      accountantData.created_by = req.user?.id || null;
      accountantData.created_by_name = req.user?.username || null;
      accountantData.created_by_email = req.user?.email || null;

      // 5️⃣ Call service
      const result = await accountantService.create({
        accountantData,
        staffData,
        password,
      });

      return res.sendSuccess(result, "Accountant, Staff Profile, and User created successfully");
    } catch (err) {
      return res.sendError(err.message || "Failed to create accountant");
    }
  },

  /**
   * ✅ Get all accountants
   */
  async getAll(req, res) {
    try {
      const accountants = await accountantService.getAll(req.query);
      return res.sendSuccess(accountants, "Accountants fetched successfully");
    } catch (err) {
      return res.sendError(err.message || "Failed to fetch accountants");
    }
  },

  /**
   * ✅ Get accountant by ID
   */
  async getById(req, res) {
    try {
      const { id } = req.params;
      const accountant = await accountantService.getById(id);
      return res.sendSuccess(accountant, "Accountant fetched successfully");
    } catch (err) {
      return res.sendError(err.message || "Failed to fetch accountant");
    }
  },

  /**
   * ✅ Update accountant
   */
  async update(req, res) {
    try {
      const { id } = req.params;

      // Parse and validate update payload
      const validatedData = await parseZodSchema(updateAccountantSchema, req.body);

      // Add audit fields
      validatedData.updated_by = req.user?.id || null;
      validatedData.updated_by_name = req.user?.username || null;
      validatedData.updated_by_email = req.user?.email || null;

      const updated = await accountantService.update(id, validatedData);
      return res.sendSuccess(updated, "Accountant updated successfully");
    } catch (err) {
      return res.sendError(err.message || "Failed to update accountant");
    }
  },

  /**
   * ✅ Soft delete accountant
   */
  async delete(req, res) {
    try {
      const { id } = req.params;
      const result = await accountantService.delete(id, req.user);
      return res.sendSuccess(result, "Accountant deleted successfully");
    } catch (err) {
      return res.sendError(err.message || "Failed to delete accountant");
    }
  },

  /**
   * ✅ Restore soft-deleted accountant
   */
  async restore(req, res) {
    try {
      const { id } = req.params;
      const result = await accountantService.restore(id, req.user);
      return res.sendSuccess(result, "Accountant restored successfully");
    } catch (err) {
      return res.sendError(err.message || "Failed to restore accountant");
    }
  },
};

export default accountantsController;
