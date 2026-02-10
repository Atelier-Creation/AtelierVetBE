import { sequelize } from '../../../db/index.js';
import { DataTypes } from 'sequelize';

const RadiologyOrders = sequelize.define('radiologyorders', {
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
    order_no: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
    },
    test_name: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    test_date: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    ordered_by: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: "doctors",
            key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
    },
    status: {
        type: DataTypes.ENUM('pending', 'completed', 'cancelled'),
        allowNull: false,
        defaultValue: 'pending',
    },

    report_file_url: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    priority: {
        type: DataTypes.ENUM('normal', 'urgent'),
        allowNull: false,
        defaultValue: 'normal',
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
    tableName: 'radiology_orders',
    timestamps: true,
    paranoid: true,
});
export default RadiologyOrders
