import Users from "../../../user/models/user.model.js";
import LabTestOrders from "./labtestorders.models.js";
import LabTestOrderItems from "./labtestordersiteams.models.js"; // ✅ correct import
import LabTestsMaster from "./labtestsmaster.models.js";
import Client from "../../clients/models/clients.models.js";
import Encounter from "../../clinical/models/encounters.models.js";
import radiologyorders from "./radiologyorders.models.js";
import Doctor from "../../staff/models/doctor.models.js";

// --- Associations ---

// LabTestOrders
LabTestOrders.belongsTo(Client, { as: "client", foreignKey: "client_id" });
LabTestOrders.belongsTo(Encounter, { as: "encounter", foreignKey: "encounter_id" });
LabTestOrders.hasMany(LabTestOrderItems, { as: "items", foreignKey: "order_id" });

// LabTestOrderItems
LabTestOrderItems.belongsTo(LabTestOrders, { as: "order", foreignKey: "order_id" });
LabTestOrderItems.belongsTo(LabTestsMaster, { as: "test", foreignKey: "lab_test_id" });
LabTestOrderItems.belongsTo(Users, { as: "endusers", foreignKey: "resulted_by" });

// LabTestsMaster
LabTestsMaster.hasMany(LabTestOrderItems, { as: "items", foreignKey: "lab_test_id" });

// RadiologyOrders
radiologyorders.belongsTo(Client, { as: "client", foreignKey: "client_id" });
radiologyorders.belongsTo(Encounter, { as: "encounter", foreignKey: "encounter_id" });
radiologyorders.belongsTo(Doctor, { as: "doctor", foreignKey: "ordered_by" });
