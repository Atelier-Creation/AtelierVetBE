import { sequelize } from '../../db/index.js';
import { DataTypes } from 'sequelize';
import Vendor from '../../vendor/models/vendor.models.js';
import Billing from '../../billing/models/billing.models.js';


const Return = sequelize.define(
  "Return",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    return_no: {
      type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
    },
    reason: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    total_amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.0,
    },
    total_quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: { min: 0 },
    },
    total_tax: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: 0.0,
    },
    status: {
        type: DataTypes.ENUM('pending', 'processed', 'cancelled'),
        defaultValue: 'pending',
        allowNull: false,
    },
    return_date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    return_type: {
        type: DataTypes.ENUM('customer', 'partial'),
        allowNull: false,
        defaultValue: 'partial',
    },
    billing_id: {
        type: DataTypes.UUID,
        allowNull: true,
        defaultValue: null,
        references: {
            model: Billing,
            key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
    },
    vendor_id: {
      type: DataTypes.UUID,
      allowNull: false,
        references: {   
        model: Vendor,
        key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
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
    tableName: "returns",
    timestamps: true,
  }
);




export default Return;