// dashboard.service.ts

import { prisma } from "../../lib/prisma";

const getLandlordStats = async (landlordId: string) => {
  // Total Properties
  const totalProperties = await prisma.property.count({
    where: {
      landlordId,
    },
  });

  // Available Properties
  const availableProperties = await prisma.property.count({
    where: {
      landlordId,
      availability: "AVAILABLE",
    },
  });

  // Active Tenants
  const activeTenants = await prisma.rentalRequest.count({
    where: {
      status: "APPROVED",
      property: {
        landlordId,
      },
    },
  });

  // Monthly Revenue
  const currentDate = new Date();

  const firstDay = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1,
  );

  const lastDay = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    1,
  );

  const revenue = await prisma.payment.aggregate({
    _sum: {
      amount: true,
    },
    where: {
      status: "PAID",
      //   createdAt: {
      //     gte: firstDay,
      //     lt: lastDay,
      //   },
      rental_request: {
        property: {
          landlordId,
        },
      },
    },
  });

  const recentRequests = await prisma.rentalRequest.findMany({
    where: {
      property: {
        landlordId,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 5,
    include: {
      tenant: {
        select: {
          name: true,
        },
      },
      property: {
        select: {
          title: true,
        },
      },
    },
  });

  return {
    stats: {
      totalProperties,
      availableProperties,
      activeTenants,
      monthlyRevenue: Number(revenue._sum.amount ?? 0),
    },
    recentRequests,
  };
};

export const DashboardService = {
  getLandlordStats,
};
