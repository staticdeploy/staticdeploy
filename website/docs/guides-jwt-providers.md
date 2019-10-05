---
id: guides-jwt-providers
title: Configuring JWT identity providers
---

StaticDeploy can authenticate users using [JWTs](https://jwt.io). In order to
enable this authentication strategy, it's sufficient to pass a
`JWT_SECRET_OR_PUBLIC_KEY` environment variable when starting the `staticdeploy`
service. The variable has to contain the base64-encoded secret (for symmetric
signatures) or public key (for asymmetric signatures) that is used to sign JWTs.

JWTs **MUST** contain the `iss` and `sub` claims, used by StaticDeploy to find
the user object corresponding to the token. (The user object is used to enforce
authorization, see the docs on
[authentication and authorization](/docs/reference-authentication-and-authorization)
for details).

Once the user got ahold of an authentication token, they can either use it with
the StaticDeploy Management Console, setting it into the _Login with JWT_ mask,
or with the StaticDeploy CLI, passing it as the `--apiToken` option.

## Use cases

This strategy is mainly intended to allow a StaticDeploy administrator to play
the role of an identity provider: the admin starts StaticDeploy with a given
`JWT_SECRET_OR_PUBLIC_KEY`, which they then also use to manually generate JWTs
for themselves and other users.

Issuing JWTs in such a way is useful in a few cases, described below.

### On first deploy, issue a JWT for the `root` user

When you start StaticDeploy with an empty database, StaticDeploy creates a first
root user, that can do everything. This user has `idp = $MANAGEMENT_HOSTNAME`
(the configuration env variable), and `idpId = root`. By manually generating a
JWT with `iss = $MANAGEMENT_HOSTNAME` and `sub = root`, you can then login as
the root user (and do things, like creating other users or adding users to
groups).

### Issue JWTs for "machine" users

When using StaticDeploy, you'll probably want to do certain operations (e.g.
creating bundles) from automated environments, like CI servers. StaticDeploy
doesn't support API keys to log in from such environments, but it instead
supports using "machine users".

You can create a machine user from the Management Console, assigning it an
`idp`, an `idpId` (preferably randomly generated), and a `name` to identify it.
You can then manually generate a JWT for that user, that you can use in your
automated environments. If you want to revoke that JWT, you just delete and
re-create the machine user, using the same `name`, but a different `idpId`, so
that the JWT won't work anymore.
