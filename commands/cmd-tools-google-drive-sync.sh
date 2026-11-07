#!/usr/bin/env bash

# Installed by the Google Drive plugin (plugins.sh --install google-drive-sync); __WORKSPACE__ is the workspace it was installed into.
#
# Push this folder to a Google Drive folder (the dashboard's Sync button), and register the Google Drive MCP server.

# Bootstrap.
# Find the workspace tooling from this script, so a fresh clone needs no setup.
WORKSPACE_SCRIPTS="${WORKSPACE_SCRIPTS:-$(cd "$(dirname "${BASH_SOURCE[0]}")/../core/scripts" && pwd)}";
source ${WORKSPACE_SCRIPTS}/bootstrap.sh || exit 1 ;

# Load workspace settings.
eval $(parse_yaml ${WORKSPACE_CONFIG}/workspace.__WORKSPACE__.settings.yml);

drive_sync_main "${doc_name}" "$@" ;
