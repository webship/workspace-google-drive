# @webship/workspace-google-drive

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
bash core/scripts/plugins.sh --activate google-drive-sync
bash core/scripts/plugins.sh --install google-drive-sync     # the command in each workspace, the bash function, the settings file
bash core/scripts/plugins.sh --configure google-drive-sync   # core/config/plugin.google-drive-sync.settings.yml
```

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

The `workspacePlugin` block in `package.json` is the manifest the installer reads.
