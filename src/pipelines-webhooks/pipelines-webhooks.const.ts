export const relevantRepos = [
  "main",
  "master",
  "preprod",
  "preview",
  "rc",
  "test",
];

export const relevantReposNamesMap = new Map<string, string>([
  ["master", "production"],
  ["main", "production"],
  ["develop", "devel"],
  ["test", "test"],
  ["preprod", "preprod"],
  ["preview", "preview"],
  ["rc", "rc"],
]);
