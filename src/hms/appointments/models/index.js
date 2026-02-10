import Doctor from "../../staff/models/doctor.models.js";
import DoctorSchedules from "./doctorschedules.models.js";
import Appointments from "./appointments.models.js";
import Clients from "../../clients/models/clients.models.js";

DoctorSchedules.belongsTo(Doctor, { as: "doctor",foreignKey: "doctor_id" });
Appointments.belongsTo(Doctor, { as: "doctor",foreignKey: "doctor_id" });
Appointments.belongsTo(Clients, { as: "client", foreignKey: "client_id" });
