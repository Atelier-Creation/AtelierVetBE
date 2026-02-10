import { sequelize } from '../../../db/index.js';
import { DataTypes } from 'sequelize';
import Order from '../../order/models/order.models.js';
import Vendor from '../../vendor/models/vendor.models.js';

const Inward = sequelize.define("Inward", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    order_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: Order,
            key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
    },
    inward_no: {
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
    received_date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    supplier_invoice: {
        type: DataTypes.STRING(100),
        allowNull: true,
    },
    total_amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    total_quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    total_unused_quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    total_excess_quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    total_return_quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    total_billing_quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    status: {
        type: DataTypes.ENUM('pending', 'completed', 'cancelled'),
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
    tableName: "inward",
    timestamps: true,
  });

  // ✅ Define Associations (Foreign Keys)
Inward.belongsTo(Order, {
  foreignKey: "order_id",
  as: "order",
  onUpdate: "CASCADE",
  onDelete: "SET NULL",
});

Inward.belongsTo(Vendor, {
  foreignKey: "vendor_id",
  as: "vendor",
  onUpdate: "CASCADE",
  onDelete: "RESTRICT",
});

// (Optional) if you want reverse relations:
Order.hasMany(Inward, {
  foreignKey: "order_id",
  as: "inwards",
});


export default Inward;
