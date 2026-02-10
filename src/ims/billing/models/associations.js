// src/billing/models/associations.js
import Billing from "./billing.models.js";
import BillingItem from "./billingiteam.models.js";
import Product from "../../product/models/product.model.js";

// Billing ↔ BillingItem
Billing.hasMany(BillingItem, {
  foreignKey: "billing_id",
  as: "items", // 👈 must match service
});
BillingItem.belongsTo(Billing, {
  foreignKey: "billing_id",
  as: "billing", // 👈 reference back
});

// Product ↔ BillingItem
Product.hasMany(BillingItem, {
  foreignKey: "product_id",
  as: "billingItems", // 👈 plural
});
BillingItem.belongsTo(Product, {
  foreignKey: "product_id",
  as: "product", // 👈 must match service
});

console.log("✅ Associations applied: Billing ↔ BillingItem ↔ Product");
