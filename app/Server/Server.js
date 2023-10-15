const Replicate = require("replicate");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "https://renewpixpro.netlify.app",
  "Access-Control-Allow-Credentials": "true",
  "Content-Type": "application/json",
  "Access-Control-Allow-Headers":
    "X-Requested-With, Origin, Content-Type, Accept, Authorization, credentials",
  "Access-Control-Allow-Methods": "OPTIONS, POST",
};

const authenticateToken = (token) => {
  try {
    return jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      // Handle expired token error
      throw new Error("Authentication failed. Token expired.");
    }
    // Handle other JWT verification errors (e.g., invalid signature, invalid token, etc.)
    throw new Error("Authentication failed. " + error.message);
  }
};

const runReplicate = async (imageUrl, model, ScaleValue) => {
  const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
  });

  try {
    return await replicate.run(
      "tencentarc/gfpgan:9283608cc6b7be6b65a8e44983db012355fde4132009bf99d976b2f0896856a3",
      {
        input: {
          img: imageUrl,
          model: model,
          ScaleValue: ScaleValue,
        },
      }
    );
  } catch (error) {
    throw new Error("Replication failed. " + error.message);
  }
};

module.exports.restore = async (event) => {
  const eventBody = JSON.parse(event.body);
  const { imageUrl, model, ScaleValue } = eventBody;
  const token = event.headers["Authorization"];

  if (!token) {
    return {
      statusCode: 401,
      headers: CORS_HEADERS,
      body: JSON.stringify({
        error: "Authentication failed. No JWT provided.",
      }),
    };
  }

  try {
    const decoded = authenticateToken(token);
    const output = await runReplicate(imageUrl, model, ScaleValue);

    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify({ restoredImage: output }),
    };
  } catch (error) {
    if (error.message === "Authentication failed. Token expired.") {
      return {
        statusCode: 401,
        headers: CORS_HEADERS,
        body: JSON.stringify({
          error: "Authentication failed. Token expired.",
        }),
      };
    }

    console.error(error);
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
