import labDashboardService from "../service/labdashboard.service.js";

const labDashboardController = {
  
  async getDashboard(req, res) {
    try {
      const data = await labDashboardService.getDashboard();
      return res.sendSuccess(data, "Lab dashboard data fetched successfully");
    } catch (error) {
      console.error("❌ Error fetching lab dashboard:", error);
      return res.sendError(error.message || "Failed to fetch lab dashboard data");
    }
  },
};

export default labDashboardController;
