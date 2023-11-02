import { Handler } from "@netlify/functions";

export const handler: Handler = async (event) => {
  let body = {};

  if (event.body) {
    body = JSON.parse(event.body) as BitbucketPipelineUpdatePayload;
  }

  console.log(body);

  return {
    statusCode: 200,
    body: JSON.stringify(body),
  };
};
