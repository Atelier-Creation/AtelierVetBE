// controllers/dashboard.controller.js
import dashboardService from "../service/dashboard.service.js";

export const getDashboardSummary = async (req, res) => {
  try {
    const summary = await dashboardService.getSummary();
    res.json(summary);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getRecentBills = async (req, res) => {
  try {
    const bills = await dashboardService.getRecentBills();
    res.json(bills);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getRevenueByDate = async (req, res) => {
  try {
    const revenue = await dashboardService.getRevenueByDate();
    res.json(revenue);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
