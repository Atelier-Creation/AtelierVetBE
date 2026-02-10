import { sequelize } from "../../../db/index.js";
import ClientContacts from "../models/clientcontacts.models.js";

const clientContactsService = {
  async create(data) {
    if (!data || !data.client_id || !data.name || !data.phone || !data.relationship) {
      throw new Error("client_id, name, phone, and relationship are required");
    }

    const contact = await ClientContacts.create(data);
    return contact;
  },

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
      where.name = { [sequelize.Op.like]: `%${search}%` };
    }

    if (is_active !== undefined) {
      where.is_active = is_active;
    }

    if (client_id) {
      where.client_id = client_id;
    }

    const { count, rows } = await ClientContacts.findAndCountAll({
      where,
      offset,
      limit: Number(limit),
      order: [[sort_by, sort_order]],
    });

    return {
      total: count,
      currentPage: page,
      totalPages: Math.ceil(count / limit),
      data: rows,
    };
  },

  async getById(id) {
    const contact = await ClientContacts.findByPk(id);
    if (!contact) throw new Error("Contact not found");
    return contact;
  },

  async update(id, data) {
    const contact = await ClientContacts.findByPk(id);
    if (!contact) throw new Error("Contact not found");

    await contact.update(data);
    return contact;
  },

  async delete(id, userInfo = {}) {
    const contact = await ClientContacts.findByPk(id);
    if (!contact) throw new Error("Contact not found");

    await contact.update({
      is_active: false,
      deleted_by: userInfo.id || null,
      deleted_by_name: userInfo.name || null,
      deleted_by_email: userInfo.email || null,
    });

    return { message: "Contact deleted successfully" };
  },

  async restore(id, userInfo = {}) {
    const contact = await ClientContacts.findByPk(id);
    if (!contact) throw new Error("Contact not found");

    await contact.update({
      is_active: true,
      deleted_by: null,
      deleted_by_name: null,
      deleted_by_email: null,
      updated_by: userInfo.id || null,
      updated_by_name: userInfo.name || null,
      updated_by_email: userInfo.email || null,
    });

    return { message: "Contact restored successfully" };
  },
};

export default clientContactsService;
