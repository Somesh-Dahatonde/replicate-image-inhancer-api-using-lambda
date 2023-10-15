const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

module.exports.login = async (event) => {
  const secretKey = process.env.JWT_SECRET;
  const expirationTimeInSeconds = 3600; // Token expires in 1 hour (you can adjust this as needed)
  const eventBody = JSON.parse(event.body);
  const { email, password } = eventBody;
  const CORS_HEADERS = {
    "Access-Control-Allow-Origin": "https://renewpixpro.netlify.app",
    "Content-Type": "application/json",
    "Access-Control-Allow-Headers":
      "X-Requested-With, Origin, Content-Type, Accept, Authorization",
    "Access-Control-Allow-Methods": "OPTIONS, POST",
  };

  try {
    const user = await prisma.user.findUnique({
      where: { email: email },
    });
    if (!user) {
      console.log("User does not exist");
      return {
        statusCode: 404,
        headers: CORS_HEADERS,
        body: JSON.stringify({
          error: { statusCode: 404, message: "User does not exist" },
        }),
      };
    }

    // Decrypting the password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      console.log("Invalid credentials");
      return {
        statusCode: 401,
        headers: CORS_HEADERS,
        body: JSON.stringify({
          error: { statusCode: 401, message: "Invalid credentials" },
        }),
      };
    }

    // Create a user object with the necessary properties for the token
    const userForToken = {
      id: user.id,
      name: user.name,
      email: user.email,
      number: user.number,
    };

    const token = jwt.sign(userForToken, secretKey, {
      expiresIn: expirationTimeInSeconds,
    });

    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify({
        token,
      }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
