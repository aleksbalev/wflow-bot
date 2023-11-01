import { Bitbucket } from "bitbucket";

const repoOwner = "AleksBL";
const repoSlug = "wbot-test";

async function bitbucketApi() {
  return new Bitbucket({
    auth: {
      token: `${process.env.BITBUCKET_ACCESS_TOKEN}`,
    },
  });
}

export async function getBitbucketRepoChangelog() {
  const bitbucket = await bitbucketApi();

  const content = bitbucket.repositories.readSrc({
    commit: "main",
    repo_slug: repoSlug,
    workspace: repoOwner,
    path: "CHANGELOG.md",
  });

  return content;
}
