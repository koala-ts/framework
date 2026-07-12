# Component repository splitting

The framework repository is the only source of truth. Package repositories are read-only Git subtree splits.

- `splitsh.json` maps each package repository to its source directory.
- A source branch is split to a component branch with the same name.
- Major and minor `.0` releases tag every component.
- Patch releases tag only components that changed.
- A GitHub App performs cross-repository writes with the minimum required access.
- Contributions are made to `koala-ts/framework`, not to generated component repositories.
