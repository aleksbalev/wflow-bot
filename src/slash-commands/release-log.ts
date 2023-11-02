import { getBitbucketRepoChangelog } from "../util/bitbucket";
import { slackApi } from "../util/slack";

export async function releaseLog(
  payload: SlackSlashCommandPayload,
): Promise<HandlerResult | undefined> {
  const regexPattern = payload.text
    ? `## ${payload.text}([\\s\\S]*?)---`
    : "## Unreleased([\\s\\S]*?)---";
  const content = await getBitbucketRepoChangelog();
  const transformedContent = `${content.data}`.match(new RegExp(regexPattern));

  const client = await slackApi();

  try {
    if (transformedContent && transformedContent.length > 0) {
      await client.files.uploadV2({
        channel_id: payload.channel_id,
        initial_comment: "Here is your changelog :wink:",
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
}
