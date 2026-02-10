import { sequelize } from '../../../db/index.js';
import { DataTypes } from 'sequelize';

const Room = sequelize.define('rooms', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
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
    room_no: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
    },
    room_type: {
        type: DataTypes.ENUM('ICU', 'Private', 'General'),
        allowNull: false,
    },
    capacity: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    price_per_day: {
        type: DataTypes.DECIMAL(10, 2),
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
        tableName: 'rooms',
        timestamps: true,
        paranoid: true,
    }
);

export default Room;
