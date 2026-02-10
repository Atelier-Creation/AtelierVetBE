import reportService from "../service/report.service.js";
import path from "path";

const reportController = {
  async getUserReport(req, res) {
    try {
      const result = await reportService.getUserReport(req.query);

      if (result.filePath) {
        return res.download(path.resolve(result.filePath));
      }

      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  },

  async getBillingReport(req, res) {
    try {
      const result = await reportService.getBillingReport(req.query);

      // if file download requested
      if (result.filePath) {
        return res.download(path.resolve(result.filePath));
      }

      res.json(result);
    } catch (error) {
      console.error("❌ Error generating billing report:", error);
      res.status(500).json({ error: error.message });
    }
  },
};

export default reportController;
