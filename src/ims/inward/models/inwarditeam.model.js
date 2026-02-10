import { sequelize } from '../../../db/index.js';
import { DataTypes } from 'sequelize';
import Inward from '../models/inward.model.js';
import Product from '../../product/models/product.model.js'; // ✅ import product model

const InwardItem = sequelize.define(
  "InwardItem",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    inward_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Inward, 
        key: "id",
      },
    },
    product_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Product, 
        key: "id",
      },
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    unused_quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    return_quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    billing_quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    excess_quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    unit_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.0,
    },
    unit: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    total_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.0,
    },
    expiry_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    batch_number: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
  },
  {
    tableName: "inward_items",
    timestamps: true,
  }
);

// ✅ Associations
Inward.hasMany(InwardItem, { foreignKey: "inward_id", as: "items" });
InwardItem.belongsTo(Inward, { foreignKey: "inward_id", as: "inward" });

Product.hasMany(InwardItem, { foreignKey: "product_id", as: "inwardItems" });
InwardItem.belongsTo(Product, { foreignKey: "product_id", as: "product" });

export default InwardItem;
