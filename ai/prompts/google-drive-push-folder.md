Push the files of a workspace folder to Google Drive: look first, show the list, then push.

```
claude --permission-mode bypassPermissions """
Push the folder <folder> of this workspace to Google Drive
# ~/workspace/<folder> · container-based (DDEV by default) · <folder> is videos, audio, docs, specs or test
# never pass --overwrite unless I said so after seeing the list; never print the client secret or the refresh token
# nothing on Drive is deleted, by the command or by you

1. cd ~/workspace/<folder> ; bash cmd-tools-google-drive-sync.sh -a status
   if the client id and secret are missing, Drive is not connected, or no Drive folder is chosen:
   stop and tell me which, I set it in the Sync panel of the dashboard
2. bash cmd-tools-google-drive-sync.sh --dry-run
   show me what it would upload and the line it ends with, and wait for my yes
3. bash cmd-tools-google-drive-sync.sh
4. read the exit code: 0 done, 1 a file failed (name it), 3 nothing was written
   on 3: show me the list of what would be replaced, and stop

When it is done: how many files went up, how many were already there, and what was skipped.
"""
```

The text between the triple quotes is plain: it can be given to another AI command-line assistant as it is.
