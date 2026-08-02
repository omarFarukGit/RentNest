import { Router } from "express";
import { Roles } from "../../generated/prisma/enums.js";
import { auth } from "../../middleware/auth.js";
import { DashboardController } from "./dashboard.controller.js";


const router = Router();

router.get(
  "/landlord/stats",
  auth(Roles.LANDLORD),
  DashboardController.getLandlordStats,
);

export const dashboardRoutes = router;
