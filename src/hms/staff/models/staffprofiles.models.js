import { sequelize } from "../../../db/index.js";
import { DataTypes } from "sequelize";

const StaffProfiles = sequelize.define(
  "StaffProfiles",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "endusers", 
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },

    first_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },

    department_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: "departments", 
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    },

    designation_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: "designations",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    },

    employee_code: {
      type: DataTypes.STRING(10),
      allowNull: false,
      unique: true,
    },

    date_of_joining: {
      type: DataTypes.DATE,
      allowNull: false,
    },

    qualification: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },

    gender: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },

    dob: {
      type: DataTypes.DATE,
      allowNull: false,
    },

    address: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },

    emergency_contact: {
      type: DataTypes.JSON,
      allowNull: false,
      // Example:
      // { name: "John Doe", phone: "9876543210", relation: "Brother" }
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
    tableName: "staff_profiles",
    timestamps: true, 
  }
);

export default StaffProfiles;
