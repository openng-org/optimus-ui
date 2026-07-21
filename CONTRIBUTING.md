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
pnpm run dev     # run the docs app locally
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
6. Open a PR describing the change and, if it fixes a bug, the steps to reproduce it.

## Reporting issues

Open an issue with a clear description and, ideally, a minimal reproduction (StackBlitz, CodeSandbox, or a small repo). For bugs, include the PrimeNG/Open Prime version, Angular version, and browser.

## Questions

If anything about the workflow is unclear, open a discussion or issue — improving this guide itself is a welcome contribution too.
