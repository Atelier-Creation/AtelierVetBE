import { sequelize } from '../../../db/index.js';
import { DataTypes } from 'sequelize';

const LabTestOrderItems = sequelize.define('labtestorderitems', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  order_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: "labtestorders",
      key: "id",
    },
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  },
  lab_test_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: "lab_tests_master",
      key: "id",
    },
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  },
  sample_type: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  collected_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  result_value: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  result_file_url: {
    type: DataTypes.STRING(512),
    allowNull: true,
  },
  resulted_by: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: "endusers",
      key: "id",
    },
    onUpdate: "CASCADE",
    onDelete: "SET NULL",
  },
  resulted_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: 'lab_test_order_items',
  timestamps: true,
  paranoid: true,
});

export default LabTestOrderItems;
