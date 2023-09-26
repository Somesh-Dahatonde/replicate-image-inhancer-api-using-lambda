const Replicate = require("replicate");
const jwt = require("jsonwebtoken");

module.exports.restore = async (event) => {
  const eventBody = JSON.parse(event.body);
  const { imageUrl, model, ScaleValue } = eventBody;
  const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
  });

  const token = event.headers["Authorization"];

  if (!token) {
    // No JWT provided, so return a 401 Unauthorized response
    return {
      statusCode: 401,
      headers: {
        "Access-Control-Allow-Origin": "http://localhost:3000", // or your desired origin
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({
        error: "Authentication failed. No JWT provided.",
        headers,
      }),
    };
  }
  // console.log(eventBody);

  try {
    const decoded = jwt.verify(
      token.replace("Bearer ", ""),
      process.env.JWT_SECRET
    );
    const output = await replicate.run(
      "tencentarc/gfpgan:9283608cc6b7be6b65a8e44983db012355fde4132009bf99d976b2f0896856a3",
      {
        input: {
          img: imageUrl,
          model: model,
          ScaleValue: ScaleValue,
        },
      }
    );
    // console.log(output);
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "http://localhost:3000", // or your desired origin
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({ headers, restoredImage: output }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "http://localhost:3000", // or your desired origin
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({ headers, error: error.message }),
    };
  }
};
