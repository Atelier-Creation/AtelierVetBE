import Patients from "../../patients/models/patients.models.js";
import Doctor from "../../staff/models/doctor.models.js";
import Appointments from "../../appointments/models/appointments.models.js";
import Encounters from "./encounters.models.js";
import Vitals from "./vitals.models.js";
import Diagnnoses from "./diagnoses.models.js";
import ClinicalNotes from "./clinicalnotes.models.js";

Encounters.belongsTo(Patients, { as: "patient", foreignKey: "patient_id" });
Encounters.belongsTo(Doctor, { as: "doctor", foreignKey: "doctor_id" });
Encounters.belongsTo(Appointments, { as: "appointment", foreignKey: "appointment_id" });

Vitals.belongsTo(Encounters, { as: "encounter", foreignKey: "encounter_id" });
Vitals.belongsTo(Patients, { as: "patient", foreignKey: "patient_id" });

Diagnnoses.belongsTo(Encounters, { as: "encounter", foreignKey: "encounter_id" });

ClinicalNotes.belongsTo(Encounters, { as: "encounter", foreignKey: "encounter_id" });