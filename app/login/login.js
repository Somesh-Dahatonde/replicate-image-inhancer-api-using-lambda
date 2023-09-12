const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
async function main() {
  try {
    // await prisma.user.create({
    //   data: {
    //     name: "Alice",
    //     email: "alic@prisma.io",
    //     password: "12345678",
    //     number: 123,
    //   },
    // });

    const allUsers = await prisma.user.findMany({});
    console.dir(allUsers, { depth: null });
  } catch (error) {
    console.error(error);
  }
}

main();
