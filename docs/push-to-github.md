# Git setup, GitHub publishing and troubleshooting — Windows PowerShell

Run the section that matches your situation, one command at a time. Stop when a command fails; PowerShell does not automatically stop the next pasted command after a Git error. This guide does not create commits, change Git settings or upload anything on your behalf. Names such as `YOUR NAME` and `YOUR-REPOSITORY` are placeholders to replace.

## Choose the right workflow

| Situation                                                                 | Where to start                                        |
| ------------------------------------------------------------------------- | ----------------------------------------------------- |
| This project, already committed and tracking `origin/develop`             | Section 1 for current state; section 9 for daily work |
| Local project, no Git repository yet                                      | Section 12A                                           |
| GitHub repository does not exist                                          | Create it in section 3, then check it in section 4    |
| GitHub repository exists but is empty                                     | Sections 5–8, after creating a local commit           |
| GitHub has a README or independent history, and local code already exists | Section 10                                            |
| GitHub already contains the project and you need a local copy             | Section 12B: clone it                                 |
| Local and remote share history but have different new commits             | Section 16                                            |
| Rename a branch locally and remotely                                      | Section 14                                            |
| `index.lock` or an editor appears stuck                                   | Section 13                                            |
| Authentication, upstream, ignore or other failures                        | Sections 2, 11 and 15–18                              |

`commit` saves a local snapshot. `push` uploads commits. `fetch` updates your local record of remote branches. `merge` combines histories. A pull request proposes merging one branch into another on GitHub. None of these automatically deploys the application.

## 1. Understand the current local state

Latest local inspection on 2026-10-10, before this documentation edit:

| Setting             | Value                                                              |
| ------------------- | ------------------------------------------------------------------ |
| Git repository root | `C:\Users\Sartima kumari\Desktop\UI-templates\ui-factory-registry` |
| Current branch      | `develop`                                                          |
| Upstream            | `origin/develop`                                                   |
| Local HEAD          | `9769147` — `total UI completed`                                   |
| Working tree        | Clean at inspection; this guide edit will appear as a modification |
| Cached remote tips  | `origin/develop` at `9769147`; `origin/main` at `03dc3f1`          |
| Existing remote     | `origin`                                                           |
| Remote URL          | `https://github.com/prathimakumari/ui-factory-registry.git`        |

Remote-tracking names are cached local information. This inspection did not fetch fresh GitHub state. Use `git fetch origin` before relying on remote comparisons. Do not run first-commit or initial-import instructions again for this project. Do not run `git init` in the parent `UI-templates` folder: the application already has its own Git repository.

### What happened during your setup

| Observed step                                                    | Meaning                                                                       |
| ---------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| Git `2.56.0.windows.1`, Node `v24.21.0`, correct repository root | Tools and working directory were confirmed                                    |
| `A mobile/README.md`, other files marked `??`                    | Only that README was staged; other files were untracked                       |
| Local branch `master`, remote `origin` already configured        | No need to add the same remote again                                          |
| `git ls-remote origin` showed `8745dd0` at `refs/heads/main`     | GitHub was not empty; it already contained `Create README.md`                 |
| Commit failed with `index.lock`                                  | A separate `git commit .` was running and waiting in Vim; the lock was active |
| `bb2048c initial commit`                                         | Local source was committed                                                    |
| `03dc3f1 Delete README.md` on remote `main`                      | The remote history changed during setup                                       |
| `8b016c3 Merge remote-tracking branch 'origin/main'`             | Local and remote history were merged successfully                             |
| Current `develop` and `origin/develop` point to `9769147`        | The latest locally recorded state is a published/tracked development branch   |

The exact rename/push commands you ran are not recorded here; branch names and commits are verified from local Git output. Your earlier `master` log is historical, not the current branch. A merge _from_ `origin/main` into a local branch does not itself update GitHub's `main`.

To publish this guide update after reviewing it:

```powershell
git branch --show-current
git diff -- docs/push-to-github.md
git add -- docs/push-to-github.md
git commit -m "Expand Git setup and troubleshooting guide"
git pull --ff-only
git push
```

Use that sequence while on `develop`. It stages only this guide. If the pull reports diverged history, stop and follow section 16 before pushing.

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

