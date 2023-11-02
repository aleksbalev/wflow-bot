import { HandlerEvent } from "@netlify/functions";
import { WebClient, LogLevel } from "@slack/web-api";

import { createHmac } from "crypto";

export async function slackApi() {
  return new WebClient(process.env.SLACK_BOT_OAUTH_TOKEN, {
    logLevel: LogLevel.INFO,
  });
  // const res = await fetch(`https://slack.com/api/${endpoint}`, {
  //   method: "POST",
  //   headers: {
  //     Authorization: `Bearer ${process.env.SLACK_BOT_OAUTH_TOKEN}`,
  //     "Content-Type": "application/json; charset=utf-8; multipart/form-data",
  //   },
  //   body: JSON.stringify(body),
  // });
  // return await res.json();
}

export function verifySlackRequest(request: HandlerEvent) {
  const secret = process.env.SLACK_SIGNIN_SECRET!;
  const signature = request.headers["x-slack-signature"];
  const timestamp = Number(request.headers["x-slack-request-timestamp"]);
  const now = Math.floor(Date.now() / 1000);

  if (Math.abs(now - timestamp) > 300) {
    return false;
  }

  const hash = createHmac("sha256", secret)
    .update(`v0:${timestamp}:${request.body}`)
    .digest("hex");

  return `v0=${hash}` === signature;
}

//export const blocks = {
//  section: () => {},
//  input: () => {},
//  select: () => {},
//}
