---
id: guides-openid-connect-providers
title: Configuring OpenID Connect identity providers
---

> **Note**: to use OpenID Connect identity providers your StaticDeploy instance
> must be reachable via https

StaticDeploy can authenticate users using [OpenID Connect](https://openid.net/)
identity providers, such as Azure Active Directory or Google.

In order to enable this authentication strategy, first of all you need to create
a client application in your identity provider. Each identity provider has its
own way of creating the client application (a generally simple process), but in
any case you'll need to:

- set `https://$MANAGEMENT_HOSTNAME/?oidcRedirect=true` AND
  `https://$MANAGEMENT_HOSTNAME/?oidcSilentRedirect=true` as **redirect (or
  callback) uri-s**, where `MANAGEMENT_HOSTNAME` is the hostname you used when
  starting the **staticdeploy** service
- enable the [implicit grant flow](https://oauth.net/2/grant-types/implicit/)
  (if not enabled by default)

Once the client application has been created, the provider will give you:

- a **client id**, an identifier for the application
- a **configuration url** (something like
  `https://example.com/.well-known/openid-configuration`), where StaticDeploy
  will be able to find the necessary configurations to use the identity provider

You then need to pass these info when starting the `staticdeploy` service via
the following environment variables:

- `OIDC_CONFIGURATION_URL`
- `OIDC_CLIENT_ID`

You can also pass the environment variable `OIDC_PROVIDER_NAME`, which is the
name that you want to display in the _Login with \$OIDC_PROVIDER_NAME_ button of
the Management Console. Users registered with the identity provider can now
login to StaticDeploy simply by clicking on the button.
