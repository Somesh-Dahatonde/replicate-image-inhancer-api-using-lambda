const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

module.exports.login = async (event) => {
  try {
    const eventBody = JSON.parse(event.body);
    const { email, password } = eventBody;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      console.log("User does not exist");
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "User does not exist" }),
      };
    }

    //decrypting the password
    const isMatch = await bcrypt.compare(password, user.password);
    console.log(isMatch);

    if (!isMatch) {
      console.log("Invalid credentials");
      return {
        statusCode: 401,
        body: JSON.stringify({ message: "Invalid credentials" }),
      };
    }

    const { id, name, email: userEmail } = user;
    const token = jwt.sign(
      { _id: id, name, email: userEmail },
      process.env.JWT_SECRET
    );
    //this are only for debugging purpose
    // console.log(token);
    // console.log(user);
    // console.log(email, password);

    return {
      statusCode: 200,
      body: JSON.stringify({
        statusCode: 200,
        token,
        user: { _id: id, name, email: userEmail },
      }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal Server Error" }),
    };
  }
};
