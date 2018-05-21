---
id: guides.deploying-staticdeploy-with-docker-compose
title: Deploying StaticDeploy with docker-compose
---

In this guide we will set up the StaticDeploy platform on a VM using
docker-compose. For this we will need:

* a VM with recent versions of docker and docker-compose installed, allowing
  inbound traffic on ports 80 and 443
* a domain name `staticdeploy.$MY_DOMAIN` pointing to the IP address of the VM

At the end of the guide we will have:

* the StaticDeploy admin console deployed at `https://staticdeploy.$MY_DOMAIN/`
* the StaticDeploy api server deployed at `https://staticdeploy.$MY_DOMAIN/api/`

## The docker compose template

The following docker-compose template can be used to deploy the StaticDeploy
platform:

```yml
version: "3"
services:
  admin-console:
    image: staticdeploy/admin-console:$DOCKER_TAG
    labels:
      - traefik.backend=admin-console
      - traefik.frontend.priority=100
      - traefik.frontend.rule=Host:$HOSTNAME;PathPrefix:/
      - traefik.frontend.entryPoints=http,https
      - traefik.frontend.redirect.entryPoint=https
    environment:
      - APP_CONFIG_API_URL=//$HOSTNAME/api
  api-server:
    image: staticdeploy/api-server:$DOCKER_TAG
    labels:
      - traefik.backend=api-server
      - traefik.frontend.priority=200
      - traefik.frontend.rule=Host:$HOSTNAME;PathPrefixStrip:/api
      - traefik.frontend.entryPoints=http,https
      - traefik.frontend.redirect.entryPoint=https
    environment:
      - HOSTNAME=$HOSTNAME
      - JWT_SECRET=$JWT_SECRET
      - STORAGE_DATABASE_URL=sqlite:///storage/db.sqlite
      - STORAGE_BUNDLES_PATH=/storage/bundles
    volumes:
      - storage:/storage
  static-server:
    image: staticdeploy/static-server:$DOCKER_TAG
    labels:
      - traefik.backend=static-server
      - traefik.frontend.priority=0
      - traefik.frontend.rule=HostRegexp:{host:.*}
      - traefik.frontend.passHostHeader=true
      - traefik.frontend.entryPoints=http
    environment:
      - STORAGE_DATABASE_URL=sqlite:///storage/db.sqlite
      - STORAGE_BUNDLES_PATH=/storage/bundles
    volumes:
      - storage:/storage
  traefik:
    image: traefik
    command: >-
      -c /dev/null --web
      --docker --docker.domain=$HOSTNAME --docker.watch
      --entryPoints='Name:http Address::80'
      --entryPoints='Name:https Address::443 TLS'
      --acme --acme.email=$LE_EMAIL --acme.storage=/etc/traefik/acme/acme.json --acme.httpChallenge.entryPoint=http --acme.entryPoint=https --acme.OnHostRule=true
    ports:
      - 80:80
      - 443:443
      - 8080:8080
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - acme:/etc/traefik/acme
volumes:
  storage: {}
  acme: {}
```

The template sets up the three services that make up the platform, plus a
reverse proxy ([traefik](https://traefik.io/)) to correctly route requests and
to obtain SSL/TLS certificates for the services.

The template needs 4 configuration options, that can be passed to docker-compose
via environment variables, or by setting them in a `.env` file:

* `DOCKER_TAG`: the tag of the containers we wish to deploy. This would
  typically be a specific StaticDeploy version
* `JWT_SECRET`: the secret used to sign/verify authentication tokens
* `HOSTNAME`: the domain for our StaticDeploy deployment
  (`staticdeploy.$MY_DOMAIN`)
* `LE_EMAIL`: the email used to retrieve SSL/TLS certificates from
  [Let's Encrypt](https://letsencrypt.org/) for the domain above

## Running the template

To run the docker-compose template, first we need to login in our VM as a user
with docker privileges.

Then, we create a folder `staticdeploy` and save the template in
`staticdeploy/docker-compose.yml`. We also create a `staticdeploy/.env` file and
specify our configuration options for the template:

```sh
# .env
DOCKER_TAG=v0.6.0
JWT_SECRET=my-secret
HOSTNAME=staticdeploy.$MY_DOMAIN
LE_EMAIL=my-email-address@example.com
```

Finally, we can `cd` into the folder and run `docker-compose up -d` to bring up
the services.

## Generating authentication tokens

To access the admin console, as well as to create and deploy bundles, we need an
authentication token StaticDeploy uses JWTs as authentication tokens, with the
only requirement that tokens must specify a `sub` (subject) claim, which is used
when logging who's been doing what.

We can easily generate JWTs with the **Debugger** widget on
[jwt.io](https://jwt.io).

## Accessing the admin console

Now that we have an authentication token we can access the admin console at
`https://staticdeploy.$MY_DOMAIN`. We can also use the StaticDeploy cli -
pointing it to `https://staticdeploy.$MY_DOMAIN/api/` - to deploy static apps.

For instructions on how to do that, see the guide on
[deploying static apps](/docs/guides.deploying-static-apps.html).
