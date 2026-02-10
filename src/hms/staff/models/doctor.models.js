import { sequelize } from "../../../db/index.js";
import { DataTypes } from "sequelize";

const Doctor = sequelize.define(
  "Doctor",{
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    doctor_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    doctor_email: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    doctor_phone: {
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
    specialties:{
      type: DataTypes.JSON,
      allowNull: false,
    },
    consultation_fee:{
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    available_online : {
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
    tableName: "doctors",
    timestamps: true
  }
);
export default Doctor;