### Configure an editor and inspect settings

If VS Code's `code` command works in your terminal:

```powershell
code --version
git config --local core.editor "code --wait"
git config --local pull.ff only
git config --local push.default simple
```

With `code --wait`, save and close the commit-message editor tab to let Git continue. If `code` is unavailable, a Windows alternative is `git config --local core.editor notepad`. Using `git commit -m "Your message"` avoids opening an editor for that commit.

`pull.ff only` makes plain pulls stop when histories diverge instead of silently choosing how to combine them. `push.default simple` helps keep a normal push aligned with its upstream branch name. These are suggested settings for this workflow, not changes already applied by writing this guide.

Verify the values and where they came from:

```powershell
git config --show-origin --get user.name
git config --show-origin --get user.email
git config --show-origin --get core.editor
git config --show-origin --get credential.helper
git config --show-origin --get pull.ff
git config --show-origin --get push.default
git branch -vv
```

An unset key may print nothing and return exit code 1. This is different from a failed push. Local configuration affects this repository; `--global` affects your user account's repositories. If you want future newly initialized repositories to start on `main`, optionally run `git config --global init.defaultBranch main`. It does not rename existing branches.

Git Credential Manager is configured as `manager` in the inspected environment. Keep that working helper rather than replacing it with plaintext credential storage. Commit identity, GitHub login, and branch tracking are three separate settings.

