import { sequelize } from '../../../db/index.js';
import { DataTypes } from 'sequelize';

const Surgeries = sequelize.define('surgeries', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    admission_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'admissions',
            key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    },
    procedure_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'procedures',
            key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    },
    surgeon_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'doctors',
            key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    },
    surgeon_assistant_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: 'doctors',
            key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    },
    scheduled_at: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    anesthesia_type: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('pending', 'scheduled', 'completed', 'cancelled'),
        allowNull: false,
        defaultValue: 'pending',
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true,
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
        tableName: 'surgeries',
        timestamps: true,
    }

);

export default Surgeries;
