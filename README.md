# Telescoped

A read-only app.net client for personal and user feeds.

# Installation instructions

Clone the repository

> git clone git://github.com/ednapiranha/telescoped.git

> curl http://npmjs.org/install.sh | sh

Install node by using brew or through the website http://nodejs.org/#download

> cd telescoped

> cp local.json-dist local.json

In local.json:

* Change `domain` to your registered app.net domain (if this is a local domain, ensure you have it set in `/etc/hosts`)
* Change `appnet_consumer_key` and `appnet_consumer_secret` to your app.net values for the selected domain

> npm install

Run the site

> node app.js
