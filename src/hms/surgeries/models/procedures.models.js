import { sequelize } from '../../../db/index.js';
import { DataTypes } from 'sequelize';

const Procedures = sequelize.define(
    "Procedures",
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true,
        },
        procedure_code: {
            type: DataTypes.STRING(10),
            allowNull: false,
            unique: true,
        },
        description: {
            type: DataTypes.STRING(250),
            allowNull: false,
        },
        risk_level:{
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        base_charge:{
            type: DataTypes.FLOAT,
            allowNull: false,
            min: 0,   
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
        timestamps: true,
        paranoid: true,
    }
);

export default Procedures;
