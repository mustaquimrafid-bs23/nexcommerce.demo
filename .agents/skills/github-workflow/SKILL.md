---
name: github-workflow
description: Use when committing changes, managing git branches, creating pull requests with the GitHub CLI, or configuring GitHub Actions CI/CD workflows for automation.
---

# GitHub Workflow & CI/CD Standards

## Overview
A clean, reliable Git and GitHub workflow keeps our codebase stable, organized, and easy for the entire team to understand. Every change moves through clear stages: a focused branch, small conventional commits, automated test checks, and peer-reviewed Pull Requests (PRs).

---

## When to Use

### Triggering Conditions
- Creating new feature branches or bugfix branches.
- Writing git commit messages for completed tasks.
- Preparing, creating, or reviewing GitHub Pull Requests (PRs).
- Automating tests and builds using GitHub Actions (`.github/workflows/`).
- Managing issues or releases using the GitHub CLI (`gh`).

### When NOT to Use
- Purely local experiments or scratch test scripts that will not be committed to source control.
- Answering theoretical questions about git commands without touching the repository.

---

## 1. The 5-Step Git Lifecycle

```
1. Branch          2. Build & Test         3. Conventional Commit        4. Pull Request (gh)         5. CI Automation
[feature/xxx] ---> [npm test passes]  ---> [feat(cart): add drawer] ---> [gh pr create]       ---> [GitHub Actions Pass]
```

1. **Branch off `main` or develop branch**: Keep branches short-lived and focused on one task.
2. **Build and test locally**: Always verify that `npm test` and `npm run build` pass before pushing.
3. **Commit with Conventional Commits**: Clearly describe *what* changed and *why*.
4. **Open a PR with GitHub CLI (`gh`)**: Include clear summary, testing proof, and screenshots.
5. **Verify CI/CD Status**: Ensure automated checks pass green before merging.

---

## 2. Conventional Commit Standards

Every commit message must follow the Conventional Commits specification. Use everyday, simple English:

### Format
```text
<type>(<scope>): <short description in present tense>

[optional body explaining why this change was needed]

[optional footer, e.g. Closes #123]
```

### Approved Types

| Type | When to Use | Example |
| :--- | :--- | :--- |
| **`feat`** | Adding a new feature or user-facing capability | `feat(cart): add free shipping progress meter` |
| **`fix`** | Fixing a bug or unexpected behavior | `fix(checkout): prevent double submission on slow networks` |
| **`refactor`** | Code change that neither fixes a bug nor adds a feature | `refactor(store): migrate cart state to store provider` |
| **`perf`** | Code change that improves performance or load speed | `perf(hero): preload editorial banner image for lower LCP` |
| **`test`** | Adding new tests or fixing existing tests | `test(order): add boundary tests for 0-item cancellation` |
| **`style`** | Changes to formatting, white-space, or styling tokens | `style(theme): update luxury gold accent color tokens` |
| **`docs`** | Documentation only changes | `docs(readme): add local setup and testing guide` |
| **`chore`** | Updating dependencies, build scripts, or config | `chore(deps): update next and tailwind dependencies` |

---

## 3. GitHub CLI (`gh`) Command Reference

Use the GitHub CLI (`gh`) for fast, clean GitHub operations without leaving your terminal:

### Creating a Pull Request
```bash
# Push your current branch to GitHub
git push -u origin HEAD

# Create a PR interactively or with title and body
gh pr create --title "feat(cart): add luxury mini-cart drawer" --body "## Summary
- Implemented slide-over cart drawer with smooth GPU motion.
- Added coupon validation and free shipping progress meter.

## Verification
- Ran 24 regression test suites (all passed).
- Tested mobile (375px) and desktop (1440px) viewports."
```

### Viewing and Reviewing PRs
```bash
# List open PRs
gh pr list

# View PR details and checks
gh pr view 123

# Check status of CI/CD GitHub Actions runs
gh pr checks
```

---

## 4. GitHub Actions CI/CD Pipeline Template

For Next.js 15 + TypeScript + Vitest projects, save this automated check file as `.github/workflows/ci.yml`:

```yaml
name: Continuous Integration (CI)

on:
  push:
    branches: [main, develop, ubgrade]
  pull_request:
    branches: [main, develop, ubgrade]

jobs:
  validate-and-test:
    name: Build & Automated Tests
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install Dependencies
        run: npm ci

      - name: Run TypeScript & Linter Check
        run: npm run build

      - name: Run Automated Test Suites
        run: npm test
```

---

## 5. Critical Git & GitHub Rules

1. **Never Commit Secrets**: Do not commit API keys, `.env` files with private tokens, or sensitive credentials. Ensure `.gitignore` includes `.env*` and `.env.local`.
2. **Never Force Push to Shared Branches**: Do not run `git push --force` on `main`, `master`, or shared release branches.
3. **Verify Before Staging**: Run `git status` and `git diff` before `git add` to avoid accidentally staging junk files, logs, or temporary scratch files.
4. **Keep Commits Atomic**: One commit should do one logical thing. Do not bundle an unrelated bugfix with a massive UI redesign in a single commit.
