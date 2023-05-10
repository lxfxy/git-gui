declare interface WebHookPushEventPayload {
    ref: string
    repository: WebHookEventRepository
    pusher: { name: string; email: string }
    description: string | null
    sender: WebHookEventSender
    before?: string
    after?: string
    created?: boolean
    deleted?: boolean
    forced?: boolean
    base_ref?: string | null
    compare?: string
    commits?: WebHookEventCommit[]
    head_commit?: WebHookEventCommit
}
