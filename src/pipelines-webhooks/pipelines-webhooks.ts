import { Handler } from "@netlify/functions";
import { bitbucketApi, repoOwner } from "../util/bitbucket";
import { blocks, slackApi } from "../util/slack";
import { cetDate } from "../util/format";

const bitbucket = bitbucketApi();

async function getPullRequestsCommits(
  commit: string,
  repoSlug: string,
  workspace: string,
): Promise<{ data: CommitPayload } | null> {
  const pullRequest = await bitbucket.repositories.listPullrequestsForCommit({
    commit,
    repo_slug: repoSlug,
    workspace,
  });

  if (pullRequest.data.values && pullRequest.data.values.length > 0) {
    const prId = pullRequest.data.values[0].id;

    if (prId) {
      return bitbucket.repositories.listPullRequestCommits({
        pull_request_id: prId,
        repo_slug: repoSlug,
        workspace: repoOwner,
      });
    }
  }

  return null;
}

function getTasksIds(commits: CommitPayload): string {
  const regex = /WCOM-\d{4,}/g;
  const messages = commits.values.map((v) => v.message);
  const combinedMessages = messages.join(" ");
  const foundMatches = combinedMessages.match(regex) || [];
  const resultIds = foundMatches.join(", ");

  return resultIds;
}

async function getVersionFromRepo(
  sourceBranch: string,
  repoSlug: string,
  repoOwner: string,
): Promise<string> {
  const packageJSON = await bitbucket.repositories.readSrc({
    commit: sourceBranch,
    repo_slug: repoSlug,
    workspace: repoOwner,
    path: "package.json",
  });

  const version = JSON.parse(packageJSON.data as string).version;

  return version;
}

export const handler: Handler = async (event) => {
  let body = null;

  if (event.body) {
    try {
      body = JSON.parse(event.body) as AzurePipelinePayload;
      const { resource } = body;
      const [repoOwner, repoSlug] = resource.repository.id.split("/");
      const branchSplitted = resource.sourceBranch.split("/");
      const branch = branchSplitted[branchSplitted.length - 1];

      if (branch === "main") {
        const commits = await getPullRequestsCommits(
          resource.sourceVersion,
          repoSlug,
          repoOwner,
        );

        const version = await getVersionFromRepo(branch, repoSlug, repoOwner);

        const slackClient = await slackApi();

        let tasksIds;
        if (commits?.data) {
          tasksIds = getTasksIds(commits.data);
        }

        await slackClient.chat.postMessage({
          channel: "C05A1JM6QKB",
          blocks: [
            blocks.header({
              text: `Deployed on ${branch.toUpperCase()}`,
            }),
            blocks.sectionDeploy({
              date: cetDate(resource.finishTime),
              tasks: tasksIds && tasksIds.length > 0 ? tasksIds : "-",
              result: resource.result,
              version: version,
            }),
          ],
        });
      }
    } catch (err) {
      console.log(err);
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify(body),
  };
};
