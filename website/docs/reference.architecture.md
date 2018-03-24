---
id: reference.architecture
title: Architecture
---

The architecture of the StaticDeploy platform is fairly simple:

* on the server side we have the services responsible for accepting the static
  content to deploy, allowing configuration of the deployments, and serving the
  static content of the deployments

* on the client side we have a CLI, used to deploy static content, and a web
  application, used to manage deployments

![Architecture](../images/architecture.svg)
