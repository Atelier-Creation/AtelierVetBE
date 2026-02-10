import EndUsers from "../../../user/models/user.model.js";
import Clients from "./clients.models.js";
import ClientInsurance from "./clientinsurance.models.js";

Clients.belongsTo(EndUsers, { as: "endusers", foreignKey: "user_id" });
ClientInsurance.belongsTo(Clients, { as: "client", foreignKey: "client_id" });