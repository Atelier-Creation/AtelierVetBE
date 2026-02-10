import { Op } from "sequelize";
import { sequelize } from "../../../db/index.js";
import Encounters from "../models/encounters.models.js";
import Client from "../../clients/models/clients.models.js";
import Doctor from "../../staff/models/doctor.models.js";
import Appointment from "../../appointments/models/appointments.models.js";

const encountersService = {
    /**
     * ✅ Create Encounter
     */
    async create(data, user) {
        try {
            // ✅ If appointment_id is provided, fetch doctor_id & client_id automatically
            if (data.appointment_id) {
                const appointment = await Appointment.findOne({
                    where: { id: data.appointment_id },
                    attributes: ["doctor_id", "client_id", "status"],
                });

                if (!appointment) {
                    throw new Error("Appointment not found");
                }

                if (appointment.status === "Cancelled") {
                    throw new Error("Cannot create encounter for a cancelled appointment");
                }

                // Auto-fill doctor_id & client_id
                data.doctor_id = appointment.doctor_id;
                data.client_id = appointment.client_id;
            }

            // ✅ Required field validation (after autofill)
            const requiredFields = [
                "client_id",
                "doctor_id",
                "encounter_date",
                "chief_complaint",
                "history",
                "examination",
                "plan",
            ];

            for (const field of requiredFields) {
                if (!data[field]) {
                    throw new Error(`${field} is required`);
                }
            }

            // ✅ Generate unique encounter number
            const count = await Encounters.count();
            const encounterNo = `ENC-${String(count + 1).padStart(5, "0")}`;

            // ✅ Create encounter
            const encounter = await Encounters.create({
                ...data,
                encounter_no: encounterNo,
                status: data.status || "Open",
                created_by: user?.id || null,
                created_by_name: user?.name || null,
                created_by_email: user?.email || null,
            });

            return encounter;
        } catch (error) {
            console.error("❌ Error creating encounter:", error);
            throw new Error(error.message || "Failed to create encounter");
        }
    },

    /**
     * ✅ Get All Encounters (with filters & pagination)
     */
    async getAll(options = {}) {
        const {
            page = 1,
            limit = 10,
            search = "",
            status,
            start_date,
            end_date,
            doctor_id,
            client_id,
            sort_by = "createdAt",
            sort_order = "DESC",
        } = options;

        const where = {};

        if (doctor_id) where.doctor_id = doctor_id;
        if (client_id) where.client_id = client_id;

        if (start_date && end_date) {
            where.encounter_date = {
                [Op.between]: [new Date(start_date), new Date(end_date)],
            };
        }

        if (status) where.status = status;

        if (search) {
            where[Op.or] = [
                { encounter_no: { [Op.like]: `%${search}%` } },
                { chief_complaint: { [Op.like]: `%${search}%` } },
            ];
        }

        const offset = (page - 1) * limit;

        const { count, rows } = await Encounters.findAndCountAll({
            where,
            include: [
                {
                    model: Client,
                    as: "client",
                    attributes: ["id", "first_name", "last_name", "client_code"],
                },
                {
                    model: Doctor,
                    as: "doctor",
                    attributes: ["id", "doctor_name"],
                },
                {
                    model: Appointment,
                    as: "appointment",
                    attributes: ["id", "appointment_no", "scheduled_at"],
                },
            ],
            limit: Number(limit),
            offset,
            order: [[sort_by, sort_order]],
        });

        return {
            total: count,
            currentPage: page,
            totalPages: Math.ceil(count / limit),
            data: rows,
        };
    },

    /**
     * ✅ Get Encounter by ID
     */
    async getById(id) {
        const encounter = await Encounters.findByPk(id, {
            include: [
                {
                    model: Client,
                    as: "client",
                    attributes: ["id", "first_name", "last_name", "client_code"],
                },
                {
                    model: Doctor,
                    as: "doctor",
                    attributes: ["id", "doctor_name"],
                },
                {
                    model: Appointment,
                    as: "appointment",
                    attributes: ["id", "appointment_no", "scheduled_at"],
                },
            ],
        });

        if (!encounter) {
            throw new Error("Encounter not found");
        }

        return encounter;
    },

    /**
     * ✅ Update Encounter
     */
    async update(id, data, user) {
        const encounter = await Encounters.findByPk(id);

        if (!encounter) {
            throw new Error("Encounter not found");
        }

        await encounter.update({
            ...data,
            updated_by: user?.id || null,
            updated_by_name: user?.name || null,
            updated_by_email: user?.email || null,
        });

        return encounter;
    },

    /**
     * ✅ Delete (Soft Delete) Encounter
     */
    async delete(id, user) {
        const encounter = await Encounters.findByPk(id);

        if (!encounter) {
            throw new Error("Encounter not found");
        }

        await encounter.update({
            status: "Cancelled",
            deleted_by: user?.id || null,
            deleted_by_name: user?.name || null,
            deleted_by_email: user?.email || null,
        });

        return { message: "Encounter deleted successfully" };
    },
};

export default encountersService;
