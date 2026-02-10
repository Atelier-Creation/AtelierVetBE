import { sequelize } from "../../../db/index.js";
import { DataTypes } from "sequelize";

const Receptionists = sequelize.define(
    "Receptionists",
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        receptionist_name: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        receptionist_email: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        receptionist_phone: {
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
        counter_no: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        shift: {
            type: DataTypes.STRING(100),
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
        tableName: "receptionists",
        timestamps: true,
    }
);
export default Receptionists;
