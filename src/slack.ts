import type { Handler } from "@netlify/functions";

import { parse } from "querystring";
import { verifySlackRequest } from "./util/slack";

import { releaseLog } from "./slash-commands/release-log";

async function handleSlashCommand(
  payload: SlackSlashCommandPayload,
): Promise<HandlerResult> {
  switch (payload.command) {
    case "/release-log":
      await releaseLog(payload);

      break;
    default:
      return {
        statusCode: 200,
        body: `Command ${payload.command} is not recognized`,
      };
  }

  return {
    statusCode: 200,
    body: "",
  };
}

export const handler: Handler = async (event) => {
  const valid = verifySlackRequest(event);

  if (!valid) {
    console.error("invalid request");

    return {
      statusCode: 400,
      body: "invalid request",
    };
  }

  const body = parse(event.body ?? "") as SlackPayload;
  if (body.command) {
    return handleSlashCommand(body as SlackSlashCommandPayload);
  }

  // TODO handle interactivity (e.g. context commands, modals)

  return {
    statusCode: 200,
    body: "TODO: handle Slack commands and interactivity",
  };
};
