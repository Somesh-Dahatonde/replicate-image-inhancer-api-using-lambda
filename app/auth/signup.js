const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const { json } = require("body-parser");
const prisma = new PrismaClient();
const createError = require("http-errors");

module.exports.signup = async (event) => {
  const eventBody = JSON.parse(event.body);
  const { name, email, password, number } = eventBody;

  //encrypt password
  const salt = await bcrypt.genSalt(10);
  const bcryptpass = await bcrypt.hash(password, salt);

  const alreadyExists = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  if (alreadyExists) {
    console.log("User already exists");
    return {
      statusCode: 409,
      body: JSON.stringify({ message: "User already exists" }),
    };
  }

  if (password.length < 8) {
    console.log("Password must be 8 characters or longer");
    return {
      statusCode: 409,
      body: JSON.stringify({
        message: "Password must be 8 characters or longer",
      }),
    };
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
    // return createError(500, "something went wrong plz try after some time");
    return {
      statusCode: 502,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
