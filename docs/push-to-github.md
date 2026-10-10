# Push this codebase to GitHub — Windows PowerShell

Run these steps yourself, one section at a time. This guide does not create commits, change Git settings, install skills or upload anything on your behalf.

## 1. Understand the current local state

Inspected on 2026-10-10:

| Setting             | Value                                                              |
| ------------------- | ------------------------------------------------------------------ |
| Git repository root | `C:\Users\Sartima kumari\Desktop\UI-templates\ui-factory-registry` |
| Current branch      | `master`                                                           |
| Local commits       | None yet                                                           |
| Tracked files       | None yet; project files are untracked                              |
| Existing remote     | `origin`                                                           |
| Remote URL          | `https://github.com/prathimakumari/ui-factory-registry.git`        |

The local remote setting does not prove that the GitHub repository exists, is empty, or that your account can write to it. Step 4 checks that. Do not run `git init` in the parent `UI-templates` folder: the application already has its own Git repository.

## 2. Open the correct folder and check tools

```powershell
cd "C:\Users\Sartima kumari\Desktop\UI-templates\ui-factory-registry"
git --version
node --version
pnpm --version
git rev-parse --show-toplevel
git status --short
git branch --show-current
git remote -v
```

The repository root should match the folder above. If `pnpm` is unavailable on PATH on this machine, use `& "$env:APPDATA\npm\pnpm.cmd"` instead of `pnpm`. If PowerShell blocks `pnpm.ps1`, use `pnpm.cmd`.

Set your commit identity if needed. Replace the example values before running:

```powershell
git config user.name "YOUR NAME"
git config user.email "YOUR VERIFIED OR GITHUB NOREPLY EMAIL"
```

These settings apply only to this repository and identify commits; they do not sign you into GitHub. Your GitHub email settings show your account's exact noreply address.

## 3. Confirm the destination on GitHub

