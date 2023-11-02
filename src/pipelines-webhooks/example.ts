const example = {
  repository: {
    type: "repository",
    full_name: "AleksBL/wbot-test",
    links: { self: [Object], html: [Object], avatar: [Object] },
    name: "wbot-test",
    scm: "git",
    website: null,
    owner: {
      display_name: "Aleksandr Balev",
      links: [Object],
      type: "user",
      uuid: "{f0dfa5a0-deef-4945-b320-b74965a656ac}",
      account_id: "6074346640ccd40117c8168a",
      nickname: "Aleksandr Balev",
    },
    workspace: {
      type: "workspace",
      uuid: "{f0dfa5a0-deef-4945-b320-b74965a656ac}",
      name: "Aleksandr Balev",
      slug: "AleksBL",
      links: [Object],
    },
    is_private: true,
    project: {
      type: "project",
      key: "WBOT",
      uuid: "{63d84a28-5637-405e-bd41-7ef7e69169a6}",
      name: "wbot",
      links: [Object],
    },
    uuid: "{723a2f4e-f092-4bb3-9c4a-abb2b946aeaf}",
    parent: null,
  },
  actor: {
    display_name: "Aleksandr Balev",
    links: { self: [Object], avatar: [Object], html: [Object] },
    type: "user",
    uuid: "{f0dfa5a0-deef-4945-b320-b74965a656ac}",
    account_id: "6074346640ccd40117c8168a",
    nickname: "Aleksandr Balev",
  },
  commit_status: {
    key: "-1879968562",
    type: "build",
    state: "SUCCESSFUL",
    name: "Pipeline #3 for feature/pipeline-webhooks",
    refname: "feature/pipeline-webhooks",
    commit: {
      type: "commit",
      hash: "dc019cca662fc6a992fc9af98cdd3005a30eb1cd",
      date: "2023-11-02T16:08:09+00:00",
      author: [Object],
      message: "added Extra complex arithmetic operation WCOM-0001\n",
      links: [Object],
    },
    url: "https://bitbucket.org/AleksBL/wbot-test/addon/pipelines/home#!/results/3",
    repository: {
      type: "repository",
      full_name: "AleksBL/wbot-test",
      links: [Object],
      name: "wbot-test",
      uuid: "{723a2f4e-f092-4bb3-9c4a-abb2b946aeaf}",
    },
    description: "",
    created_on: "2023-11-02T16:08:44.273346+00:00",
    updated_on: "2023-11-02T16:09:30.843946+00:00",
    links: { self: [Object], commit: [Object] },
  },
};

const longMessageExample = {
  repository: {
    type: "repository",
    full_name: "AleksBL/wbot-test",
    links: { self: [Object], html: [Object], avatar: [Object] },
    name: "wbot-test",
    scm: "git",
    website: null,
    owner: {
      display_name: "Aleksandr Balev",
      links: [Object],
      type: "user",
      uuid: "{f0dfa5a0-deef-4945-b320-b74965a656ac}",
      account_id: "6074346640ccd40117c8168a",
      nickname: "Aleksandr Balev",
    },
    workspace: {
      type: "workspace",
      uuid: "{f0dfa5a0-deef-4945-b320-b74965a656ac}",
      name: "Aleksandr Balev",
      slug: "AleksBL",
      links: [Object],
    },
    is_private: true,
    project: {
      type: "project",
      key: "WBOT",
      uuid: "{63d84a28-5637-405e-bd41-7ef7e69169a6}",
      name: "wbot",
      links: [Object],
    },
    uuid: "{723a2f4e-f092-4bb3-9c4a-abb2b946aeaf}",
    parent: null,
  },
  actor: {
    display_name: "Aleksandr Balev",
    links: { self: [Object], avatar: [Object], html: [Object] },
    type: "user",
    uuid: "{f0dfa5a0-deef-4945-b320-b74965a656ac}",
    account_id: "6074346640ccd40117c8168a",
    nickname: "Aleksandr Balev",
  },
  commit_status: {
    key: "3343801",
    type: "build",
    state: "SUCCESSFUL",
    name: "Pipeline #6 for main",
    refname: "main",
    commit: {
      type: "commit",
      hash: "8ffaa5f866f1f34af56909d37ed7354750475590",
      date: "2023-11-02T16:19:34+00:00",
      author: [Object],
      message:
        "Merged in feature/pipeline-webhooks (pull request #1)\n" +
        "\n" +
        "Feature/pipeline webhooks\n" +
        "\n" +
        "* Merged main into feature/pipeline-webhooks\n" +
        "* another extra complex arithmetic operation\n" +
        "\n" +
        "* added Extra complex arithmetic operation WCOM-0001",
      links: [Object],
    },
    url: "https://bitbucket.org/AleksBL/wbot-test/addon/pipelines/home#!/results/6",
    repository: {
      type: "repository",
      full_name: "AleksBL/wbot-test",
      links: [Object],
      name: "wbot-test",
      uuid: "{723a2f4e-f092-4bb3-9c4a-abb2b946aeaf}",
    },
    description: "",
    created_on: "2023-11-02T16:19:54.626528+00:00",
    updated_on: "2023-11-02T16:20:00.057601+00:00",
    links: { self: [Object], commit: [Object] },
  },
};
