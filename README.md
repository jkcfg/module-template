# NPM module template

This repository contains a [`jk`][jk] script that generate build files for
NPM modules.

## Module definition

A module is defined as a YAML document:

```yaml
module:
  name: grafana
  description: Write grafana dashboards with TypeScript
  version: 0.1.0
```

## Build generation

To generate build files from the top level module definition, run:

```console
jk generate -f grafana.yaml /path/to/module-template/module.js
```

Where `grafana.yaml` holds the template definition.