For setting scope and supported values, see the [Git configuration reference](https://git-scm.com/docs/git-config).

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

This applies to a new repository whose branch is still `master`, not your current `develop` workflow. After the first commit:

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

### Your current develop workflow

Start with a clean working tree. If you already edited files, commit them or use the stash procedure in section 17 before pulling.

```powershell
git status
git switch develop
git pull --ff-only
```

Make changes and run checks appropriate to them. For this documentation-only update, review Markdown and links; application changes need the checks in section 5. Then:

```powershell
git diff
git add .
git diff --cached --stat
git diff --cached --name-only
git commit -m "Describe the actual change"
git push
```

To put `develop` changes into `main`, open a GitHub pull request with **base: `main`**, **compare: `develop`**. Review and merge it. Pushing `develop` alone does not update `main`.

### If you instead work directly on main

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
git merge origin/main --allow-unrelated-histories --no-edit
```

This permits combining your initial local history with an independently created remote history. It can produce conflicts, especially in README files; it does not silently choose which version is correct.

Use `--allow-unrelated-histories` only for intentionally combining independently initialized histories. Normal updates to this already-merged project do not need it. `--no-edit` accepts Git's generated merge message and avoids opening Vim. See the [Git merge reference](https://git-scm.com/docs/git-merge).

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

## 12. Configure a different project correctly

### A. Local project exists, but Git is not initialized

Enter the actual project folder first:

```powershell
cd "C:\PATH\TO\YOUR-PROJECT"
git rev-parse --show-toplevel
```

If this prints a parent directory, the folder is already inside another Git repository. Decide which directory should be the repository root before continuing; do not accidentally create a nested repository. If it reports that this is not a Git repository, initialize it:

```powershell
git init -b main
git config user.name "YOUR NAME"
git config user.email "YOUR VERIFIED OR GITHUB NOREPLY EMAIL"
```

Create a project-appropriate `.gitignore` before staging. Create the GitHub repository if missing, preferably empty for an initial upload. Then add its URL once:

```powershell
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
git remote -v
git ls-remote origin
```

Check the exit status and output as in section 4. If empty, test, stage, commit and push using sections 5–8. If it has independent history, use section 10 after saving your local commit. `git init` creates local Git metadata; it does not create a GitHub repository.

### B. Project already exists on GitHub, and you need a local copy

Clone into a new directory rather than initializing another independent history:

```powershell
cd "C:\Users\Sartima kumari\Desktop"
git clone https://github.com/prathimakumari/ui-factory-registry.git ui-factory-registry-clone
cd ui-factory-registry-clone
git branch -a
git remote -v
```

Cloning checks out the remote's default branch. If your application is on `develop` and a local `develop` is not already present:

```powershell
git switch --track origin/develop
pnpm install --frozen-lockfile
pnpm dev
```

If local `develop` already exists, use `git switch develop`. Install the native package separately when needed, following the mobile guide. Do not clone into your existing nonempty project folder or overwrite its uncommitted changes.

## 13. Fix index.lock and commit-editor problems

### Your actual lock incident

The message was:

```text
fatal: Unable to create '.../.git/index.lock': File exists.
```

Inspection found a running `git commit .` and its child `vim.exe`, editing `.git/COMMIT_EDITMSG`. Git was waiting for the editor. It was not a stale lock.

In that editor's terminal:

| Intent                            | Vim keys                                                                                |
| --------------------------------- | --------------------------------------------------------------------------------------- |
| Cancel the commit that is waiting | Press Esc, type `:cq`, press Enter                                                      |
| Finish with a message             | Press `i`, type the message above the comment lines, press Esc, type `:wq`, press Enter |

For your setup, cancelling the waiting commit was appropriate so you could stage the whole project and retry using `git commit -m "Initial UI Factory Registry"`. `git commit .` does not mean “include all untracked project files”; explicitly stage the files you intend to commit.

### Diagnose a lock next time

First check other terminals and VS Code Source Control for an active commit, merge or fetch. These PowerShell commands help identify the process and lock timestamp:

```powershell
Get-Process git*,vim*,ssh* -ErrorAction SilentlyContinue
Get-Item -LiteralPath .git/index.lock -ErrorAction SilentlyContinue
Get-CimInstance Win32_Process -Filter "Name = 'git.exe' OR Name = 'vim.exe'" |
  Select-Object ProcessId, ParentProcessId, Name, CommandLine
```

Process inspection can require additional Windows permissions. Failure to inspect does not prove that no Git operation is running. A lock's age or size alone does not prove it is stale either. Finish or cancel the owning operation in its terminal; do not delete its active lock or stop every Git process on your computer.

Only after confirming the Git operation has ended or crashed, no editor/IDE Git operation is active, and the lock remains, remove that single stale lock. For this repository, verify the displayed absolute path first:

```powershell
cd "C:\Users\Sartima kumari\Desktop\UI-templates\ui-factory-registry"
git rev-parse --show-toplevel
Get-Item -LiteralPath "C:\Users\Sartima kumari\Desktop\UI-templates\ui-factory-registry\.git\index.lock"
```

If that is the confirmed stale lock for this repository:

```powershell
Remove-Item -LiteralPath "C:\Users\Sartima kumari\Desktop\UI-templates\ui-factory-registry\.git\index.lock"
git status
```

Do not delete `.git/index` or the `.git` directory. If the lock has disappeared, there is nothing to remove. Use the editor configuration in section 2 to avoid unexpected Vim sessions.

## 14. Rename a branch locally and on the remote

Your current branch is already `develop`. The following is the earlier `master` → `develop` example; **do not repeat it on your current repository**.

### Local-first rename

Before renaming, check for existing names and save local changes:

```powershell
git status
git branch -vv
git ls-remote --heads origin master develop
```

If `master` is the source branch and `develop` is an unused destination:

```powershell
git branch -m master develop
git push -u origin develop
git ls-remote --heads origin develop
```

Verify the returned `develop` hash matches `git rev-parse develop`. Local renaming does not rename the remote branch: publishing the new name and removing the old one are separate actions. The `-m` option preserves local branch history/configuration; avoid `-M`, which can overwrite an existing local branch name. [Git branch reference](https://git-scm.com/docs/git-branch).

Before removing the old remote branch, check its latest tip is included in the new branch and update any default-branch setting, branch protection/rules, pull requests, CI filters or collaborators still using it. If `origin/master` exists:

```powershell
git fetch origin
git log --oneline develop..origin/master
```

If that log shows commits, the old remote has work absent from `develop`: integrate it first. If the new remote branch is verified and old references are handled, remove only the obsolete remote name:

```powershell
git push origin --delete master
git fetch --prune origin
git branch -vv
```

If GitHub reports the old branch is protected or is the default, resolve the relevant setting before deletion. If it reports the branch does not exist, it may already have been removed. Renaming a branch to an existing `main` is not a way to merge its contents into `main`; use a pull request.

### If the branch was renamed on GitHub first

GitHub's branch rename feature updates some repository references, but local clones still need updating. Follow the [GitHub rename guide](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-branches-in-your-repository/renaming-a-branch), including its pull-request caveats. If your clone still has local `master` and GitHub now has `develop`:

```powershell
git branch -m master develop
git fetch origin
git branch --set-upstream-to=origin/develop develop
git remote set-head origin -a
```

The last command refreshes the local `origin/HEAD` shortcut from the server; it does not change GitHub's default branch. Do not repeat the remote deletion workflow if GitHub has already renamed it.

## 15. Diagnose authentication, remote URLs and upstream tracking

### Remote URL versus account access

```powershell
git remote -v
git config --get remote.origin.url
git ls-remote origin
```

A successful read is not proof of write permission, especially for a public repository. For an HTTPS permission error, confirm the destination owner and the account used by Git Credential Manager. If the wrong account is cached, manage the GitHub entry in Windows Credential Manager and sign in with the intended account on the next Git operation; leave unrelated saved credentials alone.

If you deliberately use SSH instead, configure a key with GitHub first, then test and change the remote:

```powershell
ssh -T git@github.com
git remote set-url origin git@github.com:YOUR-USERNAME/YOUR-REPOSITORY.git
```

GitHub's successful SSH test says authentication succeeded but shell access is unavailable; that test can exit with status 1. A different error such as `Permission denied (publickey)` means SSH authentication still needs setup. HTTPS users do not need to switch protocols just to commit.

Follow [GitHub's SSH connection test](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/testing-your-ssh-connection) when verifying the host fingerprint and expected authentication response.

### No upstream, or upstream name differs after a rename

```powershell
git branch --show-current
git branch -vv
git fetch origin
```

To publish your current `develop` branch and set its upstream:

```powershell
git push -u origin develop
```

If `origin/develop` already exists and you only want to configure tracking, without pushing:

```powershell
git branch --set-upstream-to=origin/develop develop
```

Changing tracking does not synchronize commits. Compare histories next. Do not set a `develop` branch to track `origin/main` merely to suppress an error from a push.

## 16. Fix rejected pushes and diverged history

For the current branch and upstream:

```powershell
git status
git fetch origin
git branch -vv
git rev-list --left-right --count 'HEAD...@{upstream}'
git log --oneline --graph --decorate --all -15
```

The single quotes protect `@{upstream}` from PowerShell parsing. The two counts mean:

| Output | Meaning                     | Next action                                     |
| ------ | --------------------------- | ----------------------------------------------- |
| `0 0`  | Same commits on both sides  | Nothing to synchronize                          |
| `3 0`  | Three local-only commits    | Push, if authorized to write                    |
| `0 2`  | Two remote-only commits     | With a clean working tree, `git pull --ff-only` |
| `3 2`  | Both sides have new commits | Combine histories deliberately                  |

For ordinary divergence on `develop`, start with a clean working tree and merge the fetched branch:

```powershell
git merge origin/develop --no-edit
```

If it succeeds, run relevant checks and `git push`. If it conflicts:

```powershell
git status
git diff --name-only --diff-filter=U
```

Edit each conflicted file. Resolve `<<<<<<<`, `=======` and `>>>>>>>` markers by keeping the intended result, not blindly accepting one side. Stage resolved files by their exact paths:

```powershell
git add -- "PATH/TO/RESOLVED-FILE"
git diff --cached
git status
git commit -m "Merge remote develop changes"
```

Commit only when all conflicts are resolved. If a file is intentionally deleted as the resolution, stage that deletion with `git rm -- "PATH/TO/FILE"`; otherwise preserve the file and stage it with `git add`. Run checks and push after the merge commit.

To cancel a pending merge before making unrelated edits, use `git merge --abort`. Avoid beginning merges with uncommitted work: recovering that work can be harder. `--allow-unrelated-histories` is for the independent-history import in section 10, not routine divergence. A rejected push is not a reason to force-push over others' commits.

## 17. Staging, ignored files and saving unfinished work

### Understand status codes

| Code | Meaning                                       |
| ---- | --------------------------------------------- |
| `??` | Untracked                                     |
| `A ` | New file staged                               |
| ` M` | Tracked file modified but not staged          |
| `M ` | Tracked modification staged                   |
| `MM` | Staged changes plus additional unstaged edits |
| `UU` | Unresolved merge conflict                     |

The first status column is the index/staging area; the second is the working tree. Use these commands to inspect each:

```powershell
git diff
git diff --cached
git diff --cached --stat
```

After this project's first commit exists, unstage a file without deleting its edits:

```powershell
git restore --staged -- "PATH/TO/FILE"
```

For the special no-commit-yet situation, section 6 gives the index-only removal command. Do not use `git restore FILE` when you intend only to unstage: without `--staged`, it can discard working edits.

### Why is a file missing from Git?

```powershell
git check-ignore -v -- "PATH/TO/FILE"
git ls-files -- "PATH/TO/FILE"
git status --short --untracked-files=all
```

`check-ignore` identifies the rule excluding an untracked file; no match normally returns exit code 1. `ls-files` checks if it is already tracked. Adding `.gitignore` rules does not untrack existing files.

If a generated/dependency directory was accidentally tracked, first verify its exact path, add its ignore rule, then remove only its Git index entries. For example, **only if `node_modules` is actually tracked**:

```powershell
git rm -r --cached -- node_modules
git add .gitignore
git diff --cached --stat
git commit -m "Stop tracking installed dependencies"
```

The `--cached` flag leaves local files in place. It does not erase files from older commits. For a committed credential, revoke the credential and handle history cleanup separately; deleting the current file is insufficient.

### Temporarily save unfinished work before pulling or switching

```powershell
git stash push -u -m "Work before syncing develop"
git pull --ff-only
git stash apply
git status
```

Stop if the pull fails; address synchronization before applying the stash. `-u` includes untracked files but not ignored files. `apply` retains the stash as a recovery copy. Resolve any apply conflicts, verify your work, then inspect `git stash list` and remove only the confirmed restored entry, for example `git stash drop 'stash@{0}'`. Do not drop it before confirming your edits are intact.

## 18. Quick debugging reference

| Problem                              | Diagnose                                                                 | Correct next step                                                                            |
| ------------------------------------ | ------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------- |
| Not a Git repository                 | `Get-Location`, `git rev-parse --show-toplevel`                          | Enter the correct folder; initialize only a genuinely new repository                         |
| Wrong remote                         | `git remote -v`                                                          | `git remote set-url origin ...` with the intended URL                                        |
| Origin absent                        | `git remote -v`                                                          | Add it once with `git remote add origin ...`                                                 |
| No commits yet                       | `git log -1`, `git status`                                               | Stage intended files and make the first commit                                               |
| Nothing to commit                    | `git status`, `git log -1`                                               | Check whether changes were saved or already committed                                        |
| Active index lock                    | Process/editor inspection in section 13                                  | Finish or cancel the owning operation                                                        |
| Stale lock after a crash             | Confirm no operation owns it                                             | Remove only the confirmed stale `index.lock`                                                 |
| Unrelated histories                  | Inspect both histories                                                   | Intentional initial import via section 10, or clone the correct project                      |
| Rejected non-fast-forward push       | Fetch and compare ahead/behind counts                                    | Merge and resolve, then push                                                                 |
| Protected branch                     | Read the server rejection                                                | Push a feature branch and open a pull request                                                |
| Branch name already exists           | `git branch -a`                                                          | Switch to it or choose a different name; do not force-rename over it                         |
| Remote branch absent                 | `git ls-remote --heads origin`                                           | Verify the name and whether it was already deleted/renamed                                   |
| Detached HEAD                        | `git status`                                                             | Preserve new commits on a named branch: `git switch -c recovery/my-work`                     |
| Commit editor unexpectedly opens     | `git config --show-origin --get core.editor`                             | Configure an editor or use `commit -m` / `merge --no-edit`                                   |
| Repeated Windows line-ending notices | `git config --show-origin --get core.autocrlf`, inspect `.gitattributes` | Notices alone are not failed commits; agree on repository policy before mass renormalization |

If you need help, share the exact failing command and error, plus `git status`, `git branch -vv` and a short graph log. Omit credentials from any output. Do not delete `.git`, run `reset --hard`, force-push, or delete branches as a generic fix for an unexplained error.
