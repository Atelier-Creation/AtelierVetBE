import appointmentService from "../service/appointments.service.js";
import parseZodSchema from "../../../utils/zodPharser.js";
import {
  createAppointmentSchema,
  updateAppointmentSchema,
} from "../dto/appointments.dto.js";

const appointmentController = {
  /**
   * ✅ Create Appointment
   */
  async create(req, res) {
    try {
      // Validate input using Zod
      const appointmentData = await parseZodSchema(createAppointmentSchema, req.body);

      // Add audit info
      appointmentData.created_by = req.user?.id;
      appointmentData.created_by_name = req.user?.username;
      appointmentData.created_by_email = req.user?.email;

      // Call service
      const appointment = await appointmentService.create(appointmentData);
      return res.sendSuccess(appointment, "Appointment created successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to create appointment");
    }
  },

  /**
   * ✅ Get All Appointments
   */
  async getAll(req, res) {
    try {
      const appointments = await appointmentService.getAll(req.query);
      return res.sendSuccess(appointments, "Appointments fetched successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to fetch appointments");
    }
  },

  /**
   * ✅ Get Appointment By ID
   */
  async getById(req, res) {
    try {
      const { id } = req.params;
      const appointment = await appointmentService.getById(id);
      return res.sendSuccess(appointment, "Appointment fetched successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to fetch appointment");
    }
  },

  /**
   * ✅ Update Appointment
   */
  async update(req, res) {
    try {
      const { id } = req.params;
      const data = await parseZodSchema(updateAppointmentSchema, req.body);

      // Add audit info
      data.updated_by = req.user?.id;
      data.updated_by_name = req.user?.username;
      data.updated_by_email = req.user?.email;

      const updated = await appointmentService.update(id, data);
      return res.sendSuccess(updated, "Appointment updated successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to update appointment");
    }
  },

  /**
   * ✅ Cancel Appointment (Soft Delete)
   */
  async delete(req, res) {
    try {
      const { id } = req.params;
      const result = await appointmentService.delete(id, req.user);
      return res.sendSuccess(result, "Appointment cancelled successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to cancel appointment");
    }
  },

  /**
   * ✅ Restore Appointment
   */
  async restore(req, res) {
    try {
      const { id } = req.params;
      const result = await appointmentService.restore(id, req.user);
      return res.sendSuccess(result, "Appointment restored successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to restore appointment");
    }
  },
  
  async getAvailableSlots(req, res) {
    try {
      const slots = await appointmentService.getAvailableSlots();
      return res.sendSuccess(slots, "Available slots fetched successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to fetch available slots");
    }
  },
  async getAppointmentstodaybydoctorId(req, res) {
    try {
      const DoctorId = req.user?.id || req.body.id;
      if (!DoctorId) {
        return res.sendError("User not found");
      }
      const slots = await appointmentService.getAppointmentsTodayByDoctorId(DoctorId);
      return res.sendSuccess(slots, "Available slots fetched successfully");
    } catch (error) {
      return res.sendError(error.message || "Failed to fetch available slots");
    }
  }
};

export default appointmentController;
