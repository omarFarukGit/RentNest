import { JwtPayload } from "jsonwebtoken";

import bcrypt from "bcryptjs";
import { ICreateUserInput, IUpdateUser } from "./user.interface.js";
import { prisma } from "../../lib/prisma.js";
import config from "../../config/index.js";
import { UserStatus } from "../../generated/prisma/enums.js";

const registerIntroDB = async (payload: ICreateUserInput) => {
  const { name, email, password, phone, address, role } = payload;

  const userExists = await prisma.user.findUnique({ where: { email } });

  if (userExists) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(
    password,
    Number(config.bcrypt_salt_rounds),
  );

  const createUser = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role,
    },
  });

  const user = await prisma.user.findUnique({
    where: {
      email: createUser.email,
    },
    omit: {
      password: true,
    },
  });
  return user;
};

const getMyProfile = async (payload: JwtPayload) => {
  const { name, email, role, id } = payload;

  const user = await prisma.user.findUnique({
    where: { email, name, role, id },
    omit: { password: true },
  });

  if (!user) {
    throw new Error("User not found");
  }

  if (user.status === "BLOCKED") {
    throw new Error("your account has been bloked. please contact support");
  }

  return user;
};

const updateProfile = async (userId: string, payload: IUpdateUser) => {
  const { name, password, email, phone, address, profileImage } = payload;

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  console.log(user, "user");
  if (!user) {
    throw new Error("user not found");
  }
  if (user.status === UserStatus.BLOCKED) {
    throw new Error("your account has been blocked please contact support");
  }

  const updateUser = await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      name,
      password,
      email: user.email,
      phone,
      address,
      profileImage,
    },
  });

  return updateUser;
};

export const userServices = {
  registerIntroDB,
  getMyProfile,
  updateProfile,
};
