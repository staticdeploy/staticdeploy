[![CircleCI](https://img.shields.io/circleci/project/github/staticdeploy/staticdeploy.svg)](https://circleci.com/gh/staticdeploy/staticdeploy)
[![codecov](https://codecov.io/gh/staticdeploy/staticdeploy/branch/master/graph/badge.svg)](https://codecov.io/gh/staticdeploy/staticdeploy)


<Br>
![logo](./readme-logo.png)
  
  
<Br>
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

- [core](./core): module implementing StaticDeploy's core business logic
  (entities, usecases, and gateway interfaces)
- [pg-s3-storages](./pg-s3-storages): gateway for storage resources backed by
  [S3](https://aws.amazon.com/s3/) and [PostgreSQL]
- [memory-storages](./memory-storages): in-memory gateway for storage resources
- [storages-test-suite](./storages-test-suite): test suite for storages
- [tar-archiver](./tar-archiver): implementation of the core `IArchiver`
  interface using tar
- [jwt-authentication-strategy](./jwt-authentication-strategy): authentication
  strategy for authenticating requests with JWT tokens
- [oidc-authentication-strategy](./oidc-authentication-strategy): authentication
  strategy for authenticating requests with OpenID Connect tokens
- [http-adapters](./http-adapters): adapters that implement an http API for
  StaticDeploy's core usecases
- [serve-static](./server-static): express middleware for serving files in a
  local directory
- [staticdeploy](./staticdeploy): main service pulling together the other
  modules and implementing the StaticDeploy platform
- [sdk](./sdk): browser and nodejs SDK for StaticDeploy's API
- [cli](./cli): CLI tool to deploy static apps
- [management-console](./management-console): web GUI for the API
- [website](./website): landing page and documentation, deployed with
  StaticDeploy on [staticdeploy.io](https://staticdeploy.io)

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md).
