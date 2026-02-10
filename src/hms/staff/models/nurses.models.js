import { sequelize } from "../../../db/index.js";
import { DataTypes } from "sequelize";

const Nurses = sequelize.define(
    "Nurses", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    nurse_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    nurse_email: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    nurse_phone: {
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
    shift: {
        type: DataTypes.STRING(100),
        allowNull: true,
    },
    license_no: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    skills: {
        type: DataTypes.JSON,
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
        tableName: "nurses",
        timestamps: true
    }
)
export default Nurses;