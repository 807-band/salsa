#!/bin/bash

cd ~/salsa/angular-test-app/dist/angular-test-app/browser
npx serve -s . -l 444 \
  --ssl-cert "/etc/letsencrypt/live/807.band/fullchain.pem" \
  --ssl-key "/etc/letsencrypt/live/807.band/privkey.pem"
