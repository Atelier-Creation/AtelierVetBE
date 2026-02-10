import labTechService from "../service/labtechnicians.service.js";
import parseZodSchema from "../../../utils/zodPharser.js";
import {
    createLabTechnicianSchema,
    updateLabTechnicianSchema,
} from "../dto/labtechnicians.dto.js";

const labTechniciansController = {
    /**
     * ✅ Create Lab Technician
     */
    async create(req, res) {
        try {
            // Parse and validate incoming data
            const labtechData = await parseZodSchema(createLabTechnicianSchema, req.body);

            // Extract password if new user to be created
            const { password } = req.body.user || {};
            if (!password) {
                return res.sendError("Password is required for lab technician user creation");
            }

            // Extract staff data if provided
            const staffData = req.body.staff || {};
            const userInfo = req.user || {};

            // Add audit fields
            labtechData.created_by = userInfo.id || null;
            labtechData.created_by_name = userInfo.username || null;
            labtechData.created_by_email = userInfo.email || null;

            // Call service
            const labtech = await labTechService.create({
                labTechData: req.body,        // includes labtech_name, labtech_email, etc.
                staffData: req.body.staff,    // nested staff object
                password: req.body.user.password
            });

            return res.sendSuccess(labtech, "Lab Technician, Staff Profile, and User created successfully");
        } catch (error) {
            return res.sendError(error.message || "Failed to create lab technician");
        }
    },

    /**
     * ✅ Get all lab technicians (with filters, pagination, search)
     */
    async getAll(req, res) {
        try {
            const labtechs = await labTechService.getAll({
                page: req.query.page,
                limit: req.query.limit,
                search: req.query.search,
                is_active: req.query.is_active,
                sort_by: req.query.sort_by,
                sort_order: req.query.sort_order,
            });

            return res.sendSuccess(labtechs, "Lab Technicians fetched successfully");
        } catch (error) {
            return res.sendError(error.message || "Failed to fetch lab technicians");
        }
    },

    /**
     * ✅ Get lab technician by ID
     */
    async getById(req, res) {
        try {
            const { id } = req.params;
            const labtech = await labTechService.getById(id);

            if (!labtech) {
                return res.sendError("Lab Technician not found", 404);
            }

            return res.sendSuccess(labtech, "Lab Technician fetched successfully");
        } catch (error) {
            return res.sendError(error.message || "Failed to fetch lab technician");
        }
    },

    /**
     * ✅ Update lab technician
     */
    async update(req, res) {
        try {
            const { id } = req.params;
            const validatedData = await parseZodSchema(updateLabTechnicianSchema, req.body);

            if (req.user) {
                validatedData.updated_by = req.user?.id;
                validatedData.updated_by_name = req.user?.username;
                validatedData.updated_by_email = req.user?.email;
            }

            const updated = await labTechService.update(id, validatedData);

            if (!updated) {
                return res.sendError("Lab Technician not found", 404);
            }

            return res.sendSuccess(updated, "Lab Technician updated successfully");
        } catch (error) {
            return res.sendError(error.message || "Failed to update lab technician");
        }
    },

    /**
     * ✅ Soft delete lab technician
     */
    async delete(req, res) {
        try {
            const { id } = req.params;
            const userInfo = req.user || {};

            const deleted = await labTechService.delete(id, userInfo);

            if (!deleted) {
                return res.sendError("Lab Technician not found", 404);
            }

            return res.sendSuccess(deleted, "Lab Technician deleted successfully");
        } catch (error) {
            return res.sendError(error.message || "Failed to delete lab technician");
        }
    },

    /**
     * ✅ Restore soft-deleted lab technician
     */
    async restore(req, res) {
        try {
            const { id } = req.params;
            const userInfo = req.user || {};

            const restored = await labTechService.restore(id, userInfo);

            if (!restored) {
                return res.sendError("Lab Technician not found", 404);
            }

            return res.sendSuccess(restored, "Lab Technician restored successfully");
        } catch (error) {
            return res.sendError(error.message || "Failed to restore lab technician");
        }
    },
};

export default labTechniciansController;
