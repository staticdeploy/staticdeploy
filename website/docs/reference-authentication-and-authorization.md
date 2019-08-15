---
id: reference-authentication-and-authorization
title: Authentication and authorization
---

## Auth flow

The following diagram synthesizes StaticDeploy's authentication and
authorization flow:

<div class="paddedDocsImage">
  <img
    src="../images/authentication-and-authorization-flow.svg"
    alt="StaticDeploy Authentication And Authorization Flow"
  />
</div>

Before calling the StaticDeploy management API, a user needs to get an
authentication token that certifies their identity. StaticDeploy is not an
identity provider (IdP), so an external IdP is needed to issue such tokens, that
StaticDeploy is then able to verify.

Currently two types of identity providers are supported:

- OpenID Connect IdPs, such as Azure Active Directory or Github, that issue JWT
  `id_token`-s. Users can obtain such tokens by simply clicking on the **Login
  with external provider** button in the StaticDeploy management console.
  StaticDeploy is able to validate these tokens by verifying their cryptographic
  signature with the public key of the IdP (for details, see the
  [guide to configure StaticDeploy to use an OpenID Connect provider](/docs/guides-openid-connect-providers))

- IdPs that issue JWTs _in some other way_. Users have to manually obtain such
  tokens, which they can then use with the StaticDeploy management console, or
  with the StaticDeploy cli. To enable StaticDeploy to validate these tokens, it
  must be configured with the private or public key used to sign the tokens (for
  details, see the
  [guide to configure StaticDeploy to use JWT-issuing providers](/docs/guides-jwt-providers))

Once the user has an authentication token, they can call the management API. The
authentication token contains two key pieces of information:

- the name of the identity provider that issued the token
- the user id for the identity provider

StaticDeploy uses these two parameters to find the _user object_ corresponding
to the user. The user object contains some StaticDeploy-specific information
about the user, such as the groups the user belongs to. Groups are collections
of roles, simple strings that allow performing certain operations (see below for
details). The user groups, and therefore roles, are then used by the authorizer
to determine wether the user is allowed or not to perform the operation for
which they have called the management API.

## Roles

StaticDeploy authorizes operations using the following roles:

- `root`: allows performing all operations
- `app-manager:appId`: allows performing the following operations on the app
  with the specified id:
  - updating the app
  - deleting the app
  - creating entrypoints linked to the app (provided the necessary
    `entrypoint-creator` role, as you can read below)
  - updating entrypoints linked to the app
  - deleting entrypoints linked to the app
- `entrypoint-creator:urlMatcher`: allows creating entrypoints with the
  specified `urlMatcher`
- `entrypoint-manager:entrypointId`: allows performing the following operations
  on the entrypoint with the specified id:
  - updating the entrypoint
  - deleting the entrypoint
- `bundle-manager:bundleName`: allows performing the following operations on
  bundles with the specified name:
  - creating a bundle
  - deleting a bundle
