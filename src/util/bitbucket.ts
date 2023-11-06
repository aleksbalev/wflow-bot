import { Bitbucket } from "bitbucket";

const repoOwner =
  process.env.NODE_MODE === "development" ? "AleksBL" : "devteam6k";
const repoSlug =
  process.env.NODE_MODE === "development" ? "wbot-test" : "wflow-main-app";

function bitbucketApi() {
  return new Bitbucket({
    auth: {
      token: `${process.env.BITBUCKET_ACCESS_TOKEN}`,
    },
  });
}

export async function getBitbucketRepoChangelog() {
  const bitbucket = bitbucketApi();

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

export async function getPullRequestsCommits(
  commit: string,
): Promise<{ data: CommitPayload } | null> {
  const bitbucket = bitbucketApi();

  const pullRequest = await bitbucket.repositories.listPullrequestsForCommit({
    commit,
    repo_slug: repoSlug,
    workspace: repoOwner,
  });

  if (pullRequest.data.values && pullRequest.data.values.length > 0) {
    const prId = pullRequest.data.values[0].id;

    console.log("prId: ", prId);
    console.log("repoSlug: ", repoSlug);
    console.log("repoOwner: ", repoOwner);
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
  const packageJSON = await bitbucketApi().repositories.readSrc({
    commit: sourceBranch,
    repo_slug: repoSlug,
    workspace: repoOwner,
    path: "package.json",
  });

  const version = JSON.parse(packageJSON.data as string).version;

  return version;
}
