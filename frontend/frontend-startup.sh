#!/bin/bash

NPX_PATH=/home/ubuntu/.nvm/versions/node/v20.19.4/bin/npx
export NODE_OPTIONS="--openssl-legacy-provider"

sudo env "PATH=$PATH" $NPX_PATH serve -s build -l 443 --ssl-cert "/etc/letsencrypt/live/807.band/fullchain.pem" --ssl-key "/etc/letsencrypt/live/807.band/privkey.pem"
