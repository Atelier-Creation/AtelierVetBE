import { sequelize } from '../../../db/index.js';
import { DataTypes } from 'sequelize';
import Vendor from '../../vendor/models/vendor.models.js'; 

const Order = sequelize.define(
  "Order",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    po_no: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
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
    order_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
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
    total_penning_quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: { min: 0 },
    },
    tax_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: 0.0,
    },
    status: {
      type: DataTypes.ENUM('pending', 'completed', 'cancelled', 'approved'),
      defaultValue: 'pending',
      allowNull: false,
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
    tableName: "orders",
    timestamps: true,
  }
);

// ✅ Associations
Order.belongsTo(Vendor, {
  foreignKey: 'vendor_id',
  as: 'vendor',
  onUpdate: 'CASCADE',
  onDelete: 'RESTRICT',
});

Vendor.hasMany(Order, {
  foreignKey: 'vendor_id',
  as: 'orders',
  onUpdate: 'CASCADE',
  onDelete: 'RESTRICT',
});

export default Order;
