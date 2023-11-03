import { Handler } from "@netlify/functions";
import { bitbucketApi } from "../util/bitbucket";

export const handler: Handler = async (event) => {
  const bitbucket = bitbucketApi();
  let body = null;

  if (event.body) {
    try {
      body = JSON.parse(event.body) as AzurePipelinePayload;
      const { resource } = body;
      const [repoOwner, repoSlug] = resource.repository.id.split("/");

      if (resource.sourceVersion && repoSlug && repoOwner) {
        await bitbucket.repositories
          .listPullrequestsForCommit({
            commit: resource.sourceVersion,
            repo_slug: repoSlug,
            workspace: repoOwner,
          })
          .then(async (pr) => {
            if (pr.data.values && pr.data.values.length > 0) {
              const prId = pr.data.values[0].id;

              if (prId) {
                await bitbucket.repositories
                  .listPullRequestCommits({
                    pull_request_id: prId,
                    repo_slug: repoSlug,
                    workspace: repoOwner,
                  })
                  .then((result) => {
                    console.log(result.data);
                  });
              }
            }
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
