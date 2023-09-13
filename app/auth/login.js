const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");

module.exports.login = async (event) => {
  try {
    const body = JSON.parse(event.body);
    const { email, password } = body;

    console.log(email, password);

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

    //decrypt password
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

    console.log(token);
    console.log(user);

    return {
      statusCode: 200,
      body: JSON.stringify({
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
