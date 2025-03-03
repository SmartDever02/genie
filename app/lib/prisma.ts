import { PrismaClient } from "@prisma/client";

let prisma;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  // @ts-ignore glogbal
  if (!global.prisma) {
    // @ts-ignore glogbal
    global.prisma = new PrismaClient();
  }
  // @ts-ignore glogbal
  prisma = global.prisma;
}

export default prisma;
