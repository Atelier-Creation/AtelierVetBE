import { sequelize } from "../../../db/index.js";
import { DataTypes } from "sequelize";

const Pet = sequelize.define(
    "Pet",
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false,
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
        pet_type: {
            type: DataTypes.ENUM('Dog', 'Cat', 'Bird', 'Rabbit', 'Other'),
            allowNull: false,
        },
        pet_color: {
            type: DataTypes.STRING(50),
            allowNull: true,
        },
        dob : {
            type: DataTypes.DATE,
            allowNull: false,
        },
        age : {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        weight : {
            type: DataTypes.FLOAT,
            allowNull: true,
        },
        breed : {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        gender : {
            type: DataTypes.ENUM('Male', 'Female'),
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
        tableName: "pets",
         timestamps: true,
    }
);

export default Pet;

