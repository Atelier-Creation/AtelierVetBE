import { sequelize } from '../../../db/index.js';
import { DataTypes } from 'sequelize';

const Vitals = sequelize.define('vitals', {
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
    encounter_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: "encounters",
            key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
    },
    measured_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    height: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    weight: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    temperature: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    pulse: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    blood_pressure: {
        type: DataTypes.STRING(50),
        allowNull: true,
    },
    respiratory_rate: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    spo2: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    recorded_by: {
        type: DataTypes.UUID,
        allowNull: true,
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
    tableName: 'vitals',
    timestamps: true,
});

export default Vitals;