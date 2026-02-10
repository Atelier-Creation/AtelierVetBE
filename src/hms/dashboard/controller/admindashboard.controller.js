// src/controller/admindashboard.controller.js
import adminDashboardService from "../service/admindashboard.service.js";

/**
 * Admin Dashboard Controller
 * - GET /admindashboard?month=MM&year=YYYY
 *
 * Returns:
 * {
 *   status: "success",
 *   message: "Admin dashboard data fetched successfully",
 *   data: { summary: {...}, admitted_day_wise: [...], recent_admitted: [...] }
 * }
 */
const adminDashboardController = {
  async getDashboard(req, res) {
    try {
      // Optional query params to get specific month/year (month: 1-12)
      const { month, year } = req.query;

      const dashboardData = await adminDashboardService.getAdminDashboard({
        month: month ? Number(month) : undefined,
        year: year ? Number(year) : undefined,
      });

      // Use helper if available, otherwise fallback to standard json response
      if (typeof res.sendSuccess === "function") {
        return res.sendSuccess(dashboardData, "Admin dashboard data fetched successfully");
      }

      return res.json({
        status: "success",
        message: "Admin dashboard data fetched successfully",
        data: dashboardData,
      });
    } catch (error) {
      console.error("❌ Error in adminDashboardController.getDashboard:", error);

      if (typeof res.sendError === "function") {
        return res.sendError(error.message || "Failed to fetch admin dashboard data");
      }

      return res.status(500).json({
        status: "error",
        message: error.message || "Failed to fetch admin dashboard data",
      });
    }
  },
};

export default adminDashboardController;
