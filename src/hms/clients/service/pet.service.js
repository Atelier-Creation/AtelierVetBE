import { sequelize } from "../../../db/index.js";
import Pet from "../models/pet.models.js";

const petService = {
  // Create Pet
  async create(data, userInfo = {}) {
    if (
      !data ||
      !data.name ||
      !data.client_id ||
      !data.pet_type ||
      !data.dob ||
      !data.age ||
      !data.gender
    ) {
      throw new Error(
        "name, client_id, pet_type, dob, age, and gender are required"
      );
    }

    const pet = await Pet.create({
      ...data,
      created_by: userInfo.id || null,
      created_by_name: userInfo.name || null,
      created_by_email: userInfo.email || null,
    });

    return pet;
  },

  // Get All Pets (with pagination, search & filters)
  async getAll(options = {}) {
    const {
      page = 1,
      limit = 10,
      search = "",
      is_active,
      sort_by = "createdAt",
      sort_order = "DESC",
      client_id,
      pet_type,
      gender,
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

    if (pet_type) {
      where.pet_type = pet_type;
    }

    if (gender) {
      where.gender = gender;
    }

    const { count, rows } = await Pet.findAndCountAll({
      where,
      offset,
      limit: Number(limit),
      order: [[sort_by, sort_order]],
    });

    return {
      total: count,
      currentPage: Number(page),
      totalPages: Math.ceil(count / limit),
      data: rows,
    };
  },

  // Get Pet by ID
  async getById(id) {
    const pet = await Pet.findByPk(id);
    if (!pet) throw new Error("Pet not found");
    return pet;
  },

  // Update Pet
  async update(id, data, userInfo = {}) {
    const pet = await Pet.findByPk(id);
    if (!pet) throw new Error("Pet not found");

    await pet.update({
      ...data,
      updated_by: userInfo.id || null,
      updated_by_name: userInfo.name || null,
      updated_by_email: userInfo.email || null,
    });

    return pet;
  },

  // Soft Delete Pet
  async delete(id, userInfo = {}) {
    const pet = await Pet.findByPk(id);
    if (!pet) throw new Error("Pet not found");

    await pet.update({
      is_active: false,
      deleted_by: userInfo.id || null,
      deleted_by_name: userInfo.name || null,
      deleted_by_email: userInfo.email || null,
    });

    return { message: "Pet deleted successfully" };
  },

  // Restore Pet
  async restore(id, userInfo = {}) {
    const pet = await Pet.findByPk(id);
    if (!pet) throw new Error("Pet not found");

    await pet.update({
      is_active: true,
      deleted_by: null,
      deleted_by_name: null,
      deleted_by_email: null,
      updated_by: userInfo.id || null,
      updated_by_name: userInfo.name || null,
      updated_by_email: userInfo.email || null,
    });

    return { message: "Pet restored successfully" };
  },
};

export default petService;
