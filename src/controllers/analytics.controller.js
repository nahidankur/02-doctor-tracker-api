import { AnalyticsService } from "../services/analytics.service.js";
import { ApiResponse } from "../utils/apiResponse.js";
import messages from "../utils/message.json" with { type: "json" };

export class AnalyticsController {
  static async getDashboard(req, res, next) {
    try {
      const data = await AnalyticsService.getDashboardMetrics();
      return ApiResponse.success(res, data, messages.analytics.dashboardSuccess);
    } catch (error) {
      next(error);
    }
  }
}
