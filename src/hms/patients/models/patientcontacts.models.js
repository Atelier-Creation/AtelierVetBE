import { sequelize } from "../../../db/index.js";
import { DataTypes } from "sequelize";

const PatientsContacts = sequelize.define(
    "PatientsContacts",
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        patient_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: "patients",
                key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "CASCADE",
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        phone: {
            type: DataTypes.STRING(15),
            allowNull: false,
        },
        relationship: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        address: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
            allowNull: false,
        },
        created_by: { type: DataTypes.UUID, allowNull: true },
        updated_by: { type: DataTypes.UUID, allowNull: true },
        deleted_by: { type: DataTypes.UUID, allowNull: true },

        created_by_name: { type: DataTypes.STRING, allowNull: true },
        updated_by_name: { type: DataTypes.STRING, allowNull: true },
        deleted_by_name: { type: DataTypes.STRING, allowNull: true },

        created_by_email: { type: DataTypes.STRING, allowNull: true },
        updated_by_email: { type: DataTypes.STRING, allowNull: true },
        deleted_by_email: { type: DataTypes.STRING, allowNull: true },
    },
    {
        tableName: "patient_contacts",
        timestamps: true,
    }
);
export default PatientsContacts;