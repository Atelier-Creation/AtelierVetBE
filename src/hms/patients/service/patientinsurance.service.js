import { sequelize } from "../../../db/index.js";
import PatientInsurance from "../models/patientinsurance.models.js";
import Patients from "../models/patients.models.js";

const patientInsuranceService = {
  /**
   * ✅ Create patient insurance
   */
  async create(data) {
    if (
      !data ||
      !data.patient_id ||
      !data.provider_name ||
      !data.policy_number ||
      !data.coverage_details ||
      !data.valid_from ||
      !data.valid_to
    ) {
      throw new Error(
        "patient_id, provider_name, policy_number, coverage_details, valid_from, and valid_to are required"
      );
    }

    const insurance = await PatientInsurance.create(data);
    return insurance;
  },

  /**
   * ✅ Get all patient insurance records
   */
  async getAll(options = {}) {
    const {
      page = 1,
      limit = 10,
      search = "",
      is_active,
      sort_by = "createdAt",
      sort_order = "DESC",
      patient_id, // optional filter by patient
    } = options;

    const offset = (page - 1) * limit;
    const where = {};

    if (search) {
      where.provider_name = { [sequelize.Op.like]: `%${search}%` };
    }

    if (is_active !== undefined) {
      where.is_active = is_active;
    }

    if (patient_id) {
      where.patient_id = patient_id;
    }

    const { count, rows } = await PatientInsurance.findAndCountAll({
      where,
      offset,
      limit: Number(limit),
      order: [[sort_by, sort_order]],
      include: [
        {
          model: Patients,
          as: "patient",
          attributes: ["id", "first_name", "last_name", "patient_code", "email", "phone"],
        },
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
   * ✅ Get insurance by ID
   */
  async getById(id) {
    const insurance = await PatientInsurance.findByPk(id, {
      include: [
        {
          model: Patients,
          as: "patient",
          attributes: ["id", "first_name", "last_name", "patient_code", "email", "phone"],
        },
      ],
    });

    if (!insurance) throw new Error("Patient insurance not found");
    return insurance;
  },

  /**
   * ✅ Update insurance
   */
  async update(id, data) {
    const insurance = await PatientInsurance.findByPk(id);
    if (!insurance) throw new Error("Patient insurance not found");

    await insurance.update(data);
    return insurance;
  },

  /**
   * ✅ Soft delete insurance
   */
  async delete(id, userInfo = {}) {
    const insurance = await PatientInsurance.findByPk(id);
    if (!insurance) throw new Error("Patient insurance not found");

    await insurance.update({
      is_active: false,
      deleted_by: userInfo.id || null,
      deleted_by_name: userInfo.name || null,
      deleted_by_email: userInfo.email || null,
    });

    return { message: "Patient insurance deleted successfully" };
  },

  /**
   * ✅ Restore soft-deleted insurance
   */
  async restore(id, userInfo = {}) {
    const insurance = await PatientInsurance.findByPk(id);
    if (!insurance) throw new Error("Patient insurance not found");

    await insurance.update({
      is_active: true,
      deleted_by: null,
      deleted_by_name: null,
      deleted_by_email: null,
      updated_by: userInfo.id || null,
      updated_by_name: userInfo.name || null,
      updated_by_email: userInfo.email || null,
    });

    return { message: "Patient insurance restored successfully" };
  },
};

export default patientInsuranceService;
