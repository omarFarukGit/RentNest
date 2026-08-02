import { Router } from "express";
import { Roles } from "../../generated/prisma/enums";
import { auth } from "../../middleware/auth";
import { DashboardController } from "./dashboard.controller";

const router = Router();

router.get(
  "/landlord/stats",
  auth(Roles.LANDLORD),
  DashboardController.getLandlordStats,
);

export const DashboardRoutes = router;
