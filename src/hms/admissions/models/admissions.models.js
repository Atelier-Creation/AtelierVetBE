import { sequelize } from '../../../db/index.js';
import { DataTypes } from 'sequelize';

const Addmissions = sequelize.define('admissions', {
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
    admission_date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    admitted_by: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: "endusers",
            key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
    },
    reason: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    ward_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: "wards",
            key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
    },
    room_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: "rooms",
            key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
    },
    bed_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: "beds",
            key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
    },
    discharge_datetime: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    discharge_by: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: "endusers",
            key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
    },
    discharge_reason: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    final_diagnosis: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    status: {
        type: DataTypes.ENUM('admitted', 'discharged', 'transferred','test'),
        allowNull: false,
        defaultValue: 'admitted',
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
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
    tableName: 'admissions',
    timestamps: true,
});

export default Addmissions;
