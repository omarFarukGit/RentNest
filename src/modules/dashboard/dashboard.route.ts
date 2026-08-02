import { Router } from "express";
import { Roles } from "../../generated/prisma/enums.js";
import { auth } from "../../middleware/auth.js";
import { dashboardController } from "./dashboard.controller.js";

const router = Router();

router.get(
  "/landlord/stats",
  auth(Roles.LANDLORD),
  dashboardController.getLandlordStats,
);
router.get(
  "/admin/stats",
  auth(Roles.ADMIN),
  dashboardController.getAdminStats,
);
router.get(
  "/tenant-stats",
  auth(Roles.TENANT),
  dashboardController.getTenantStats,
);

export const dashboardRoutes = router;
