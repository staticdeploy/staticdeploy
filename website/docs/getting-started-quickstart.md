---
id: getting-started-quickstart
title: Quickstart
---

For this quickstart you'll need:

- a recent version of [docker](https://docs.docker.com/install/)
- a recent version of [nodejs](https://nodejs.org/en/)

## Set up StaticDeploy with docker

- start StaticDeploy:

  ```sh
  docker run --rm --init \
    -e MANAGEMENT_HOSTNAME=local.staticdeploy.io \
    -e ENFORCE_AUTH=false \
    -p 80:80 \
    staticdeploy/staticdeploy
  ```

- visit the Management Console at
  [local.staticdeploy.io](http://local.staticdeploy.io/) (which points to
  `127.0.0.1`)

## Publish a static app

- install the StaticDeploy CLI:

  ```sh
  npm install --global @staticdeploy/cli
  ```

- configure the CLI using environment variables:

  ```sh
  export STATICDEPLOY_API_URL=http://local.staticdeploy.io/api
  ```

- clone the StaticDeploy repository and `cd` into it:

  ```sh
  git clone https://github.com/staticdeploy/staticdeploy.git
  cd staticdeploy
  ```

- create a bundle for the demo static app in `website/demo-static-app`:

  ```sh
  staticdeploy bundle \
    --from website/demo-static-app \
    --name demo-static-app \
    --tag master \
    --description "version 1.0.0"
  ```

- deploy the bundle to `demo-static-app.staticdeploy.io`:

  ```sh
  staticdeploy deploy \
    --app demo-static-app \
    --entrypoint demo-static-app.staticdeploy.io/ \
    --bundle demo-static-app:master
  ```

- visit
  [demo-static-app.staticdeploy.io](http://demo-static-app.staticdeploy.io/)
  (which also points to `127.0.0.1`)

- check out the deployment on the Management Console at
  [local.staticdeploy.io](http://local.staticdeploy.io/). Try modifying the
  entrypoint configuration and see how
  [demo-static-app.staticdeploy.io](http://demo-static-app.staticdeploy.io/)
  changes
