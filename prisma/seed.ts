import { PrismaClient, User } from "@prisma/client";
import bcrypt from "bcrypt";
import { fakerJA as faker } from "@faker-js/faker";

// https://www.prisma.io/docs/orm/prisma-migrate/workflows/seeding

const prisma = new PrismaClient();

function getRandomDate(daysAgo: number) {
  const today = new Date();
  const pastDate = new Date(
    today.getTime() - Math.random() * daysAgo * 24 * 60 * 60 * 1000
  );
  return pastDate;
}

async function main() {

  const hashedPassword = await bcrypt.hash("password1234", 10);
  const mainUserEmail = "main-user@example.com";
  try {
    await resetData();
  
    await prisma.user.deleteMany();

    const mainUser = await prisma.user.create({
      data: {
        name: "main-user",
        email: mainUserEmail,
        password: hashedPassword,
      },
    });
    await createBlogs({ user: mainUser });

    for (let i = 1; i <= 5; i++) {
      const subUser = await prisma.user.create({
        data: {
          name: faker.person.fullName(),
          email: faker.internet.email(),
          password: hashedPassword,
        },
      });
      await createBlogs({ user: subUser });
    }
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect;
  }
}

async function createBlogs({ user }: { user: User }) {
  for (let i = 1; i <= 10; i++) {
    const date = getRandomDate(30);
    await prisma.blog.create({
      data: {
        title: faker.lorem.lines(1),
        content: faker.lorem.lines({ min: 3, max: 5 }),
        userId: user.id,
        createdAt: date,
      },
    });
  }
}

async function resetData() {
  await prisma.user.deleteMany();
}

main();