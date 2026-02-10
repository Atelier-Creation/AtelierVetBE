import { sequelize } from "../../../db/index.js";
import ClientInsurance from "../models/clientinsurance.models.js";
import Clients from "../models/clients.models.js";

const clientInsuranceService = {
  /**
   * ✅ Create client insurance
   */
  async create(data) {
    if (
      !data ||
      !data.client_id ||
      !data.provider_name ||
      !data.policy_number ||
      !data.coverage_details ||
      !data.valid_from ||
      !data.valid_to
    ) {
      throw new Error(
        "client_id, provider_name, policy_number, coverage_details, valid_from, and valid_to are required"
      );
    }

    const insurance = await ClientInsurance.create(data);
    return insurance;
  },

  /**
   * ✅ Get all client insurance records
   */
  async getAll(options = {}) {
    const {
      page = 1,
      limit = 10,
      search = "",
      is_active,
      sort_by = "createdAt",
      sort_order = "DESC",
      client_id, // optional filter by client
    } = options;

    const offset = (page - 1) * limit;
    const where = {};

    if (search) {
      where.provider_name = { [sequelize.Op.like]: `%${search}%` };
    }

    if (is_active !== undefined) {
      where.is_active = is_active;
    }

    if (client_id) {
      where.client_id = client_id;
    }

    const { count, rows } = await ClientInsurance.findAndCountAll({
      where,
      offset,
      limit: Number(limit),
      order: [[sort_by, sort_order]],
      include: [
        {
          model: Clients,
          as: "client",
          attributes: ["id", "first_name", "last_name", "client_code", "email", "phone"],
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
    const insurance = await ClientInsurance.findByPk(id, {
      include: [
        {
          model: Clients,
          as: "client",
          attributes: ["id", "first_name", "last_name", "client_code", "email", "phone"],
        },
      ],
    });

    if (!insurance) throw new Error("Client insurance not found");
    return insurance;
  },

  /**
   * ✅ Update insurance
   */
  async update(id, data) {
    const insurance = await ClientInsurance.findByPk(id);
    if (!insurance) throw new Error("Client insurance not found");

    await insurance.update(data);
    return insurance;
  },

  /**
   * ✅ Soft delete insurance
   */
  async delete(id, userInfo = {}) {
    const insurance = await ClientInsurance.findByPk(id);
    if (!insurance) throw new Error("Client insurance not found");

    await insurance.update({
      is_active: false,
      deleted_by: userInfo.id || null,
      deleted_by_name: userInfo.name || null,
      deleted_by_email: userInfo.email || null,
    });

    return { message: "Client insurance deleted successfully" };
  },

  /**
   * ✅ Restore soft-deleted insurance
   */
  async restore(id, userInfo = {}) {
    const insurance = await ClientInsurance.findByPk(id);
    if (!insurance) throw new Error("Client insurance not found");

    await insurance.update({
      is_active: true,
      deleted_by: null,
      deleted_by_name: null,
      deleted_by_email: null,
      updated_by: userInfo.id || null,
      updated_by_name: userInfo.name || null,
      updated_by_email: userInfo.email || null,
    });

    return { message: "Client insurance restored successfully" };
  },
};

export default clientInsuranceService;
