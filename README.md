[![CircleCI](https://img.shields.io/circleci/project/github/staticdeploy/staticdeploy.svg)](https://circleci.com/gh/staticdeploy/staticdeploy)
[![codecov](https://codecov.io/gh/staticdeploy/staticdeploy/branch/master/graph/badge.svg)](https://codecov.io/gh/staticdeploy/staticdeploy)

# StaticDeploy

StaticDeploy is an open-source platform for deploying and configuring static web
applications and websites. We can think about it as a
[Kubernetes](https://kubernetes.io/) for static content.

StaticDeploy was created with two objectives in mind:

- make it easy to configure a static app at runtime, as opposed to injecting the
  configuration into its static build

- make it easy to deploy multiple "versions" of a static app, specifically a
  version for each branch / pull request, so that frontend developers can show
  their work-in-progress and get early feedback from their clients

For more information on StaticDeploy visit
[staticdeploy.io](https://staticdeploy.io).

## Projects

This is the StaticDeploy monorepo, which includes several different projects:

**[Server side]**

- [storage](./storage): module proxying access to storage resources
- [api-server](./api-server): service implementing the API to manage
  StaticDeploy's entities
- [static-server](./static-server): service responsible for serving and
  configuring static content to end users

**[Client side]**

- [sdk](./sdk): browser and nodejs SDK for StaticDeploy's API
- [cli](./cli): CLI tool to deploy static apps
- [admin-console](./admin-console): web GUI for the API

**[Shared]**

- [common-types](./common-types): TypeScript types for StaticDeploy's entities

**[Documentation]**

- [website](./website): landing page and documentation, deployed with
  StaticDeploy on [staticdeploy.io](https://staticdeploy.io)

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md).
