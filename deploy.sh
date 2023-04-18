#!/bin/bash
##Script to push p5 sketch to bonewitz.net

# Set variables
LOCAL_PATH="$(dirname "$0")"  # Get the directory of the script
REMOTE_PATH="/srv/http/p5/psychedelic"
REMOTE_USER="jbfly"
REMOTE_HOST="bonewitz.net"

# Rsync the files to the remote server
rsync -avz --delete "$LOCAL_PATH/" "$REMOTE_USER@$REMOTE_HOST:$REMOTE_PATH/"

# Connect to the remote server and change the group ownership and permissions
ssh "$REMOTE_USER@$REMOTE_HOST" "chgrp -R http $REMOTE_PATH && chmod -R g+w $REMOTE_PATH"
