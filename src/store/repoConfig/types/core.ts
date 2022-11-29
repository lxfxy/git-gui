import { RecordAddPrefix, AddPrefix, RemovePrefix } from ".";

type RepoConfigCoreCfgShitespaceNames =
    | "blank-at-eol"
    | "space-before-tab"
    | "indent-with-non-tab"
    | "tab-in-indent"
    | "blank-at-eof"
    | "trailing-space"
    | "cr-at-eol"
    | "tabwidth";
type RepoConfigCoreCfgShitespaceDisableNames = AddPrefix<
    "-",
    RepoConfigCoreCfgShitespaceNames
>;

export type RepoConfigCoreCfgShitespace = {
    [k in
        | RepoConfigCoreCfgShitespaceNames
        | RepoConfigCoreCfgShitespaceDisableNames]: string;
};

export type RepoConfigCoreCfgFsyncNames =
    | "loose-object"
    | "pack"
    | "pack-metadata"
    | "commit-graph"
    | "index"
    | "objects"
    | "reference"
    | "derived-metadata"
    | "committed"
    | "added"
    | "all";
export type RepoConfigCoreCfgFsyncDisableNames = AddPrefix<
    "-",
    RepoConfigCoreCfgFsyncNames
>;
export type RepoConfigCoreCfgFsync = {
    [k in
        | RepoConfigCoreCfgFsyncNames
        | RepoConfigCoreCfgFsyncDisableNames
        | "none"]: string;
};

export interface RepoConfigCoreCfgs {
    fileMode: boolean;
    hideDotFiles: boolean;
    ignoreCase: boolean;
    precomposeUnicode: boolean;
    protectHFS: boolean;
    protectNTFS: boolean;
    fsmonitor: boolean;
    fsmonitorHookVersion: 1 | 2;
    trustctime: boolean;
    splitIndex: boolean;
    untrackedCache: boolean;
    checkStat: boolean;
    quotePath: boolean;
    eol: boolean;
    safecrlf: boolean;
    autocrlf: boolean;
    checkRoundtripEncoding: boolean;
    symlinks: boolean;
    gitProxy: boolean;
    sshCommand: boolean;
    ignoreStat: boolean;
    preferSymlinkRefs: boolean;
    alternateRefsCommand: boolean;
    alternateRefsPrefixes: boolean;
    bare: boolean;
    worktree: boolean;
    logAllRefUpdates: boolean;
    repositoryFormatVersion: boolean;
    sharedRepository: boolean;
    warnAmbiguousRefs: boolean;
    compression: boolean;
    looseCompression: boolean;
    packedGitWindowSize: boolean;
    packedGitLimit: boolean;
    deltaBaseCacheLimit: boolean;
    bigFileThreshold: boolean;
    excludesFile: boolean;
    askPass: boolean;
    attributesFile: boolean;
    hooksPath: boolean;
    editor: boolean;
    commentChar: boolean;
    filesRefLockTimeout: boolean;
    packedRefsTimeout: boolean;
    pager: boolean;
    whitespace: RepoConfigCoreCfgShitespace;
    fsync: RepoConfigCoreCfgFsync;
    fsyncMethod: "fsync" | "writeout-only" | "batch";
    fsyncObjectFiles: boolean;
    preloadIndex: boolean;
    unsetenvvars: "PERL5LIB";
    restrictinheritedhandles: "auto" | true | false;
    createObject: "link";
    notesRef: boolean;
    commitGraph: boolean;
    useReplaceRefs: boolean;
    multiPackIndex: boolean;
    sparseCheckout: boolean;
    sparseCheckoutCone: boolean;
    abbrev: "auto" | "no";
}
export type RepoConfigCore = RecordAddPrefix<"core", RepoConfigCoreCfgs>;
