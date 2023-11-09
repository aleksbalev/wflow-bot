import { Bitbucket, Schema } from "bitbucket";
import { AsyncResponse } from "bitbucket/lib/bitbucket";

const repoOwner =
  process.env.NODE_MODE === "development" ? "AleksBL" : "devteam6k";
const repoSlug =
  process.env.NODE_MODE === "development" ? "wbot-test" : "wflow-main-app";

const bitbucket = new Bitbucket({
  auth: {
    token: `${process.env.BITBUCKET_ACCESS_TOKEN}`,
  },
});

export async function getBitbucketRepoChangelog() {
  try {
    const content = await bitbucket.repositories.readSrc({
      commit: process.env.NODE_MODE === "development" ? "main" : "develop",
      repo_slug: repoSlug,
      workspace: repoOwner,
      path: "CHANGELOG.md",
    });

    return content;
  } catch (err) {
    console.error("Error fetching repository changelog:", err);

    throw err;
  }
}

export async function getPullRequestsByCommit(
  commitHash: string,
): Promise<Schema.Pullrequest[] | null> {
  let pullRequests = await bitbucket.repositories.listPullrequestsForCommit({
    commit: commitHash,
    repo_slug: repoSlug,
    workspace: repoOwner,
  });

  let pullRequestsValues = pullRequests.data?.values;

  if (pullRequestsValues && pullRequestsValues?.length > 0) {
    return pullRequestsValues;
  }

  if (pullRequestsValues && pullRequestsValues?.length === 0) {
    let lastCommit = await bitbucket.repositories.getCommit({
      commit: commitHash,
      repo_slug: repoSlug,
      workspace: repoOwner,
    });

    if (lastCommit.data && lastCommit.data?.parents) {
      pullRequests = await bitbucket.repositories.listPullrequestsForCommit({
        commit: lastCommit.data.parents[0].hash ?? commitHash,
        repo_slug: repoSlug,
        workspace: repoOwner,
      });
    }

    pullRequestsValues = pullRequests?.data.values;
  }

  if (pullRequestsValues && pullRequestsValues?.length > 0) {
    return pullRequestsValues;
  }

  return null;
}

export async function getPullRequestsCommits(
  commitHash: string,
  pullRequests: Schema.Pullrequest[] | null,
): Promise<AsyncResponse<Schema.Commit> | null> {
  if (pullRequests === null) {
    return bitbucket.repositories.getCommit({
      commit: commitHash,
      repo_slug: repoSlug,
      workspace: repoOwner,
    });
  }

  if (pullRequests && pullRequests.length > 0) {
    const prId = pullRequests[0].id;

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

export async function getVersionFromRepo(
  sourceBranch: string,
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