Sign into GitHub and open [your configured repository](https://github.com/prathimakumari/ui-factory-registry). If it does not exist, create a repository with that name under the correct account. Choose the visibility you want. For this first-upload workflow, leave README, `.gitignore` and license initialization unchecked so the remote starts empty.

Your `origin` is already configured. Only if you intentionally choose a different destination, replace it:

```powershell
git remote set-url origin https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
git remote -v
```

Only if `origin` is absent, use `git remote add origin ...` instead. Do not run both commands indiscriminately. GitHub's [existing-code upload guide](https://docs.github.com/en/migrations/importing-source-code/using-the-command-line-to-import-source-code/adding-locally-hosted-code-to-github) describes this workflow.

## 4. Check whether the remote is empty

```powershell
git ls-remote origin
if ($LASTEXITCODE -ne 0) { throw "Remote check failed. Fix the URL or authentication before continuing." }
```

- **Success with no output:** the remote advertises no refs. Continue with steps 5–8.
- **Commit hashes and refs appear:** the remote already contains history. Complete steps 5–6 to save your local work, then use section 10 instead of the empty-remote push.
- **Repository not found or access denied:** check the URL, signed-in account and permission. A private repository can also report not found when authentication is missing.

For HTTPS, use Git Credential Manager's sign-in flow if offered. A GitHub account password is not accepted for Git operations; use supported credential-manager, token or SSH authentication. Do not put a token in the remote URL. See [GitHub authentication](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/about-authentication-to-github).

## 5. Check the project before saving it

From the repository root:

```powershell
pnpm install --frozen-lockfile
pnpm registry:generate
pnpm registry:validate
pnpm typecheck
pnpm lint
pnpm test
pnpm build
pnpm registry:build
pnpm test:e2e
```

Stop and fix any failed command before continuing. If Chromium is missing, run `pnpm exec playwright install chromium`, then rerun the browser tests.

If you changed native source, also check its independent package:

```powershell
cd mobile
pnpm install --frozen-lockfile
pnpm exec expo install --check
pnpm typecheck
pnpm export:web
pnpm export:native
cd ..
pnpm exec playwright test --config playwright.native.config.ts
```

Native bundles do not replace real-device testing. You can upload source without starting development servers.

The existing `.gitignore` excludes dependencies, build output, local export folders, test reports and `.env` files. Keep both package lockfiles, `mobile/generated/`, registry source/generated metadata, public assets, tests and docs. They are part of the reusable project. Keep the existing asset credits and third-party notices with the source.

## 6. Stage, review and make the first commit

```powershell
git add .
git diff --cached --stat
git diff --cached --name-only
git status --short
```

Review what you are about to upload, including configuration files and any newly installed skill files. Credentials, local `.env` files, `node_modules/`, `.next/`, `.expo/`, `dist/` and `dist-native/` should not be staged. A `.gitignore` rule does not remove a file that was already tracked.

If an unwanted file is staged in this repository's first commit, remove it only from the index with its exact path, then update `.gitignore` as appropriate:

```powershell
git rm --cached -- "RELATIVE/PATH/TO/UNWANTED-FILE"
```

That command leaves the working file on disk. Review again, then commit:

```powershell
git commit -m "Initial UI Factory Registry with web and mobile designs"
git log -1 --oneline
```

You should now see a commit hash. If identity is missing, complete step 2 and retry the commit. If Git says nothing to commit, inspect `git status` and `git log -1` instead of assuming there was an error.

## 7. Name the branch main — empty remote only

The branch was `master` when inspected. After the first commit:

```powershell
git branch --show-current
git branch -m main
```

Skip the rename if it is already `main`. If Git reports that a local `main` already exists, inspect `git branch -v` and choose the correct branch; do not overwrite it with a forced rename.

## 8. Push the first commit — empty remote only

```powershell
git push -u origin main
```

Complete authentication if prompted. `-u` records the upstream so later pushes can use `git push`. Refresh the GitHub repository and confirm `README.md`, `app/`, `registry/`, `mobile/`, `docs/` and both lockfiles are present. [Git push reference](https://git-scm.com/docs/git-push).

Verify locally:

```powershell
git status
git log -1 --oneline
git remote -v
```

If the push was rejected because someone added remote history, use section 10. Do not use `git push --force` to bypass that rejection.

## 9. Push later updates

For a repository where you work directly on `main`, start with a clean working tree:

```powershell
git switch main
git pull --ff-only
```

Make your changes, regenerate affected catalogs, run relevant checks, then:

```powershell
git add .
git diff --cached --stat
git diff --cached --name-only
git commit -m "Describe the actual change"
git push
```

For collaboration or protected branches, use a feature branch instead:

```powershell
git switch main
git pull --ff-only
git switch -c feature/new-visual-style
```

After editing and testing:

```powershell
git add .
git diff --cached --stat
git commit -m "Add the new visual style"
git push -u origin feature/new-visual-style
```

Open the repository on GitHub and create a pull request into `main`. Use a fresh descriptive branch name for each new task.

## 10. If GitHub already contains a README or other commits

First make the local commit in step 6. Confirm the remote is the intended project, then inspect its actual branch names and history:

```powershell
git fetch origin
git branch -r
git log --oneline --all --max-count=12
```

The following example assumes the intended destination branch is `origin/main`. Substitute its real branch name if different. Create a fresh import branch and combine the existing histories there:

```powershell
git switch -c import/ui-factory-registry
git merge origin/main --allow-unrelated-histories
```

This permits combining your initial local history with an independently created remote history. It can produce conflicts, especially in README files; it does not silently choose which version is correct.

If conflicts appear, open them in VS Code, preserve the intended content from both sides, remove conflict markers, save, and run:

```powershell
git status
git add .
git diff --cached --stat
git commit -m "Resolve registry import conflicts"
```

The final commit command is needed only when a merge remains pending. If you want to abandon the pending merge and return to the pre-merge state, use `git merge --abort` before starting other edits. Re-run relevant checks after resolving conflicts.

Then publish the import branch:

```powershell
git push -u origin import/ui-factory-registry
```

Open a pull request to the existing default branch and review it. If the destination contains an unrelated application that should remain separate, use a different repository instead of merging them. Do not force-push over existing work.

## 11. Common problems

| Message or symptom                         | What to do                                                                            |
| ------------------------------------------ | ------------------------------------------------------------------------------------- |
| `remote origin already exists`             | It is already configured; inspect it with `git remote -v`                             |
| `src refspec main does not match any`      | Check that a first commit exists and inspect the current branch name                  |
| `Author identity unknown`                  | Set repository-local name/email in step 2                                             |
| Non-fast-forward rejection                 | Fetch and inspect remote history; integrate changes or use the import branch workflow |
| Branch protection rejection                | Push a feature/import branch and use a pull request                                   |
| Browser tests cannot start a server        | Stop the process using the reported test port, then retry                             |
| PowerShell refuses `pnpm.ps1`              | Use `pnpm.cmd`                                                                        |
| GitHub page has source but no live preview | Expected: pushing source does not deploy the Next.js website or native app            |

Publishing code and deploying a running application are different tasks. Hosting the shadcn registry also requires the correct `REGISTRY_BASE_URL` and serving its generated endpoints; see [registry integration](registry-integration.md). GitHub Pages is not a drop-in host for this application's current server-rendered preview route.

For running a fresh clone, follow [HOW-TO-USE.md](../HOW-TO-USE.md). For combining external design guidance with this code, read [design principles and skills](design-principles-and-skills.md).
