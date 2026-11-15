# @webship.co/workspace-google-drive

Google Drive for the [Webship Workspace](https://github.com/webship/workspace) dashboard: a
**Sync to Drive** button in the rail of the videos, audio, docs and specs workspaces (and **Sync
test reports** on the test workspace), the `cmd-tools-google-drive-sync.sh` command behind it, a
Google Drive MCP server for Claude Code (`-a register`), and the plugin's own settings file.

Set up per person, from the panel: paste the team's OAuth client id and secret once, press Connect
with your own Google account, and choose a storage folder (any folder, or one in a Google Workspace
shared drive). New and changed files go up in chunks; nothing on Drive is ever deleted, and nothing
already there is replaced until you approve it.

## Use it

```bash
cd ~/workspace
bash core/scripts/plugins.sh --require github:webship/workspace-google-drive
bash core/scripts/plugins.sh --activate google-drive-sync --with-needs
bash core/scripts/plugins.sh --install google-drive-sync     # the command in each workspace, the bash function, the settings file
bash core/scripts/plugins.sh --configure google-drive-sync   # core/config/plugin.google-drive-sync.settings.yml
```

## What it goes with

The Drive button and `cmd-tools-google-drive-sync.sh` are for the folders `videos`, `audio`, `docs`, `specs`, `test` (or the ones named in `plugins.google-drive-sync.workspaces`). On a workspace that has none of them there is nothing to sync yet, so the manifest suggests one (`suggests`: the plugins `video`, `audio`, `docs`, `specs`, `test`): `--require` and `--list` say whether the workspace has one, and nothing is added for you.

## The items it carries

The workspace is container-based (DDEV by default). Each item lands in the folder of its kind, when
that folder is an active workspace folder, is listed there like any other item, and is installed
into Claude Code from there:

| What | Lands in | What it is for |
| --- | --- | --- |
| The agent `google-drive-pusher` | `ai-agents/` | Pushes a folder to Drive with the plugin's command: status, a dry run first, the list shown, and an overwrite only on the person's approval |
| The skill `google-drive-push` | `ai-skills/` | The command with its options and exit codes, what is pushed and what never is, the keys of `plugin.google-drive-sync.settings.yml` |
| The command `/google-drive-preview` | `ai-commands/` | `/google-drive-preview <folder> [<item>]`: what a push would upload. Nothing is written |
| The prompt `google-drive-push-folder` | `ai-prompts/` | The launch command of a session that pushes one folder: status, dry run, your yes, push |

The plugin keeps its one command, `cmd-tools-google-drive-sync.sh`; no other was added. The items use its `-a status`, `--dry-run`, `--folder` and `--overwrite`; registering its Drive server with an AI assistant (`-a register`) is left to this README. The item bodies are plain Markdown any AI command-line assistant can follow; Claude Code is the default shape (frontmatter, the launch command of the prompt).

How the items are laid out and checked: [docs/plugin-items-pattern.md](docs/plugin-items-pattern.md).

## What it needs

It needs the AI folders its items are placed in (`needs`): `ai-agents`, `ai-skills`, `ai-commands` and `ai-prompts`. `--require` says so, `--activate` and `--install` stop until the workspace has them, and `--with-needs` adds what is missing first. A kind whose folder is not an active workspace folder is skipped, and the install says so.

## What the package holds

| Path | What it is |
| --- | --- |
| `src/index.ts` | `register(api)`: the rail button, the panel, the OAuth connect flow, the folder picker, the sync action |
| `src/lib/drive.ts` | The Drive API: folders, listing, chunked uploads, the sync plan |
| `src/lib/context.ts` | Where the workspace is and what the plugin reads: self-contained, so the CLI and the MCP server need no dashboard |
| `src/lib/cli.ts` | `node cli.js sync <workspace> …` and `status`, run by the command |
| `src/lib/mcp.ts` | The MCP server (stdio) |
| `src/lib/reports.ts` | The test-report folders of the test workspace |
| `commands/cmd-tools-google-drive-sync.sh` | The per-workspace command |
| `scripts/functions/fun-drive-sync.sh` | The bash behind it, sourced by bootstrap once installed |
| `config/plugin.google-drive-sync.settings.yml` | The settings template |
| `ai/agents/google-drive-pusher.md` | The agent `google-drive-pusher` |
| `ai/skills/google-drive-push/` | The skill `google-drive-push` |
| `ai/commands/google-drive-preview.md` | The command `/google-drive-preview` |
| `ai/prompts/google-drive-push-folder.md` | The prompt `google-drive-push-folder` |
| `tests/items.test.ts` | The shape of every item, and that it names nothing the plugin does not have |

The `workspacePlugin` block in `package.json` is the manifest the installer reads.
