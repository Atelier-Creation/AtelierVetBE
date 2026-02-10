import { sequelize } from '../../db/index.js';
import { DataTypes } from 'sequelize';
import Return from './return.models.js';
import Product from '../../product/models/product.model.js';
import Inward from '../../inward/models/inward.model.js';

const ReturnItem = sequelize.define(
  "ReturnItem",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    // 🔗 Foreign Key: Return
    return_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Return,
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },

    // 🔗 Foreign Key: Product
    product_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Product,
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
    },

    // ✅ Multiple Inward IDs (JSON)
    inward_ids: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
      comment: "Stores multiple inward IDs as array of UUIDs",
    },

    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: { min: 0 },
    },

    unit_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.0,
      validate: { min: 0.0 },
    },

    tax_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: 0.0,
      validate: { min: 0.0 },
    },

    total_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.0,
      validate: { min: 0.0 },
    },

    reason: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: null,
    },

    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: "return_item",
    timestamps: true,
  }
);


export default ReturnItem;
