// services/dashboard.service.js
import { Op, fn, col } from "sequelize";
import Billing from "../../billing/models/billing.models.js";
import BillingItem from "../../billing/models/billingiteam.models.js";
import Product from "../../product/models/product.model.js";
import User from "../../user/models/user.model.js";
import "../../billing/models/associations.js";

class DashboardService {
  /**
   * Get summary counts for dashboard
   */
  async getSummary() {
    const [totalBills, totalUsers, totalProducts, totalRevenue] = await Promise.all([
      Billing.count(),
      User.count(),
      Product.count(),
      Billing.sum("total_amount"),
    ]);

    return {
      totalBills,
      totalUsers,
      totalProducts,
      totalRevenue: totalRevenue || 0,
    };
  }

  /**
   * Get recent 5 bills with items
   */
  async getRecentBills() {
    const bills = await Billing.findAll({
      limit: 5,
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: BillingItem,
          as: "items", // 👈 use alias from associations.js
          include: [
            {
              model: Product,
              as: "product", // 👈 if you gave alias in association, use it here
            },
          ],
        },
      ],
    });
    return bills;
  }

  /**
   * Get revenue grouped by date (last 7 days)
   */
  async getRevenueByDate() {
    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 7);

    const revenue = await Billing.findAll({
      attributes: [
        [fn("DATE", col("createdAt")), "date"],
        [fn("SUM", col("total_amount")), "totalRevenue"], // 👈 must match your column name
      ],
      where: {
        createdAt: {
          [Op.between]: [sevenDaysAgo, today],
        },
      },
      group: [fn("DATE", col("createdAt"))],
      order: [[fn("DATE", col("createdAt")), "ASC"]],
    });

    return revenue;
  }
}

export default new DashboardService();
