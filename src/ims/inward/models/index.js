import Inward from "./inward.model.js";
import InwardItem from "./inwarditeam.model.js";

Inward.hasMany(InwardItem, {
  foreignKey: "inward_id",
  as: "items",
  onDelete: "CASCADE",
});

InwardItem.belongsTo(Inward, {
  foreignKey: "inward_id",
  as: "inward",
});
