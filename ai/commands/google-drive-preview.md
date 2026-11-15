---
description: Show what a folder of the Webship Workspace would push to Google Drive, without writing anything — whether Drive is configured and connected, the Drive folder chosen, the targets, and the list of files a push would upload.
argument-hint: '<folder> [<item>]'
---

# /google-drive-preview

Show what this folder would push to Google Drive: `$ARGUMENTS`

The first word is the workspace folder: `videos`, `audio`, `docs`, `specs` or `test`. The second
word, when there is one, is one item inside it (a file or a folder) to preview on its own. With no
folder, stop and ask for one.

The workspace is container-based (DDEV by default); the command of the Google Drive plugin
(`@webship.co/workspace-google-drive`) runs on the machine, in the folder. This command only
looks: every run below carries `--dry-run` or reads the status. Never run
`cmd-tools-google-drive-sync.sh` without `--dry-run` here, and never with `--overwrite`.

## 1. Is the command there

```bash
cd ~/workspace/<folder>
ls cmd-tools-google-drive-sync.sh
```

If it is not there, stop: the plugin is not installed, or this folder is not one it serves.

## 2. Is Drive set up

```bash
bash cmd-tools-google-drive-sync.sh -a status
```

Say what it answers: client id and secret set or missing, connected or not, the storage folder,
and for this folder its destination and its targets. If something is missing, say which line and
that it is set in the Sync panel of the dashboard, and stop.

## 3. Look

```bash
bash cmd-tools-google-drive-sync.sh --dry-run
bash cmd-tools-google-drive-sync.sh <item> --dry-run
```

The first when no item was given, the second for one item.

## 4. Report

What would be uploaded, what is already on Drive and unchanged, what was skipped and why, and the
line the command ends with. If the list says a push would replace files or write into folders that
are already on Drive, say that a real push would stop with exit code 3 and wait for the person's
approval.

For the push itself, hand over to the agent `google-drive-pusher`.
