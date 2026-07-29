# Contributing to Open Prime

Open Prime is a community-driven continuation of PrimeNG. This is not an official fork of the `primefaces/primeng` repository — it's a fresh repository seeded with PrimeNG's code and history, now maintained by the community. Any help is welcome, whether it's fixing bugs, adding features, improving docs, or triaging issues.

## Bringing over a PR you already opened on PrimeNG

If you had a pull request open on `primefaces/primeng` that wasn't merged (or won't be, now that PrimeNG has moved to its next chapter), you can recreate it here with its original commits and history intact, instead of redoing the work from scratch.

**The quick way — apply the patch:**

1. Append `.patch` to your original PR URL, e.g. `https://github.com/primefaces/primeng/pull/19547.patch`, and download the file.
2. Clone this repo and create a branch off `master`.
3. Apply the patch:
   ```bash
   git am < 19547.patch
   ```
4. Push your branch and open a PR here.

If `git am` fails because the patch doesn't apply cleanly (files diverged), fall back to `git apply --reject 19547.patch` to apply what it can, then manually resolve the `.rej` hunks.

## Development setup

This is a pnpm-based monorepo.

```bash
pnpm run setup   # clean install + git hooks
pnpm run dev     # run the showcase app locally
```

Useful scripts:

| Command | Purpose |
|---|---|
| `pnpm run build:lib` | Build the `primeng` package |
| `pnpm run lint` / `pnpm run lint:fix` | Lint |
| `pnpm run format` / `pnpm run format:check` | Prettier |
| `pnpm run test:unit` | Unit tests |
| `pnpm run test:coverage` | Unit tests with coverage |

## Making a change

1. Fork this repo and create a branch from `master`.
2. Make your change, keeping it scoped — smaller, focused PRs are easier to review and merge.
3. Add or update unit tests for the affected component(s).
4. Run `pnpm run lint` and `pnpm run test:unit` before opening the PR.
5. Follow [Conventional Commits](https://www.conventionalcommits.org/) for commit messages (`fix:`, `feat:`, `chore:`, ...) — this is enforced via commitlint.
6. If your change affects a published package (`packages/*`), run `pnpm changeset` and commit the generated file. Pick the bump type (`patch` for fixes, `minor` for features, `major` for breaking changes) and write the summary for library users — it becomes the changelog entry. Docs-only or CI-only changes don't need one.
7. Open a PR describing the change and, if it fixes a bug, the steps to reproduce it.

## Releasing (maintainers)

Releases are fully automated by the [Release workflow](.github/workflows/release.yml) using [Changesets](https://github.com/changesets/changesets). No tags to push, no versions to pick:

1. PRs land on `main` carrying changeset files (see "Making a change" above).
2. The workflow keeps a **"Version Packages" PR** open that applies all pending changesets: it bumps every `@openng/*` package in lockstep (they are `fixed` in `.changeset/config.json`), prepends the aggregated section to the root `CHANGELOG.md` (via `pnpm run version`) and deletes the applied changeset files.
3. **Merging that PR is the release.** The workflow builds the packages, publishes them to npm, tags the release (`<version>`, matching this repo's historical unprefixed tags) and creates a GitHub release with the changelog section as notes.

**Prereleases:** while `.changeset/pre.json` is committed, every release is an rc (`1.0.0-rc.N`) published under the `rc` dist-tag. When ready to cut the stable release:

```bash
pnpm changeset pre exit   # then commit and merge; the next Version Packages PR is 1.0.0
```

(Re-enter later with `pnpm changeset pre enter <tag>` for a future beta/rc cycle.)

Publishing authenticates via [npm trusted publishing (OIDC)](https://docs.npmjs.com/trusted-publishers/) — no npm token is stored in the repository or its secrets. Each `@openng/*` package must have a trusted publisher configured on npmjs.com pointing at this repository and the `release.yml` workflow file; renaming that file breaks publishing until the configuration is updated.

Notes:

- Versions that already reached npm cannot be republished; if a publish run fails halfway, re-run the workflow — already-published packages are skipped, tagging and the GitHub release are idempotent.
- Preview what the next release will look like with `pnpm changeset status` (pending changesets) or by inspecting the Version Packages PR diff.
- The repo setting **"Allow GitHub Actions to create and approve pull requests"** (Settings → Actions → General) must stay enabled for the Version Packages PR to be created.
- Consider installing the [changeset-bot](https://github.com/apps/changeset-bot) GitHub app: it comments on PRs that are missing a changeset without blocking them.

## Reporting issues

Open an issue with a clear description and, ideally, a minimal reproduction (StackBlitz, CodeSandbox, or a small repo). For bugs, include the PrimeNG/Open Prime version, Angular version, and browser.

## Questions

If anything about the workflow is unclear, open a discussion or issue — improving this guide itself is a welcome contribution too.
