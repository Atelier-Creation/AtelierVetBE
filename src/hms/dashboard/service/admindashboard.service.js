import { sequelize } from "../../../db/index.js";
import { Op, QueryTypes } from "sequelize";
import Billing from "../../../ims/billing/models/billing.models.js";
import Appointments from "../../appointments/models/appointments.models.js";
import Doctor from "../../staff/models/doctor.models.js";
import Client from "../../clients/models/clients.models.js";
import LabTestsMaster from "../../laboratory/models/labtestsmaster.models.js";
import LabTestOrderItems from "../../laboratory/models/labtestordersiteams.models.js";
import Addmissions from "../../admissions/models/admissions.models.js";

const adminDashboardService = {
    async getAdminDashboard({ month = null, year = null } = {}) {
        try {
            const now = new Date();
            const useYear = Number(year ?? now.getFullYear());
            const useMonth = Number(month ?? now.getMonth() + 1);

            const monthStart = new Date(useYear, useMonth - 1, 1, 0, 0, 0);
            const monthEnd = new Date(useYear, useMonth, 0, 23, 59, 59, 999);

            // ---------- 1) Pharmacy Revenue ----------
            const pharmacyRevenue = Number(
                (await Billing.sum("total_amount", {
                    where: { status: "paid" },
                })) || 0
            );

            // ---------- 2) Doctor Revenue ----------
            const doctorRevenueRes = await sequelize.query(
                `
        SELECT COALESCE(SUM(d.consultation_fee), 0) AS doctorRevenue
        FROM appointments a
        JOIN doctors d ON a.doctor_id = d.id
        WHERE a.status = 'Completed'
        `,
                { type: QueryTypes.SELECT }
            );
            const doctorRevenue = Number(doctorRevenueRes?.[0]?.doctorRevenue || 0);

            // ---------- 3) Lab Revenue ----------
            const labRevenueRes = await sequelize.query(
                `
        SELECT COALESCE(SUM(lm.amount), 0) AS labRevenue
        FROM lab_test_order_items li
        JOIN lab_tests_master lm ON li.lab_test_id = lm.id
        `,
                { type: QueryTypes.SELECT }
            );
            const labRevenue = Number(labRevenueRes?.[0]?.labRevenue || 0);

            // ---------- 4) Total Revenue ----------
            const totalRevenue = doctorRevenue + labRevenue + pharmacyRevenue;

            // ---------- 5) Admitted Clients Day-wise (From admissions table) ----------
            const admittedDayWiseRes = await sequelize.query(
                `
  WITH RECURSIVE date_series AS (
    SELECT :start AS day
    UNION ALL
    SELECT DATE_ADD(day, INTERVAL 1 DAY)
    FROM date_series
    WHERE day < :end
  )
  SELECT 
    ds.day,
    COALESCE(COUNT(a.id), 0) AS count
  FROM date_series ds
  LEFT JOIN ${Addmissions.tableName} a 
    ON DATE(a.admission_date) = ds.day
  GROUP BY ds.day
  ORDER BY ds.day ASC
  `,
                {
                    type: QueryTypes.SELECT,
                    replacements: { start: monthStart, end: monthEnd },
                }
            );

            const admittedDayWise = admittedDayWiseRes.map((r) => ({
                date: r.day,
                count: Number(r.count),
            }));
            // ---------- 6) Recent Admitted Clients (From admissions table) ----------
            const recentAdmitted = await Addmissions.findAll({
                where: {
                    [Op.and]: [
                        sequelize.where(sequelize.fn("LOWER", sequelize.col("status")), {
                            [Op.in]: [
                                "admitted",
                                "inClient",
                                "admitted - in ward",
                                "discharged",
                                "transferred",
                            ],
                        }),
                    ],
                },
                include: [{ model: Client, as: "client" }],
                order: [["admission_date", "DESC"]],
                limit: 5,
            });

            // ---------- Return structured data ----------
            return {
                summary: {
                    total_revenue: totalRevenue,
                    doctor_revenue: doctorRevenue,
                    lab_revenue: labRevenue,
                    pharmacy_revenue: pharmacyRevenue,
                },
                admitted_day_wise: admittedDayWise,
                recent_admitted: recentAdmitted,
            };
        } catch (error) {
            console.error("❌ Error in admin dashboard service:", error);
            throw new Error("Failed to fetch admin dashboard data");
        }
    },
};

export default adminDashboardService;
