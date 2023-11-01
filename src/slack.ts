import type { Handler } from "@netlify/functions";

import { parse } from "querystring";
import { slackApi, verifySlackRequest } from "./util/slack";

import { getBitbucketRepoChangelog } from "./util/bitbucket";

async function handleSlashCommand(payload: SlackSlashCommandPayload) {
  switch (payload.command) {
    case "/release-log":
      const regexPattern = payload.text
        ? `## ${payload.text}([\\s\\S]*?)---`
        : "## Unreleased([\\s\\S]*?)---";
      const content = await getBitbucketRepoChangelog();
      const transformedContent = `${content.data}`.match(
        new RegExp(regexPattern),
      );

      const client = await slackApi();

      try {
        if (transformedContent && transformedContent.length > 0) {
          await client.files.uploadV2({
            channel_id: payload.channel_id,
            initial_comment: "Here is your readme :wink:",
            content: transformedContent[0],
            filename: "CHANGELOG.md",
          });
        } else {
          await client.chat.postMessage({
            channel: payload.channel_id,
            text: "No matching content found in the repository. :disappointed:",
          });
        }
      } catch (err) {
        console.error(err);

        return {
          statusCode: 500,
          body: "Internal Server Error",
        };
      }

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
