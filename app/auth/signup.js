const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const prisma = new PrismaClient();
module.exports.signup = async (event) => {
  const { name, email, password, number } = req.body;
  // password = "Somesh22@";
  const salt = await bcrypt.genSalt(10);
  console.log(salt);
  const bcryptpass = await bcrypt.hash(password, salt);
  console.log(bcryptpass);

  //decrypt password
  // const isMatch = await bcrypt.compare(password, bcryptpass);
  // console.log(isMatch);

  const alreadyExists = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  if (alreadyExists) {
    console.log("User already exists");
    return;
  }

  if (password.length < 8) {
    console.log("Password must be 8 characters or longer");
    return;
  }

  try {
    await prisma.user.create({
      data: {
        name: name,
        email: email,
        password: bcryptpass,
        number: number,
      },
    });
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "User Created" }),
    };
  } catch (error) {
    console.error(error);
  }
};

main();
