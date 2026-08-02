// dashboard.controller.ts

import { Request, Response } from "express";
import { sendResponse } from "../../utils/sendResponse.js";
import { dashboardService } from "./dashboard.service.js";
import { catchAsync } from "../../utils/catchAsync.js";

const getLandlordStats = catchAsync(async (req: Request, res: Response) => {
  const landlordId = req?.user?.id as string;

  const result = await dashboardService.getLandlordStats(landlordId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Dashboard stats retrieved successfully",
    data: result,
  });
});

const getAdminStats = catchAsync(async (req, res) => {

  const result = await dashboardService.getAdminStats();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Admin stats fetched successfully",
    data: result,
  });

});

export const dashboardController = {
  getLandlordStats,
  getAdminStats
};
