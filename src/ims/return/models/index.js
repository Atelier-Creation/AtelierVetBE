import Return from './return.models.js';
import ReturnItem from './returniteams.models.js';
import Product from '../../product/models/product.model.js';
import Vendor from '../../vendor/models/vendor.models.js';

// 🔗 One-to-Many: Return -> ReturnItem
Return.hasMany(ReturnItem, {
  foreignKey: "return_id",
  as: "items",
  onUpdate: "CASCADE",
  onDelete: "CASCADE",
});

ReturnItem.belongsTo(Return, {
  foreignKey: "return_id",
  as: "return",
  onUpdate: "CASCADE",
  onDelete: "CASCADE",
});

// 🔗 Product relation: Product -> ReturnItem
Product.hasMany(ReturnItem, {
  foreignKey: "product_id",
  as: "returnItems",
});

ReturnItem.belongsTo(Product, {
  foreignKey: "product_id",
  as: "product",
});

// 🔗 Vendor relation: Vendor -> Return
Vendor.hasMany(Return, {
  foreignKey: "vendor_id",
  as: "returns",
});

Return.belongsTo(Vendor, {
  foreignKey: "vendor_id",
  as: "vendor",
  onUpdate: "CASCADE",
  onDelete: "SET NULL", // optional: keep return even if vendor is deleted
});

export { Return, ReturnItem, Vendor, Product };
