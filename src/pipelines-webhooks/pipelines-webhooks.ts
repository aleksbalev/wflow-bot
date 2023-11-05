import { Handler } from "@netlify/functions";
import { getPullRequestsCommits, getVersionFromRepo } from "../util/bitbucket";
import { cetDate, filterDuplicates } from "../util/utils";
import { blocks, slackApi } from "../util/slack";
import {
  relevantRepos,
  relevantReposNamesMap,
} from "./pipelines-webhooks.const";

function getTasksIds(commits: CommitPayload): string {
  const regex = /WCOM-\d{4,}/g;
  const messages = commits.values.map((v) => v.message);
  const combinedMessages = messages.join(" ");
  const foundMatches = combinedMessages.match(regex) || [];
  const resultIds = filterDuplicates(foundMatches).join(", ");

  return resultIds;
}

export const handler: Handler = async (event) => {
  const slackClient = await slackApi();
  let body = null;

  if (event.body) {
    try {
      body = JSON.parse(event.body) as AzurePipelinePayload;
      const { resource } = body;
      const [repoOwner, repoSlug] = resource.repository.id.split("/");
      const branchSplitted = resource.sourceBranch.split("/");
      const branch = branchSplitted[branchSplitted.length - 1];
      const headerName = relevantReposNamesMap.get(branch);

      if (relevantRepos.includes(branch)) {
        const commits = await getPullRequestsCommits(
          resource.sourceVersion,
          repoSlug,
          repoOwner,
        );

        const version = await getVersionFromRepo(branch, repoSlug, repoOwner);

        let tasksIds;
        if (commits?.data) {
          tasksIds = getTasksIds(commits.data);
        }

        await slackClient.chat.postMessage({
          channel: `${process.env.DEPLOY_INFO_CHANNEL_ID}`,
          text: `Deployment data - version: ${version}; tasks: ${
            tasksIds && tasksIds.length > 0 ? tasksIds : "-"
          }; date: ${cetDate(resource.finishTime)}`,
          blocks: [
            blocks.header({
              text: `Deployed on ${
                headerName
                  ? headerName.toUpperCase()
                  : "unrecognized".toUpperCase()
              }`,
            }),
            blocks.sectionDeploy({
              date: cetDate(resource.finishTime),
              version: version,
              tasks: tasksIds && tasksIds.length > 0 ? tasksIds : "-",
            }),
          ],
        });
      }
    } catch (err) {
      await slackClient.chat.postMessage({
        channel: `${process.env.DEPLOY_INFO_CHANNEL_ID}`,
        text: "Woopsie doopsie, something went wrong",
      });

      console.error(err);
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify(body),
  };
};
