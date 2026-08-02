// dashboard.service.ts

import { prisma } from "../../lib/prisma.js";

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

const getAdminStats = async () => {
  const [
    totalUsers,
    totalProperties,
    rentalRequests,
    activeLandlords,
    recentProperties,
  ] = await Promise.all([
    prisma.user.count(),

    prisma.property.count(),

    prisma.rentalRequest.count({
      where: {
        status: "PENDING",
      },
    }),

    prisma.user.count({
      where: {
        role: "LANDLORD",
        status: "ACTIVE",
      },
    }),

    // Recent Properties
    prisma.property.findMany({
      take: 5,
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        title: true,
        price: true,
        location: true,
        availability: true,
        createdAt: true,

        user: {
          select: {
            name: true,
            email: true,
          },
        },

        category: {
          select: {
            name: true,
          },
        },
      },
    }),
  ]);

  return {
    totalUsers,
    totalProperties,
    rentalRequests,
    activeLandlords,
    recentProperties,
  };
};

const getTenantStats = async (tenantId: string) => {

  const [
    rentalRequests,
    activeRentals,
    totalPayments,
  ] = await Promise.all([


    // Total rental requests
    prisma.rentalRequest.count({
      where: {
        tenantId,
      },
    }),



    // Active rentals
    prisma.rentalRequest.count({
      where: {
        tenantId,
        status: "APPROVED",
      },
    }),



    // Total payments
    prisma.payment.aggregate({
      where: {
        status: "PAID",

        rental_request: {
          tenantId,
        },
      },

      _sum: {
        amount: true,
      },
    }),


  ]);


  return {
    rentalRequests,
    activeRentals,
    totalPayments: totalPayments._sum.amount || 0,
  };
};

export const dashboardService = {
  getLandlordStats,
  getAdminStats,
  getTenantStats,
};
