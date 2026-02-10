import { sequelize } from '../../../db/index.js';
import { DataTypes } from 'sequelize';

const Product = sequelize.define("Product", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    product_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    product_code: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
    },
    category_id: {
        type: DataTypes.UUID,
        allowNull: true,
    },
    sub_category_id: {
        type: DataTypes.UUID,
        allowNull: true,
    },
    brand: {
        type: DataTypes.STRING(50),
        allowNull: true,
    },
    unit: {
        type: DataTypes.STRING(20),
        allowNull: true,
    },
    purchase_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00,
    },
    selling_price: {    
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: 0.00,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    tax_percentage: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
        defaultValue: 0.00,
    },
    min_quantity: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
    },
    max_quantity: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
    },
    status: {
        type: DataTypes.ENUM('active', 'inactive'),
        defaultValue: 'active',
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
    tableName: "products",
    timestamps: true,
  });


export default Product;