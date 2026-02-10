import { sequelize } from '../../../db/index.js';
import { DataTypes } from 'sequelize';

const BillingItem = sequelize.define("BillingItem", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  billing_id: { type: DataTypes.UUID, allowNull: false },
  product_id: { type: DataTypes.UUID, allowNull: false },
  quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  unit_price: { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0.0 },
  unit: { type: DataTypes.STRING(20), allowNull: true },
  total_price: { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0.0 },
  discount: { type: DataTypes.DECIMAL(10, 2), allowNull: true, defaultValue: 0.0 },
  tax: { type: DataTypes.DECIMAL(10, 2), allowNull: true, defaultValue: 0.0 },
}, {
  tableName: "billing_items",
  timestamps: true,
});

export default BillingItem;
