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

* visit http://localhost and log into the app using the following token:

  ```sh
  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyQGV4YW1wbGUuY29tIn0.c47HKO1uUeFRhMuo-MVcXkePYyh9H3ewelA5faCvcm0
  ```

## Publish a static app

* install the StaticDeploy cli:

  ```sh
  npm install --global @staticdeploy/cli
  ```

* deploy the demo static app in `docs/static/demo-static-app`:

  ```sh
  staticdeploy deploy \
    # Address of the server to deploy to
    --apiUrl http://localhost/api \
    # Auth token
    --apiToken eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyQGV4YW1wbGUuY29tIn0.c47HKO1uUeFRhMuo-MVcXkePYyh9H3ewelA5faCvcm0 \
    # App to link the deployment to (will be created if it doens't exist)
    --app demo-static-app \
    # Url at which the deployment will be served
    --entrypoint hello.world/ \
    # Short description of the deployment, could be for instance the last commit message
    --description "First deployment" \
    # Folder to deploy
    --target docs/static/demo-static-app
  ```

* check out the deployment on the StaticDeploy app at http://localhost. You may
  modify the app / entrypoint configuration

* edit your `/etc/hosts` to point `hello.world` to `localhost`:

  ```sh
  # ... content of /etc/hosts
  localhost hello.world
  ```

* visit http://hello.world
