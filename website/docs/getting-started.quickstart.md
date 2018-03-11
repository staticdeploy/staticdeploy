---
id: getting-started.quickstart
title: Quickstart
---

## Set up StaticDeploy with docker-compose

* clone the repository:

  ```sh
  git clone https://github.com/staticdeploy/staticdeploy.git
  ```

* start the services:

  ```sh
  cd staticdeploy
  docker-compose up -d
  ```

* visit [local.staticdeploy.io](http://local.staticdeploy.io) and log into the
  admin console using the following token:

  ```sh
  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.t-IDcSemACt8x4iTMCda8Yhe3iZaWbvV5XKSTbuAn0M
  ```

  (note: `local.staticdeploy.io` points to `127.0.0.1`)

## Publish a static app

* install the StaticDeploy cli:

  ```sh
  npm install --global @staticdeploy/cli
  ```

* configure the cli using environment variables:

  ```sh
  export STATICDEPLOY_API_URL=http://local.staticdeploy.io/api
  export STATICDEPLOY_API_TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.t-IDcSemACt8x4iTMCda8Yhe3iZaWbvV5XKSTbuAn0M
  ```

* create a bundle for the demo static app in `website/demo-static-app`:

  ```sh
  staticdeploy create-bundle \
    --from website/demo-static-app
    --name demo-static-app \
    --tag master \
    --description "version 1.0.0" \
  ```

* deploy the bundle to `demo-static-app.staticdeploy.io`:

  ```sh
  staticdeploy deploy \
    --app demo-static-app \
    --entrypoint demo-static-app.staticdeploy.io/ \
    --bundle demo-static-app:master
  ```

* visit
  [demo-static-app.staticdeploy.io](http://demo-static-app.staticdeploy.io)
  (note: `demo-static-app.staticdeploy.io` points to `127.0.0.1`)

* check out the deployment on the admin console at
  [local.staticdeploy.io](http://local.staticdeploy.io). Try modifying the
  entrypoint configuration and see how
  [demo-static-app.staticdeploy.io](http://demo-static-app.staticdeploy.io)
  changes
