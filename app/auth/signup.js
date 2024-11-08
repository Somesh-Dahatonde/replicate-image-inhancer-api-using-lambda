const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const { json } = require("body-parser");
const prisma = new PrismaClient();

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
    return {
      statusCode: 409,
      body: JSON.stringify({
        error: {
          statusCode: 409,
          message: `User with email${email} already exits plz login`,
        },
      }),
    };
  }

  if (password.length < 8) {
    return {
      statusCode: 409,
      body: JSON.stringify({
        error: {
          message: "Password must be 8 characters or longer",
        },
      }),
    };
  }

  try {
    await prisma.user.create({
      data: {
        name: name,
        email: email,
        password: bcryptpass,
        number: 123,
      },
    });
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Signup Sucessful" }),
    };
  } catch (error) {
    // return createError(500, "something went wrong plz try after some time");
    return {
      statusCode: 502,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
