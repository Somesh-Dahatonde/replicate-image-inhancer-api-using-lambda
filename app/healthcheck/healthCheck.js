"use strict";

module.exports.healthcheck = async (event) => {
  try {
    return {
      statusCode: 200,
      body: JSON.stringify({
        statusCode: 200,
        message: "Api is up and running! ",
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: {
        error: error,
      },
    };
  }

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
