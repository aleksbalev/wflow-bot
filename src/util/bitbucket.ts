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
