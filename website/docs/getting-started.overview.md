---
id: getting-started.overview
title: Overview
---

StaticDeploy is an open source platform for deploying and configuring static web
applications and websites. You can think about it as
[kubernetes](https://kubernetes.io) for static content.

StaticDeploy was created with two objectives in mind:

* make it easy to deploy multiple _versions_ of a static application,
  specifically a version for each branch / pull request, so that frontend
  developers can show their work-in-progress and get early feedback from their
  clients

* make it easy to configure a static application at runtime, as opposed to
  injecting the configuration into the static bundles at build time

## Architecture

The architecture of the StaticDeploy platform is fairly simple:

* on the server side we have the services responsible for accepting the static
  content to deploy, allowing configuration of the deployments, and serving the
  static content of the deployments

* on the client side we have a CLI, used to deploy static content, and a web
  application, used to manage deployments

![Architecture](../images/architecture.svg)
