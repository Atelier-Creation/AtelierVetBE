import { sequelize } from '../../../db/index.js';
import { DataTypes } from 'sequelize';

const Appointments = sequelize.define(
    "Appointments",
    {
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
        pet_id: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: "pets",
                key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "CASCADE",
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
        appointment_no: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true
        },
        scheduled_at: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        scheduled_time: {
            type: DataTypes.TIME,
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM('Pending', 'Confirmed', 'Cancelled', 'Completed'),
            allowNull: false,
            defaultValue: 'Pending',
        },
        visit_type:{
            type: DataTypes.ENUM('OPD', 'teleconsult', 'emergency'),
            allowNull: false,
        },
        reason: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        notes: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        source: {
            type: DataTypes.ENUM('Online', 'phone' , 'Offline'),
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
    },
    {
        tableName: "appointments",
        timestamps: true,
    }
);

export default Appointments;
