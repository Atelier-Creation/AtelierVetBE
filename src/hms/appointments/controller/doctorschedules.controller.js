import doctorSchedulesService from "../service/doctorschedules.service.js";
import parseZodSchema from "../../../utils/zodPharser.js";
import {
  createDoctorScheduleSchema,
  updateDoctorScheduleSchema,
} from "../dto/doctorschedules.dto.js";

const doctorSchedulesController = {
  /**
   * ✅ Create Doctor Schedule
   */
  async create(req, res) {
    try {
      // Validate request body using Zod
      const scheduleData = await parseZodSchema(createDoctorScheduleSchema, req.body);

      // Add audit info
      scheduleData.created_by = req.user?.id;
      scheduleData.created_by_name = req.user?.username;
      scheduleData.created_by_email = req.user?.email;

      // Call service
      const schedule = await doctorSchedulesService.create(scheduleData);
      return res.sendSuccess(schedule, "Doctor schedule created successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to create doctor schedule");
    }
  },

  /**
   * ✅ Get all doctor schedules
   */
  async getAll(req, res) {
    try {
      const schedules = await doctorSchedulesService.getAll(req.query);
      return res.sendSuccess(schedules, "Doctor schedules fetched successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to fetch doctor schedules");
    }
  },

  /**
   * ✅ Get doctor schedule by ID
   */
  async getById(req, res) {
    try {
      const { id } = req.params;
      const schedule = await doctorSchedulesService.getById(id);
      return res.sendSuccess(schedule, "Doctor schedule fetched successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to fetch doctor schedule");
    }
  },

  /**
   * ✅ Get doctor schedule by Doctor ID
   */
  async getByDoctorId(req, res) {
    try {
      const { id } = req.params; // doctor_id
      const schedule = await doctorSchedulesService.getByDoctorId(id);
      return res.sendSuccess(schedule, "Doctor schedule fetched successfully by doctor ID");
    } catch (error) {
      return res.sendError(error.message || "Failed to fetch doctor schedule by doctor ID");
    }
  },

  /**
   * ✅ Update doctor schedule
   */
  async update(req, res) {
    try {
      const { id } = req.params;
      const data = await parseZodSchema(updateDoctorScheduleSchema, req.body);

      data.updated_by = req.user?.id;
      data.updated_by_name = req.user?.username;
      data.updated_by_email = req.user?.email;

      const updated = await doctorSchedulesService.update(id, data);
      return res.sendSuccess(updated, "Doctor schedule updated successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to update doctor schedule");
    }
  },

  /**
   * ✅ Soft delete doctor schedule
   */
  async delete(req, res) {
    try {
      const { id } = req.params;
      const result = await doctorSchedulesService.delete(id, req.user);
      return res.sendSuccess(result, "Doctor schedule deleted successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to delete doctor schedule");
    }
  },

  /**
   * ✅ Restore doctor schedule
   */
  async restore(req, res) {
    try {
      const { id } = req.params;
      const result = await doctorSchedulesService.restore(id, req.user);
      return res.sendSuccess(result, "Doctor schedule restored successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to restore doctor schedule");
    }
  },
};

export default doctorSchedulesController;
