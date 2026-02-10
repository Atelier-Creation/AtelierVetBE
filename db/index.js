import { sequelize } from "../src/db/index.js";
import Department from "../src/hms/hospital/models/department.models.js";
import '../src/hms/staff/models/index.js'
import '../src/hms/laboratory/models/index.js'
import "../src/ims/order/models/orderiteam.models.js";
import "../src/ims/order/models/order.models.js";
import "../src/ims/vendor/models/vendor.models.js";
import "../src/ims/product/models/product.model.js";


async function syncDatabase() {
  try {
    await sequelize.sync({ alter: true });
    console.log("Database synchronized successfully");
  } catch (err) {
    console.error("Error syncing database:", err.message);
    throw err
  }
}

syncDatabase().then((data) => console.log("synced")).catch((err)=> console.error("error"));


// import { sequelize } from "../src/db/index.js";
// import User from "../src/user/models/user.model.js";
// import Role from "../src/user/models/role.model.js";

// async function syncDatabase() {
//   try {
//     await sequelize.sync({ alter: true });
//     console.log("Database synchronized successfully");
//   } catch (err) {
//     console.error("Error syncing database:", err.message);
//     throw err;
//   }
// }

// syncDatabase()
//   .then(() => console.log("synced"))
//   .catch((err) => console.error("error", err));
