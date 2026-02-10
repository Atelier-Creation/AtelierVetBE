import { sequelize } from "../../../db/index.js";
import { DataTypes } from "sequelize";

const Accountants = sequelize.define(
    "Accountants",
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        accountant_name: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        accountant_email: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        accountant_phone: {
            type: DataTypes.STRING(15),
            allowNull: true,
        },
        staff_profile_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: "staff_profiles",
                key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "CASCADE",
        },
        ledger_code: {
            type: DataTypes.STRING(100),
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
        timestamps: true,
        tableName: "accountants",
    }
);
export default Accountants;