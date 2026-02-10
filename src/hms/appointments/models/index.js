import Doctor from "../../staff/models/doctor.models.js";
import DoctorSchedules from "./doctorschedules.models.js";
import Appointments from "./appointments.models.js";
import Patients from "../../patients/models/patients.models.js";

DoctorSchedules.belongsTo(Doctor, { as: "doctor",foreignKey: "doctor_id" });
Appointments.belongsTo(Doctor, { as: "doctor",foreignKey: "doctor_id" });
Appointments.belongsTo(Patients, { as: "patient", foreignKey: "patient_id" });