type HandlerResult = {
  statusCode: number;
  body: string;
};

type SlackSlashCommandPayload = {
  token: string;
  team_id: string;
  team_domain: string;
  channel_id: string;
  channel_name: string;
  user_id: string;
  user_name: string;
  command: string;
  text: string;
  api_app_id: string;
  is_enterprise_install: boolean;
  response_url: string;
  trigger_id: string;
  payload: never;
};

type SlackInteractivityPayload = {
  payload: string;
  command: never;
};

type SlackPayload = SlackSlashCommandPayload | SlackInteractivityPayload;

type SlackBlockSection = {
  text?: string;
  color: string;
  fields: {
    title: string;
    value: string;
    short: boolean;
  }[];
};

type SlackBlock = SlackBlockSection;

type ModalArgs = {
  trigger_id: string;
  id: string;
  title: string;
  submit_text?: string;
  blocks: SlackBlock[];
};

type SlackModalPayload = {
  type: string;
  callback_id?: string;
  team: {
    id: string;
    domain: string;
  };
  user: {
    id: string;
    username: string;
    name: string;
    team_id: string;
  };
  channel?: {
    id: string;
    name: string;
  };
  message: {
    ts: string;
    thread_ts?: string;
  };
  api_app_id: string;
  token: string;
  trigger_id: string;
  view: {
    id: string;
    team_id: string;
    type: string;
    blocks: SlackBlock[];
    private_metadata: string;
    callback_id: string;
    hash: string;
    title: {
      type: "plain_text";
      text: string;
      emoji: boolean;
    };
    clear_on_close: boolean;
    notify_on_close: boolean;
    close: null;
    submit: {
      type: "plain_text";
      text: string;
      emoji: boolean;
    };
    app_id: string;
    external_id: string;
    app_installed_team_id: string;
    bot_id: string;
  };
};

type SlackApiEndpoint = "chat.postMessage" | "views.open" | "files.upload";

type SlackApiRequestBody = {};

type BlockArgs = {
  id: string;
  label: string;
  placeholder: string;
};

type SectionBlockArgs = {
  text: string;
};

type SectionDeployBlockArgs = {
  tasks: string;
  date: string;
  version: string;
};

type InputBlockArgs = {
  initial_value?: string;
  hint?: string;
} & BlockArgs;

type SelectBlockArgs = {
  options: {
    label: string;
    value: string;
  }[];
} & BlockArgs;

type NotionItem = {
  properties: {
    opinion: {
      title: {
        text: {
          content: string;
        };
      }[];
    };
    spiceLevel: {
      select: {
        name: string;
      };
    };
    Status: {
      status: {
        name: string;
      };
    };
  };
};

type NewItem = {
  opinion: string;
  spiceLevel: string;
  status?: string;
  submitter?: string;
};

type BitbucketPipelineUpdatePayload = {
  repository: {
    type: "repository";
    full_name: string;
    links: {
      self: Record<string, any>;
      html: Record<string, any>;
      avatar: Record<string, any>;
    };
    name: string;
    scm: string;
    website: string | null;
    owner: {
      display_name: string;
      links: Record<string, any>;
      type: string;
      uuid: string;
      account_id: string;
      nickname: string;
    };
    workspace: {
      type: "workspace";
      uuid: string;
      name: string;
      slug: string;
      links: Record<string, any>;
    };
    is_private: boolean;
    project: {
      type: "project";
      key: string;
      uuid: string;
      name: string;
      links: Record<string, any>;
    };
    uuid: string;
    parent: null;
  };
  actor: {
    display_name: string;
    links: {
      self: Record<string, any>;
      avatar: Record<string, any>;
      html: Record<string, any>;
    };
    type: string;
    uuid: string;
    account_id: string;
    nickname: string;
  };
  commit_status: {
    key: string;
    type: string;
    state: string;
    name: string;
    refname: string;
    commit: {
      type: "commit";
      hash: string;
      date: string;
      author: Record<string, any>;
      message: string;
      links: Record<string, any>;
    };
    url: string;
    repository: {
      type: "repository";
      full_name: string;
      links: Record<string, any>;
      name: string;
      uuid: string;
    };
    description: string;
    created_on: string;
    updated_on: string;
    links: {
      self: Record<string, any>;
      commit: Record<string, any>;
    };
  };
};

type AzurePipelinePayload = {
  subscriptionId: string;
  notificationId: number;
  id: string;
  eventType: string;
  publisherId: string;
  message: {
    text: string;
    html: string;
    markdown: string;
  };
  detailedMessage: {
    text: string;
    html: string;
    markdown: string;
  };
  resource: {
    properties: Record<string, unknown>;
    tags: unknown[];
    validationResults: unknown[];
    plans: unknown[];
    templateParameters: Record<string, unknown>;
    triggerInfo: Record<string, unknown>;
    id: number;
    buildNumber: string;
    status: string;
    result: string;
    queueTime: string;
    startTime: string;
    finishTime: string;
    url: string;
    definition: {
      drafts: unknown[];
      id: number;
      name: string;
      url: string;
      uri: string;
      path: string;
      type: string;
      queueStatus: string;
      revision: number;
      project: Record<string, unknown>;
    };
    buildNumberRevision: number;
    project: {
      id: string;
      name: string;
      url: string;
      state: string;
      revision: number;
      visibility: string;
      lastUpdateTime: string;
    };
    uri: string;
    sourceBranch: string;
    sourceVersion: string;
    queue: {
      id: number;
      name: string;
      pool: Record<string, unknown>;
    };
    priority: string;
    reason: string;
    requestedFor: {
      displayName: string;
      url: string;
      _links: Record<string, unknown>;
      id: string;
      uniqueName: string;
      imageUrl: string;
      descriptor: string;
    };
    requestedBy: {
      displayName: string;
      url: string;
      _links: Record<string, unknown>;
      id: string;
      uniqueName: string;
      imageUrl: string;
      descriptor: string;
    };
    lastChangedDate: string;
    lastChangedBy: {
      displayName: string;
      url: string;
      _links: Record<string, unknown>;
      id: string;
      uniqueName: string;
      imageUrl: string;
      descriptor: string;
    };
    orchestrationPlan: {
      planId: string;
    };
    logs: {
      id: number;
      type: string;
      url: string;
    };
    repository: {
      id: string;
      type: string;
      clean: string | null;
      checkoutSubmodules: boolean;
    };
    retainedByRelease: boolean;
    triggeredByBuild: Record<string, unknown> | null;
    appendCommitMessageToRunName: boolean;
  };
  resourceVersion: string;
  resourceContainers: {
    collection: {
      id: string;
      baseUrl: string;
    };
    account: {
      id: string;
      baseUrl: string;
    };
    project: {
      id: string;
      baseUrl: string;
    };
  };
  createdDate: string;
};

type CommitPayload = {
  values: [
    {
      message: string;
    },
  ];
};
