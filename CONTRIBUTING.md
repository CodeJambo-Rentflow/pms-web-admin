# Contributing

## Branching Model

We use Trunk-Based Development with short-lived feature branches.

- `main` — Production-ready (protected)
- `feature/*` — New features (≤ 3 days)
- `bugfix/*` — Bug fixes (≤ 2 days)
- `hotfix/*` — Production emergencies (≤ 1 day)

## Commit Convention

We use Conventional Commits:

    <type>(<scope>): <subject>

Types: feat, fix, docs, style, refactor, perf, test, chore, ci, build.

## Pull Request Process

1. Create a feature branch from main
2. Make changes following the coding standards
3. Run pre-commit run --all-files locally
4. Push branch and open a PR
5. PR requires 2 approvals and all CI checks green
6. Squash-merge to keep history clean
7. Delete the feature branch after merge

## Local Setup

    pip install pre-commit
    pre-commit install
    pre-commit install --hook-type commit-msg
    pre-commit run --all-files
