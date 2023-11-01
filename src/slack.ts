import type { Handler } from "@netlify/functions";

import { parse } from "querystring";
import { slackApi, verifySlackRequest } from "./util/slack";

import { getBitbucketRepoChangelog } from "./util/bitbucket";

async function handleSlashCommand(payload: SlackSlashCommandPayload) {
  switch (payload.command) {
    case "/release-log":
      let regexp;

      if (payload.text) {
        regexp = new RegExp(`## ${payload.text}([\\s\\S]*?)---`);
      } else {
        regexp = new RegExp("## Unreleased([\\s\\S]*?)---");
      }

      const content = await getBitbucketRepoChangelog();
      const transformedContent = `${content.data}`.match(regexp);

      const client = await slackApi();

      try {
        if (transformedContent && transformedContent.length > 0) {
          client.files.upload({
            channels: payload.channel_id,
            initial_comment: "Here is your readme :wink:",
            content: transformedContent[0],
            filetype: "markdown",
            filename: "CHANGELOG.md",
          });
        } else {
          client.chat.postMessage({
            channel: payload.channel_id,
            text: "No matching content found in the repository. :disappointed:",
          });
        }
      } catch (err) {
        console.error(err);
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
