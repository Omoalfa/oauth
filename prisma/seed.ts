import { PrismaClient } from '@prisma/client';
import * as bcrypt from "bcryptjs";

// initialize Prisma Client
const prisma = new PrismaClient();

async function main() {
  // create two dummy articles
  const adminUser = await prisma.users.upsert({
    where: { id: 1 },
    update: {},
    create: {
      email: 'admin@advatyzly.com',
      name: "Admin Admin",
      password: bcrypt.hashSync("password", 10),
      isVerified: true,
      username: "admin",
      type: "EMPLOYEE",
    },
  });

  const baseOrganization = await prisma.organization.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: "Advatyzly",
      email: 'admin@advatyzly.com',
      website: "http://advatyzly.com",
      slug: "platform",
      type: "PLATFORM",
      ownerId: 1
    },
  });

  console.log({ adminUser, baseOrganization });
}

// execute the main function
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // close Prisma Client at the end
    await prisma.$disconnect();
  });