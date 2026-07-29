# Changesets

This folder is managed by [Changesets](https://github.com/changesets/changesets), which drives versioning and npm publishing for this repo.

When your PR changes anything published to npm (`packages/*`), add a changeset describing the change:

```bash
pnpm changeset
```

All `@openng/*` packages are versioned in lockstep (see `fixed` in `config.json`), so picking any package is enough — the bump type (`major` / `minor` / `patch`) and the summary you write are what matter. The summary ends up in `CHANGELOG.md` and in the GitHub release notes, so write it for users of the library.

Docs-only or CI-only changes don't need a changeset.

See [CONTRIBUTING.md](../CONTRIBUTING.md#releasing-maintainers) for how releases are cut from these files.
