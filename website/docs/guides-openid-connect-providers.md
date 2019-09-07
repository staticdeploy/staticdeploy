---
id: guides-openid-connect-providers
title: Configuring OpenID Connect identity providers
---

StaticDeploy can authenticate users using [OpenID Connect](https://openid.net/)
providers, such as Azure Active Directory, Google, or GitHub.

In order to enable this authentication strategy, first of all we need to create
a client application in our identity provider. Each identity provider has its
own way of creating the client application, but it's generally a fairly simple
process, at the end of which the provider will give us:

- a **client id**, a random string identifying the application
- a **configuration url** (something like
  `https://example.com/.well-known/openid-configuration`), where StaticDeploy
  will be able to find the necessary configurations to use the identity provider

We then need to pass these info when starting the `staticdeploy` service via the
following environment variables:

- `OIDC_CONFIGURATION_URL`
- `OIDC_CLIENT_ID`

We can also pass the environment variable `OIDC_PROVIDER_NAME`, which is the
name that we want to display in the _Login with \$OIDC_PROVIDER_NAME_ button of
the Management Console. Users registered with the identity provider can now
login to StaticDeploy simply by clicking on the button.
