import { sequelize } from "../../../db/index.js";
import { DataTypes } from "sequelize";

const ClientInsurance = sequelize.define(
    "ClientInsurance",
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        client_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: "clients",
                key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "CASCADE",
        },
        provider_name: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        policy_number: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        coverage_details: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        valid_from:{
            type: DataTypes.DATE,
            allowNull: false,
        },
        valid_to:{
            type: DataTypes.DATE,
            allowNull: false,
        },
        is_primary: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false,
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
        tableName: "client_insurance",
        timestamps: true,
    }
);

export default ClientInsurance;