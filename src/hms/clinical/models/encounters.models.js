import { sequelize } from '../../../db/index.js';
import { DataTypes } from 'sequelize';

const Encounters = sequelize.define('encounters', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    encounter_no: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
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
    encounter_date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    doctor_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: "doctors",
            key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
    },
    appointment_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: "appointments",
            key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
    },
    chief_complaint: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    history: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    examination: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    plan: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM("Open", "Closed", "Cancelled"),
        defaultValue: "Open",
        allowNull: false,
    },
    created_by: {
        type: DataTypes.UUID,
        allowNull: true,
    },
    updated_by: {
        type: DataTypes.UUID,
        allowNull: true,
    },
    deleted_by: {
        type: DataTypes.UUID,
        allowNull: true,
    },
    created_by_name: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    updated_by_name: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    deleted_by_name: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    created_by_email: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    updated_by_email: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    deleted_by_email: {
        type: DataTypes.STRING,
        allowNull: true,
    },
}, {
    tableName: "encounters",
    timestamps: true,
});

export default Encounters;
