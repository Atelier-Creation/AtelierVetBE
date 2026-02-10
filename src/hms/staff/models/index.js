import StaffProfiles from "./staffprofiles.models.js";
import Departments from "../../hospital/models/department.models.js";
import Designations from "../../hospital/models/designation.models.js";
import EndUsers from "../../../user/models/user.model.js";
import Doctor from "../models/doctor.models.js";
import Nurses from "./nurses.models.js";
import Receptionists from "./receptionists.models.js";
import Pharmacists from "./pharmacists.models.js";
import LabTechnicians from "./labtechnicians.models.js";
import Accountants from "./accountants.models.js";

// Associations
StaffProfiles.belongsTo(Departments, { foreignKey: "department_id", as: "department" });
StaffProfiles.belongsTo(Designations, { foreignKey: "designation_id", as: "designation" });
StaffProfiles.belongsTo(EndUsers, { foreignKey: "user_id", as: "endusers" });
Doctor.belongsTo(StaffProfiles, { foreignKey: 'staff_profile_id', as: 'staff_profiles' });
Nurses.belongsTo(StaffProfiles, { foreignKey: 'staff_profile_id', as: 'staff_profiles' });
Receptionists.belongsTo(StaffProfiles, { foreignKey: 'staff_profile_id', as: 'staff_profiles' });
Pharmacists.belongsTo(StaffProfiles, { foreignKey: 'staff_profile_id', as: 'staff_profiles' });
LabTechnicians.belongsTo(StaffProfiles, { foreignKey: 'staff_profile_id', as: 'staff_profiles' });
Accountants.belongsTo(StaffProfiles, { foreignKey: 'staff_profile_id', as: 'staff_profiles' });
