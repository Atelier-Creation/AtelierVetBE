import { sequelize } from "../../../db/index.js";
import { Op } from "sequelize";
import RadiologyOrders from "../models/radiologyorders.models.js";
import Patient from "../../patients/models/patients.models.js";
import Encounter from "../../clinical/models/encounters.models.js";
import Doctor from "../../staff/models/doctor.models.js";
import User from "../../../user/models/user.model.js";


const radiologyOrdersService = {
  async create(data, userInfo = {}) {
    const transaction = await sequelize.transaction();
    try {
      if (!data.encounter_id) throw new Error("encounter_id is required");
      if (!data.test_name) throw new Error("test_name is required");

      // 🧩 Fetch patient_id from encounter if not provided
      if (!data.patient_id) {
        const encounter = await Encounter.findByPk(data.encounter_id);
        console.log(encounter);
        if (!encounter) throw new Error("Encounter not found");
        data.patient_id = encounter.patient_id;
        data.ordered_by = encounter.doctor_id;
      }
      


      // 🧮 Generate Radiology Order Number
      const count = await RadiologyOrders.count();
      const orderNo = `RO-${String(count + 1).padStart(5, "0")}`;

      // 🧾 Create Main Radiology Order
      const order = await RadiologyOrders.create(
        {
          patient_id: data.patient_id,
          encounter_id: data.encounter_id,
          ordered_by: data.ordered_by,
          test_name: data.test_name,
          order_no: orderNo,
          test_date: data.test_date || new Date(),
          status: "pending",
          priority: data.priority || "normal",
          created_by: userInfo.id || null,
          created_by_name: userInfo.name || null,
          created_by_email: userInfo.email || null,
        },
        { transaction }
      );

      await transaction.commit();
      return {
        message: "Radiology order created successfully",
        order_id: order.id,
        order_no: order.order_no,
      };
    } catch (error) {
      await transaction.rollback();
      console.error("❌ Error creating radiology order:", error);
      throw new Error(error.message || "Failed to create radiology order");
    }
  },

  /**
   * ✅ Get All Radiology Orders (with filters & pagination)
   */
  async getAll(options = {}) {
    const {
      page = 1,
      limit = 10,
      search = "",
      status,
      patient_id,
      start_date,
      end_date,
      sort_by = "createdAt",
      sort_order = "DESC",
    } = options;

    const offset = (page - 1) * limit;
    const where = {};

    if (search) {
      where[Op.or] = [
        { order_no: { [Op.like]: `%${search}%` } },
        { test_name: { [Op.like]: `%${search}%` } },
      ];
    }

    if (status) where.status = status;
    if (patient_id) where.patient_id = patient_id;
    if (start_date && end_date)
      where.test_date = { [Op.between]: [new Date(start_date), new Date(end_date)] };

    const { count, rows } = await RadiologyOrders.findAndCountAll({
      where,
      offset,
      limit: Number(limit),
      order: [[sort_by, sort_order]],
      include: [
        { model: Patient, as: "patient" },
        { model: Encounter, as: "encounter" },
        { model: Doctor, as: "doctor", foreignKey: "ordered_by" },
      ],
    });

    return {
      total: count,
      currentPage: page,
      totalPages: Math.ceil(count / limit),
      data: rows,
    };
  },

  /**
   * ✅ Get Radiology Order by ID
   */
  async getById(id) {
    const order = await RadiologyOrders.findByPk(id, {
      include: [
        { model: Patient, as: "patient" },
        { model: Encounter, as: "encounter" },
        { model: Doctor, as: "doctor", foreignKey: "ordered_by" },
      ],
    });

    if (!order) throw new Error("Radiology order not found");
    return order;
  },

  /**
   * ✅ Get Radiology Orders by Patient ID
   */
  async getByPatient(patient_id) {
    if (!patient_id) throw new Error("patient_id is required");

    const orders = await RadiologyOrders.findAll({
      where: { patient_id },
      order: [["createdAt", "DESC"]],
      include: [
        { model: Encounter, as: "encounter" },
        { model: Doctor, as: "doctor", foreignKey: "ordered_by" },
      ],
    });

    return orders;
  },

  /**
   * ✅ Get All Pending Radiology Orders
   */
  async getPending() {
    const orders = await RadiologyOrders.findAll({
      where: { status: "pending" },
      order: [["createdAt", "DESC"]],
      include: [
        { model: Patient, as: "patient" },
        { model: Encounter, as: "encounter" },
        { model: Doctor, as: "doctor", foreignKey: "ordered_by" },
      ],
    });

    return orders;
  },

  /**
   * ✅ Mark Radiology Test as Completed (upload report)
   */
  async markCompleted(order_id, data, userInfo = {}) {
    if (!order_id) throw new Error("order_id is required");

    const order = await RadiologyOrders.findByPk(order_id);
    if (!order) throw new Error("Radiology order not found");

    await order.update({
      status: "completed",
      report_file_url: data.report_file_url || order.report_file_url,
      updated_by: userInfo.id || null,
      updated_by_name: userInfo.name || null,
      updated_by_email: userInfo.email || null,
    });

    return { message: "Radiology report uploaded successfully" };
  },

  /**
   * ✅ Delete (Soft Delete) Radiology Order
   */
  async delete(id, userInfo = {}) {
    const order = await RadiologyOrders.findByPk(id);
    if (!order) throw new Error("Radiology order not found");

    await order.update({
      is_active: false,
      status: "cancelled",
      deleted_by: userInfo.id || null,
      deleted_by_name: userInfo.name || null,
      deleted_by_email: userInfo.email || null,
    });

    return { message: "Radiology order cancelled successfully" };
  },
};

export default radiologyOrdersService;
