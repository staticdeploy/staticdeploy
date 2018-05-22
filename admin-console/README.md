# @staticdeploy/admin-console

Web application through which admin users can manage StaticDeploy's entities
(bundles, apps, entrypoints, and operation logs). The console calls the APIs
exposed by StaticDeploy's **api-server**.

## Run

The app is distributed as a Docker image (`staticdeploy/admin-console`) that can
be run without modifications on docker-compose, ECS, Kubernetes, etc.

## Configure

The following environment variables can be used to configure the app:

* `APP_CONFIG_API_URL`: the base URL of the **api-server**

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).
