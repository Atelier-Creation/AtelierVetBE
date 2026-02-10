import { Op } from "sequelize";
import { sequelize } from "../../../db/index.js";
import Encounters from "../models/encounters.models.js";
import Patient from "../../patients/models/patients.models.js";
import Doctor from "../../staff/models/doctor.models.js";
import Appointment from "../../appointments/models/appointments.models.js";
import "../models/index.js";
import { v4 as uuidv4 } from "uuid";

const encountersService = {
    /**
     * ✅ Generate unique encounter number
     */
    async generateEncounterNo() {
        const lastEncounter = await Encounters.findOne({
            order: [["createdAt", "DESC"]],
        });

        let counter = 1;
        if (lastEncounter && lastEncounter.encounter_no) {
            const lastNo = parseInt(lastEncounter.encounter_no.split("-")[1] || "0");
            counter = lastNo + 1;
        }

        return `ENC-${String(counter).padStart(5, "0")}`;
    },

    /**
     * ✅ Create Encounter
     */
    async create(data, user) {
        try {
            // ✅ If appointment_id is provided, fetch doctor_id & patient_id automatically
            if (data.appointment_id) {
                const appointment = await Appointment.findOne({
                    where: { id: data.appointment_id },
                    attributes: ["doctor_id", "patient_id", "status"],
                });

                if (!appointment) {
                    throw new Error("Invalid appointment_id — appointment not found");
                }

                // ✅ Check if appointment status is Pending
                if (appointment.status !== "Pending") {
                    throw new Error(
                        `Cannot create encounter. Appointment is already '${appointment.status}'`
                    );
                }

                // Auto-fill doctor_id & patient_id
                data.doctor_id = appointment.doctor_id;
                data.patient_id = appointment.patient_id;
            }

            // ✅ Required field validation (after autofill)
            const requiredFields = [
                "patient_id",
                "doctor_id",
                "encounter_date",
                "chief_complaint",
                "history",
                "examination",
                "plan",
            ];

            for (const field of requiredFields) {
                if (!data[field]) throw new Error(`${field} is required`);
            }

            // ✅ Generate Encounter No
            const encounter_no = await this.generateEncounterNo();

            // ✅ Create encounter record
            const encounter = await Encounters.create({
                id: uuidv4(),
                encounter_no,
                ...data,
                created_by: user?.id || null,
                created_by_name: user?.username || null,
                created_by_email: user?.email || null,
            });

            // ✅ Update appointment status to Completed
            if (data.appointment_id) {
                await Appointment.update(
                    { status: "Completed" },
                    { where: { id: data.appointment_id } }
                );
            }

            return encounter;
        } catch (error) {
            console.error("❌ Error creating encounter:", error.message);
            throw error;
        }
    },


    async getAll(options = {}) {
        const {
            page = 1,
            limit = 10,
            search = "",
            start_date,
            end_date,
            doctor_id,
            patient_id,
            sort_by = "createdAt",
            sort_order = "DESC",
        } = options;

        const where = {};

        if (doctor_id) where.doctor_id = doctor_id;
        if (patient_id) where.patient_id = patient_id;
        if (start_date && end_date) {
            where.encounter_date = {
                [Op.between]: [new Date(start_date), new Date(end_date)],
            };
        }

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
                    model: Patient,
                    as: "patient",
                    attributes: ["id", "first_name", "last_name", "patient_code"],
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
                    model: Patient,
                    as: "patient",
                    attributes: ["id", "first_name", "last_name", "patient_code"],
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

        if (!encounter) throw new Error("Encounter not found");
        return encounter;
    },

    

    async getEncounterbyadmmisionID(id) {
        const encounter = await Encounters.findOne({
            where: { appointment_id: id },
        });
        return encounter;
    },

    /**
     * ✅ Update Encounter
     */
    async update(id, data, user) {
        const encounter = await Encounters.findByPk(id);
        if (!encounter) throw new Error("Encounter not found");

        await encounter.update({
            ...data,
            updated_by: user?.id || null,
            updated_by_name: user?.username || null,
            updated_by_email: user?.email || null,
        });

        return encounter;
    },

    /**
     * ✅ Delete (Soft Delete or Hard Delete based on flag)
     */
    async delete(id, user, hardDelete = false) {
        const encounter = await Encounters.findByPk(id);
        if (!encounter) throw new Error("Encounter not found");

        if (hardDelete) {
            await encounter.destroy();
            return { message: "Encounter permanently deleted" };
        }

        await encounter.update({
            status: "Cancelled",
            deleted_by: user?.id || null,
            deleted_by_name: user?.username || null,
            deleted_by_email: user?.email || null,
        });

        return { message: "Encounter cancelled successfully" };
    },
};

export default encountersService;
