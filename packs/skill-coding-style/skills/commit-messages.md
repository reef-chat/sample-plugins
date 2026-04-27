# Commit messages

Use Conventional Commits with a single-line subject and an optional body.

Subject:

- imperative mood: "add", "fix", "refactor" — never "added".
- max 72 characters; no trailing period.
- start with a type from `feat|fix|refactor|chore|docs|test|perf|build|ci|revert`, optionally with a scope.

Examples:

- `feat(plugins): install from git URL`
- `fix(installer): reject symlinks in tarballs`
- `refactor(crypto): centralize sha256 in lib/utils`

Body (optional, separated by a blank line):

- Wrap at 72 columns.
- Explain why, not what — the diff already shows the what.
- Reference issues or PRs at the bottom.
