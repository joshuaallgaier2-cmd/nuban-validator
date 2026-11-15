# Contributing

Thanks for helping out. This guide covers how to set up the project and what makes a pull request easy to merge.

## Setup

You need Node.js 18 or later.

```bash
git clone https://github.com/<your-username>/nuban-validator.git
cd nuban-validator
npm install
npm test
```

Other commands:

```bash
npm run typecheck   # TypeScript checks
npm run build       # builds to dist/
npm run test:watch  # reruns tests on save
```

## Before you start

- For anything bigger than a small fix, open an issue first so we can agree on the approach.
- If you want to take an existing issue, comment on it so nobody else picks it up at the same time.

## Pull requests

- Keep each pull request focused on one change.
- Add or update tests for any change in behaviour.
- Make sure `npm run typecheck` and `npm test` pass.
- Update the README if you change the public API.
- Write commit messages in the present tense, for example `Add Python port` or `Fix trimming of bank codes`.

## Adding bank codes

Bank data needs a source we can check. When you add or change a code, link to where it came from in the pull request, ideally a CBN publication or the institution's own site. Pull requests with codes and no source will not be merged.

## Ports to other languages

Ports are welcome. Put each one in its own folder at the root, for example `python/`, with its own README and tests. Use the two CBN examples from `test/nuban.test.ts` as your first test cases.

## Reporting bugs

Open an issue with the account number format, bank code, what you expected and what you got. Please don't post real customer account numbers. Use `buildNuban` to generate a test number that reproduces the problem.

## Code of conduct

By taking part you agree to follow the [Code of Conduct](CODE_OF_CONDUCT.md).

## Releases

Releases are published to npm from GitHub Actions when a version tag is pushed. Only the maintainer cuts releases.

```bash
npm version patch   # or minor, major
git push --follow-tags
```
