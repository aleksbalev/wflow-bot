import { Bitbucket } from "bitbucket";

const repoOwner = "AleksBL";
const repoSlug = "wbot-test";

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
      commit: "main",
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
