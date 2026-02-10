import Wards from "./wards.models.js";
import Rooms from "./rooms.models.js";
import Beds from "./beds.models.js";
import Admissions from "./admissions.models.js";
import Patients from "../../patients/models/patients.models.js";
import User from "../../../user/models/user.model.js";
import Bedtransfers from "./bedtransfers.models.js"; 

// 🏥 Relationships
Rooms.belongsTo(Wards, { as: "ward", foreignKey: "ward_id" });
Beds.belongsTo(Rooms, { as: "room", foreignKey: "room_id" });

Admissions.belongsTo(Wards, { as: "ward", foreignKey: "ward_id" });
Admissions.belongsTo(Rooms, { as: "room", foreignKey: "room_id" });
Admissions.belongsTo(Beds, { as: "bed", foreignKey: "bed_id" });
Admissions.belongsTo(Patients, { as: "patient", foreignKey: "patient_id" });

// 👤 Two different user relations
Admissions.belongsTo(User, { as: "admittedBy", foreignKey: "admitted_by" });
Admissions.belongsTo(User, { as: "dischargedBy", foreignKey: "discharge_by" });


Bedtransfers.belongsTo(Admissions, { as: "admission", foreignKey: "admission_id" });
Bedtransfers.belongsTo(Beds, { as: "fromBed", foreignKey: "from_bed_id" });
Bedtransfers.belongsTo(Beds, { as: "toBed", foreignKey: "to_bed_id" });
