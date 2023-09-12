const Replicate = require("replicate"); // Import the 'replicate' module if you haven't already
const dotenv = require("dotenv"); // Import the 'dotenv' module if you haven't already
dotenv.config(); // Load the '.env' file if you haven't already
module.exports.restore = async (event) => {
  const body = JSON.parse(event.body);
  const { imageUrl, model, ScaleValue } = body;
  console.log(body);

  const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
  });

  try {
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
    console.log(output);
    // You can manipulate the output as needed and send it back
    return {
      statusCode: 200,
      body: JSON.stringify({ restoredImage: output }, null, 2),
    };
  } catch (error) {
    console.error(error);

    // If there's an error, return a 500 status code and an error message
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }, null, 2),
    };
  }
};
