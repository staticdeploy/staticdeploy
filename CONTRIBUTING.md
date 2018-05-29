## System requirements

- [nodejs >= 8](https://nodejs.org/en/)
- [yarn](https://yarnpkg.org) (used for managing dependencies)

## Setup

After cloning the repository, from the project's root directory run `yarn` to
install packages.

From the project's root directory, you can run the following npm scripts:

- `yarn lint`: runs each subproject's code linters
- `yarn test`: runs each subproject's tests
- `yarn coverage`: runs each subproject's tests, calculates global code coverage
- `yarn compile`: compiles each subproject's code
- `yarn lerna ...`: runs lerna with the supplied command line options

Each subproject defines its own npm scripts, which you can run from the
subproject's directory. Refer to the subproject's **CONTRIBUTING.md** file for
info.

## Installing dependencies

This project uses [yarn](https://yarnpkg.org) and [lerna](https://lernajs.io/)
to manage dependencies.

To install a dependency for a subproject, `cd` into the subproject's directory
and run:

```sh
# use the -D flag for dev dependencies
yarn add my-dependency
```

To install a subproject as a dependency of another subproject, `cd` into the
project's root directory and run:

```sh
# use the --dev flag for dev dependencies
yarn lerna add dependency-subproject --scope=dependant-subproject
```

## Conventions

- [prettier](https://github.com/prettier/prettier) is used to enforce code
  formatting. Installing the prettier extension for your editor of choice is
  **highly recommended**

- commit messages MUST be formatted using the
  [conventional commits commit message guidelines](https://conventionalcommits.org/)
  (committing will fail otherwise).

## Releasing

To release a new version of StaticDeploy, run:

```sh
yarn release
```

This will prompt you for the version number to use, which must be in the format
`X.X.X` (eg `1.0.0`). The command will then:

- update all versions of all sub-packages
- update the versions in the top level `package.json` and in `lerna.json`
- commit the changes
- tag the commit as `vX.X.X`

Then, push everything to the default remote:

```sh
git push --tags origin master
```

The CI server (CircleCI) will pick up from here, running tests on the tag,
compiling the code and publishing public modules to npm.
