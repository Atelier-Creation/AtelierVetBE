import EndUsers from "../../../user/models/user.model.js";
import Patients from "./patients.models.js";
import PatientInsurance from "./patientinsurance.models.js";

Patients.belongsTo(EndUsers, { as: "endusers", foreignKey: "user_id" });
PatientInsurance.belongsTo(Patients, { as: "patient", foreignKey: "patient_id" });