import { Op } from "sequelize";
import LabTestOrders from "../../laboratory/models/labtestorders.models.js";
import Patient from "../../patients/models/patients.models.js";
import Encounter from "../../clinical/models/encounters.models.js";
import LabTestOrderItems from "../../laboratory/models/labtestordersiteams.models.js";
import LabTestsMaster from "../../laboratory/models/labtestsmaster.models.js";

const labDashboardService = {
   
    async getDashboard() {
        try {
            // 1️⃣ Pending & Completed Counts
            const [pendingCount, completedCount] = await Promise.all([
                LabTestOrders.count({ where: { status: "pending", is_active: true } }),
                LabTestOrders.count({ where: { status: "completed", is_active: true } }),
            ]);

            // 2️⃣ Last 5 Recent Orders
            const recentOrders = await LabTestOrders.findAll({
                where: { is_active: true },
                order: [["createdAt", "DESC"]],
                limit: 5,
                include: [
                    { model: Patient, as: "patient" },
                    { model: Encounter, as: "encounter" },
                    {
                        model: LabTestOrderItems,
                        as: "items",
                        include: [{ model: LabTestsMaster, as: "test" }],
                    },
                ],
            });

            return {
                summary: {
                    pending: pendingCount,
                    completed: completedCount,
                },
                recent_orders: recentOrders,
            };
        } catch (error) {
            console.error("❌ Error fetching lab dashboard data:", error);
            throw new Error("Failed to fetch lab dashboard data");
        }
    },
};

export default labDashboardService;
