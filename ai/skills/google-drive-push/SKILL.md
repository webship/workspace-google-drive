---
name: google-drive-push
description: Push a folder of a Webship Workspace to Google Drive through the Google Drive plugin (`@webship.co/workspace-google-drive`) — the Sync to Drive button and the command behind it, `cmd-tools-google-drive-sync.sh`, with its options and exit codes, what is pushed and what never is, the keys of `plugin.google-drive-sync.settings.yml` (targets, destinations, the storage folder, the locations of the folder picker), and how to read its status. Use when asked "push the docs folder to Drive", "what would be uploaded", "why is nothing pushed", "it exits with 3", "choose another Drive folder for videos", "sync the test reports", or "is Drive connected".
argument-hint: '<folder> [<item>]'
---

# google-drive-push

Google Drive for the folders of a Webship Workspace (`~/workspace`, container-based, DDEV by
default). It comes with the Google Drive plugin (`@webship.co/workspace-google-drive`), like the
agent `google-drive-pusher`, the command `/google-drive-preview` and the prompt
`google-drive-push-folder`. In the workspace the plugin is named `google-drive-sync`.

## What the plugin puts on the dashboard

| Button | Where | What it does |
| --- | --- | --- |
| **Sync to Drive** | The pages of the folders `videos`, `audio`, `docs` and `specs` | Opens the Sync panel of the folder: connect, choose the Drive folder, edit the targets, preview, push |
| **Sync test reports** | The page of the folder `test` | The same, for the report, the failure screenshots and the recordings of each project's test runs |

Setting up is done once per person, in that panel: paste the OAuth client id and secret, press
Connect with your own Google account, choose a storage folder.

## The command

`cmd-tools-google-drive-sync.sh` is placed in each of those folders that is active in the
workspace, and is what the button runs.

```bash
cd ~/workspace/<folder>
bash cmd-tools-google-drive-sync.sh -a status                # configured? connected? the folder and the targets of each workspace folder
bash cmd-tools-google-drive-sync.sh --dry-run                # list what the targets select; nothing is written
bash cmd-tools-google-drive-sync.sh                          # push what the targets select
bash cmd-tools-google-drive-sync.sh <item> --dry-run         # one named item, whatever the targets
bash cmd-tools-google-drive-sync.sh <item>                   # push it, into a Drive folder of its own name
bash cmd-tools-google-drive-sync.sh --folder <id or link>    # push there instead of the folder's destination
bash cmd-tools-google-drive-sync.sh --overwrite              # the approval: see the exit codes
```

| Exit code | What it means |
| --- | --- |
| `0` | Done, or a dry run that listed |
| `1` | A file failed, or Drive is not set up for this folder (the message says which) |
| `3` | Nothing was written: the push would replace a file or write into a sub folder that is already on Drive. It listed them, and waits for `--overwrite` |

New and changed files go up, in chunks, so large files are fine. Nothing on Drive is ever deleted,
and nothing already there is replaced until `--overwrite` is given.

## What is pushed, and what never is

Only files that match a target of the folder are pushed; a folder with no target pushes nothing.
A target with no slash matches at any depth (`*.mp4`); with a slash it matches from the root of
the folder (`guide/*.pdf`); a folder (`guide/`) means everything in it. The `test` folder pushes
its test reports and needs none.

Never pushed, whatever the targets: hidden files and folders, `cmd-*.sh`, the folder's own
`AGENTS.md`, `CLAUDE.md`, `README.md` and `*.code-workspace`, files whose name says they hold a
password or a key, the patterns of `exclude:`, and symbolic links. Small text files are read
before they go up, and one that gives away a private key, a token or a password is skipped and
named in the output.

## The settings: `core/config/plugin.google-drive-sync.settings.yml`

| Key | What it is |
| --- | --- |
| `client_id:`, `client_secret:` | The OAuth client of the team, from the Google Cloud Console. Pasted in the panel. |
| `refresh_token:` | Written by the dashboard when the person connects. Never typed, never copied. |
| `account:` | Whose Drive this is: the Google address that is pre-selected when connecting. |
| `scope:` | The Drive scope the connection asks for. |
| `redirect_uri:` | Empty means the address of the dashboard's own callback. |
| `locations:` | Where the folder picker looks: `my_drive` by default; `shared_with_me`, `shared_drives`, `starred`, `recent` can be added. |
| `root_folder:` | The storage folder: every workspace folder stores into `<root_folder>/<folder>`. |
| `destinations:` | A Drive folder of its own for one workspace folder, by its key: `videos:`, `audio:`, `docs:`, `specs:`, `test:`. It overrides the storage folder. |
| `sources:` | What a folder pushes when it is not its whole content: `test:` is `test-reports`. |
| `targets:` | The targets of each folder: only files that match are pushed. |
| `exclude:` | Names and paths that are never pushed, on top of the built-in list. |

The file is created mode 600; the secret and the token are shown as empty fields on the Settings
page. Never print them, never copy them into another file, and never commit the file.

## Turn it on

```bash
cd ~/workspace
bash core/scripts/plugins.sh --require @webship.co/workspace-google-drive
bash core/scripts/plugins.sh --activate google-drive-sync --with-needs     # adds the AI folders its items land in
bash core/scripts/plugins.sh --install google-drive-sync
bash core/scripts/plugins.sh --configure google-drive-sync
```

The command is placed only in the folders `videos`, `audio`, `docs`, `specs` and `test` that the
workspace has; with none of them there is nothing to push yet.

## Traps

- **"No Drive folder chosen for <folder>"**: neither `root_folder:` nor a destination for the
  folder is set. It is chosen in the Sync panel.
- **Nothing is pushed and nothing fails**: the folder has no target. The status line of the
  folder says `targets: (none: nothing is pushed)`.
- **Exit code `3` is not an error to retry**: it is a question for the person. `--overwrite` is
  their answer.
- **A starred folder that lives in a shared drive** needs `shared_drives` in `locations:` as well.
