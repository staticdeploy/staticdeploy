# @staticdeploy/storage

Module proxying access to storage resources. The module is used by the
**api-server**, which uses it to read from and write to the storage, and by the
**static-server**, which uses it to read from the storage.

Currently StaticDeploy uses the local filesystem to store static files, and
[sqlite](https://www.sqlite.org/) to store metadata about the files, as well as
the other entities of StaticDeploy.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).
