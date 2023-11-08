import { Bitbucket } from "bitbucket";

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

export async function getPullRequestsByCommit(commitHash: string) {
  const pullRequests = await bitbucket.repositories.listPullrequestsForCommit({
    commit: commitHash,
    repo_slug: repoSlug,
    workspace: repoOwner,
  });

  return pullRequests.data?.values;
}

export async function getPullRequestsCommits(
  pullRequests: any[],
): Promise<{ data: CommitPayload } | null> {
  try {
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
  } catch (err) {
    console.error("Error in getPullRequestsCommits: ", err);
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
