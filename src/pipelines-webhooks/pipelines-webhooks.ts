import { Handler } from "@netlify/functions";
import {
  getPullRequestsByCommit,
  getPullRequestsCommits,
  getVersionFromRepo,
} from "../util/bitbucket";
import { cetDate, filterDuplicates } from "../util/utils";
import { attachments, blocks, slackApi } from "../util/slack";
import {
  relevantRepos,
  relevantReposNamesMap,
} from "./pipelines-webhooks.const";
import { Schema } from "bitbucket";

function getTasksIds(commit: Schema.Commit): string | undefined {
  let resultIds: string | undefined = "";
  const regex = /WCOM-\d{4,}/g;

  if (commit.values && Array.isArray(commit.values)) {
    const messages = commit.values.map((v: Schema.Commit) => v.message);
    const combinedMessages = messages.join(" ");
    const foundMatches = combinedMessages.match(regex) || [];
    resultIds = filterDuplicates(foundMatches).join(", ");
  } else {
    resultIds = commit.message?.match(regex)?.join(", ");
  }

  return resultIds;
}

function headerFormat(headerName?: string, branch?: string) {
  if (branch === "master" || branch === "main") {
    return `:party_blob: :party_blob: :party_blob: Deployed on ${
      headerName ? `${headerName.toUpperCase()}` : "unrecognized".toUpperCase()
    } :party_blob: :party_blob: :party_blob:`;
  }

  return `Deployed on ${
    headerName ? `${headerName.toUpperCase()}` : "unrecognized".toUpperCase()
  }`;
}

export const handler: Handler = async (event) => {
  const slackClient = await slackApi();
  let body = null;

  if (event.body) {
    try {
      body = JSON.parse(event.body) as AzurePipelinePayload;
      const { resource } = body;
      const branchSplitted = resource.sourceBranch.split("/");
      const branch = branchSplitted[branchSplitted.length - 1];
      const headerName = relevantReposNamesMap.get(branch);

      if (relevantRepos.includes(branch)) {
        const pullRequests = await getPullRequestsByCommit(
          resource.sourceVersion,
        );

        const commits = await getPullRequestsCommits(
          resource.sourceVersion,
          pullRequests,
        );

        const version = await getVersionFromRepo(branch);

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
              text: headerFormat(headerName, branch),
            }),
          ],
          attachments: [
            attachments.sectionDeploy({
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
        attachments: [
          {
            text: "Woopsie doopsie, something went wrong",
            color: "#ee1a27",
          },
        ],
      });

      console.error(err);
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify(body),
  };
};
