declare type WebHookIssusPayloadAction =
    | "opened"
    | "labeled"
    | "assigned"
    | "unlabeled"
    | "unassigned"
    | "created"
    | "edited"
    | "deleted"
    | "closed"
    | "reopened";
declare type WebHookIssusPayloadState = "open" | "closed";
declare type WebHookIssusPayloadStateReason =
    | null
    | "completed"
    | "reopened"
    | "not_planned";

declare interface WebHookIssusPayloadAssignee {
    login: string;
    id: number;
    node_id: string;
    avatar_url: string;
    gravatar_id: string;
    url: string;
    html_url: string;
    followers_url: string;
    following_url: string;
    gists_url: string;
    starred_url: string;
    subscriptions_url: string;
    organizations_url: string;
    repos_url: string;
    events_url: string;
    received_events_url: string;
    type: string;
    site_admin: boolean;
}
declare interface WebHookIssusPayloadLabel {
    id: number;
    node_id: string;
    url: string;
    name: string;
    color: string;
    default: boolean;
    description: string;
}
declare interface WebHookIssusPayloadReactions {
    url: string;
    total_count: number;
    "+1": number;
    "-1": number;
    laugh: number;
    hooray: number;
    confused: number;
    heart: number;
    rocket: number;
    eyes: number;
}
declare interface WebHookIssusPayloadComment {
    url: string;
    html_url: string;
    issue_url: string;
    id: number;
    node_id: string;
    user: WebHookEventSender;
    created_at: string;
    updated_at: string;
    author_association: string;
    body: string;
    reactions: WebHookIssusPayloadReactions;
    performed_via_github_app: null;
}
declare interface WebHookIssusPayloadChanges {
    body?: { from: string };
    title?: { from: string };
}
declare interface WebHookIssusPayload {
    action: WebHookIssusPayloadAction;
    /**
     * @description `action === "edited"`
     */
    changes?: WebHookIssusPayloadChanges;
    /**
     * @description `action === "created" | "edited" | "deleted"`
     */
    comment?: WebHookIssusPayloadComment;
    /**
     * @description `action === "assigned" | "unassigned"`
     */
    assignee?: WebHookIssusPayloadAssignee;
    /**
     * @description `action === "labeled" | "unlabeled"`
     */
    label?: WebHookIssusPayloadLabel;
    issue: {
        url: string;
        repository_url: string;
        labels_url: string;
        comments_url: string;
        events_url: string;
        html_url: string;
        id: number;
        node_id: string;
        number: number;
        title: string;
        user: WebHookEventSender;
        labels: WebHookIssusPayloadLabel[];
        state: WebHookIssusPayloadState;
        locked: boolean;
        assignee: WebHookIssusPayloadAssignee;
        assignees: WebHookIssusPayloadAssignee[];
        milestone: unknown;
        comments: number;
        created_at: string;
        updated_at: string;
        closed_at: unknown;
        author_association: string;
        active_lock_reason: unknown;
        body: string;
        reactions: WebHookIssusPayloadReactions;
        timeline_url: string;
        performed_via_github_app: unknown;
        state_reason: null | "";
    };
    repository: WebHookEventRepository;
    sender: WebHookEventSender;
}
