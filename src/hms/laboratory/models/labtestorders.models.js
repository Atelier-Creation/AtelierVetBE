import { sequelize } from '../../../db/index.js';
import { DataTypes } from 'sequelize';

const LabTestOrders = sequelize.define('labtestorders', {
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
    order_date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    status: {
        type: DataTypes.ENUM('pending', 'collected', 'processed', 'completed'),
        allowNull: false,
        defaultValue: 'pending',
    },
    priority: {
        type: DataTypes.ENUM('normal', 'urgent'),
        allowNull: false,
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
},
    {
        tableName: 'labtestorders',
        timestamps: true,
    }
);

export default LabTestOrders;