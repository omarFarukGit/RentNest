// dashboard.controller.ts

import { Request, Response } from "express";
import { sendResponse } from "../../utils/sendResponse";
import { DashboardService } from "./dashboard.service";
import { catchAsync } from "../../utils/catchAsync";

const getLandlordStats = catchAsync(async (req: Request, res: Response) => {
  const landlordId = req?.user?.id as string;

  const result = await DashboardService.getLandlordStats(landlordId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Dashboard stats retrieved successfully",
    data: result,
  });
});

export const DashboardController = {
  getLandlordStats,
};
