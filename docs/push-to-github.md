# General Git setup, remote publishing and troubleshooting

A reusable guide for any new or existing project. It does not assume a particular framework, computer path, account, branch or repository. Core Git commands apply to GitHub, GitLab, Bitbucket and other Git servers; authentication policies and pull-request screens vary by provider.

Run only the workflow matching your situation, one command at a time. Stop after a failed command. These are alternative procedures, not one script to paste into a terminal. The guide covers common errors and how to investigate unfamiliar ones, not every possible server or operating-system failure.

## 1. Choose your starting situation

| Local state                                     | Remote state               | Start here                                           |
| ----------------------------------------------- | -------------------------- | ---------------------------------------------------- |
| No project yet                                  | No repository              | Create project files; sections 2–7                   |
| Project files exist without Git                 | Remote absent or empty     | Initialize once, commit, connect, push; sections 5–7 |
| Git repository already has commits              | Remote absent or empty     | Keep history; sections 6–7                           |
| No local copy                                   | Project exists remotely    | Clone; section 8                                     |
| Local and remote share history                  | Remote has updates         | Fetch and compare; section 9A                        |
| Local and remote were independently initialized | Both have commits          | Choose an import strategy; section 9B                |
| Connected repository                            | Normal ongoing work        | Section 10                                           |
| Branch needs renaming                           | Local and/or remote exists | Section 11                                           |
| Something fails                                 | Any state                  | Sections 12–16                                       |

### Example values to replace

| Example                                   | Replace with                                         |
| ----------------------------------------- | ---------------------------------------------------- |
| `C:\Projects\my-project`                  | Your Windows project directory                       |
| `/path/to/my-project`                     | Your macOS/Linux project directory                   |
| `https://github.com/OWNER/REPOSITORY.git` | Your actual clone URL                                |
| `YOUR NAME`, `YOUR EMAIL`                 | Your commit identity                                 |
| `main`                                    | Your team's integration/default branch, if different |
| `feature/my-change`                       | An unused descriptive feature branch name            |
| `PATH/TO/FILE`                            | An actual relative file path                         |

`main`, `master`, `develop` and `development` are ordinary, distinct names. Inspect which exists and substitute consistently. `origin` is a conventional remote name; it is not a server or account name.

Most `git ...` commands below work in PowerShell, Git Bash, macOS Terminal and Linux shells. OS-specific commands are labeled. Keep quotes around paths containing spaces. Git Bash may use `/c/Projects/my-project` for a Windows drive.

## 2. Install tools and inspect the project directory

Install Git using the [official installation instructions](https://git-scm.com/install/), reopen your terminal, and check:

```sh
git --version
```

Git does not require Node.js, Python or a particular package manager. Install the project's runtime/build tools separately, following its README. Use modern Git for commands such as `switch`, `restore` and `init -b`.

Windows PowerShell:

```powershell
cd "C:\Projects\my-project"
Get-Location
```

macOS/Linux:

```sh
cd "/path/to/my-project"
pwd
```

Before initializing anything:

```sh
git rev-parse --show-toplevel
```

- Your project root is printed: Git already exists; do not initialize again.
- A parent directory is printed: the project belongs to a parent repository. Decide the intended boundary before creating a nested repository.
- “Not a git repository”: use section 5 for local files, or section 8 to clone.

For an existing repository, inspect:

```sh
git status
git branch --show-current
git branch -vv
git remote -v
git log --oneline --graph --decorate --all -10
```

An initialized repository can have no commits; a failing `git log` then does not mean files are lost. Empty output from `branch --show-current` can indicate detached HEAD; check `git status`.

### Basic terms

| Term               | Meaning                                                   |
| ------------------ | --------------------------------------------------------- |
| Working tree       | Files you edit                                            |
| Index/staging area | Changes selected for the next commit                      |
| Commit             | A local saved snapshot with history                       |
| Branch             | A named line of development                               |
| HEAD               | Current checked-out commit or branch                      |
| Remote             | A named server URL                                        |
| `origin/main`      | Your local, last-fetched record of remote `main`          |
| Upstream           | The branch your local branch tracks                       |
| Fetch              | Download history without merging into your current branch |
| Pull               | Fetch, then integrate according to the selected policy    |
| Push               | Upload commits and update a remote branch                 |
| Merge              | Combine histories                                         |
| Pull/merge request | A provider's review process for merging branches          |

The normal flow is **edit → review → stage → commit → push → pull request**. Commit does not upload. Pushing one branch does not update another. Source upload does not automatically deploy an application.

## 3. Configure identity, editor and authentication

### Commit identity

Optional account-wide defaults:

```sh
git config --global user.name "YOUR NAME"
git config --global user.email "YOUR EMAIL"
git config --global init.defaultBranch main
```

For a different identity in one initialized repository:

```sh
git config --local user.name "YOUR WORK NAME"
git config --local user.email "YOUR WORK EMAIL"
```

Use the provider's exact noreply address if desired. Identity labels commits; it does not sign you into the server. `init.defaultBranch` affects future initialization, not existing branches.

### Editor and synchronization behavior

If VS Code's `code` command is available:

```sh
code --version
git config --global core.editor "code --wait"
```

Save and close the commit-message tab to release `--wait`. Windows users can alternatively configure `git config --global core.editor notepad`. Choose an installed editor. Use `--local` instead of `--global` for repository-only settings.

Optional settings in an initialized repository:

```sh
git config --local pull.ff only
git config --local push.default simple
```

The first stops pulls on divergence. The second uses conservative same-name upstream behavior for ordinary pushes. Inspect effective settings and their sources:

```sh
git config --show-origin --get user.name
git config --show-origin --get user.email
git config --show-origin --get core.editor
git config --show-origin --get credential.helper
git config --show-origin --get pull.ff
git config --show-origin --get push.default
```

An unset key can print nothing and return status 1. Keep a working credential helper instead of replacing it with an arbitrary example. [Git configuration reference](https://git-scm.com/docs/git-config).

### Authentication is separate

| Method | Setup                                                                       |
| ------ | --------------------------------------------------------------------------- |
| HTTPS  | Sign in through a supported credential manager or the provider's token flow |
| SSH    | Add your public key to your account and use the SSH clone URL               |

GitHub does not accept an account password for Git HTTPS operations. Do not embed tokens in remote URLs or files. Reading a public repository does not prove write permission. See [GitHub authentication](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/about-authentication-to-github).

For GitHub SSH, after configuring the key:

```sh
ssh -T git@github.com
```

Verify a first-connection host fingerprint against the provider's official documentation. GitHub's successful response says authentication succeeded but shell access is unavailable, and exits with status 1. Check the message and account name. Other providers may differ. [GitHub SSH test](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/testing-your-ssh-connection).

## 4. Prepare source, ignore rules and project checks

Inspect the README, dependency manifests and existing `.gitignore`. Run the project's documented install/test/lint/build commands. There is no universal package manager or build command for every project.

| Usually include                                | Usually exclude                                         |
| ---------------------------------------------- | ------------------------------------------------------- |
| Source, tests and documentation                | Installed dependencies and caches                       |
| Dependency manifests and appropriate lockfiles | Build output and temporary reports                      |
| Required configuration without secrets         | Credentials, private keys, real local environment files |
| Required assets and notices                    | Machine-specific local files                            |
| Safe example environment values                | Actual passwords/tokens                                 |

Generated source can be required even when generated build output is ignored. Follow project policy, preserve licenses/notices, and do not overwrite existing ignore rules blindly.

Example only, for a Node application:

```gitignore
node_modules/
dist/
coverage/
.env
.env.*
!.env.example
*.log
```

Adapt rules to the actual stack. `.gitignore` does not untrack already committed files; see section 14.

## 5. Initialize local files only when needed

If starting from scratch, create the project folder and meaningful initial files. If files already exist, enter their directory without replacing them.

Only after section 2 confirms the folder is not already part of a repository:

```sh
git init -b main
```

Configure identity, prepare ignore rules and run applicable checks. Stage and review:

```sh
git status --short
git add .
git diff --cached --stat
git diff --cached --name-only
git diff --cached
```

After reviewing the exact content:

```sh
git commit -m "Initial project setup"
git log -1 --oneline
```

Run `git add .` from the intended repository root to include changes beneath it. Use `git add -- "PATH/TO/FILE"` for selected files. Git tracks files, not empty directories. `git commit .` is not a substitute for adding untracked files.

If commits already exist, skip initialization and the first-commit procedure. Keep that history and continue with section 6.

## 6. Create, connect or change a remote

### Remote repository does not exist

Create it on the hosting provider under the intended account/organization. Choose visibility and access. For an existing local project, an empty remote avoids independent initialization history: leave automatic README/license/ignore creation off and commit those locally instead. Copy the actual clone URL. Local `git init` does not create a server repository. [GitHub existing-source workflow](https://docs.github.com/en/migrations/importing-source-code/using-the-command-line-to-import-source-code/adding-locally-hosted-code-to-github).

### No origin is configured

```sh
git remote -v
git remote add origin https://github.com/OWNER/REPOSITORY.git
```

### Origin exists but its destination should change

```sh
git remote -v
git remote set-url origin https://github.com/OWNER/REPOSITORY.git
```

If both destinations are needed, add another named remote instead:

```sh
git remote add secondary https://github.com/OWNER/SECOND-REPOSITORY.git
```

Use `secondary` in later commands for that destination. Adding/changing a URL does not upload source or alter remote history. [Git remote reference](https://git-scm.com/docs/git-remote).

### Is the remote empty?

```sh
git remote -v
git ls-remote origin
```

Immediately inspect the exit status: `$LASTEXITCODE` in PowerShell, or `echo $?` in Bash/zsh.

| Result                        | Next step                                                                   |
| ----------------------------- | --------------------------------------------------------------------------- |
| Success with no refs printed  | Empty remote: section 7                                                     |
| Hashes and refs printed       | Existing history: section 8 or 9                                            |
| Error/access denied/not found | Fix URL, network or authentication; do not treat failure as an empty remote |

Discover the default branch if needed:

```sh
git ls-remote --symref origin HEAD
git remote show origin
```

An empty remote may not yet have a meaningful default-branch reference. Use actual advertised branch names for an existing project.

## 7. Publish to an empty remote

Confirm a local commit and branch exist:

```sh
git status
git log -1 --oneline
git branch --show-current
```

If you want the current branch named `main`, first check that no different local `main` exists. Only if a rename is needed:

```sh
git branch -m main
```

Otherwise keep its name and substitute it in the push:

```sh
git push -u origin main
```

`-u` sets tracking for later pulls/pushes. If someone added remote history since the empty check, fetch and reassess using section 9 or 12. Do not overwrite those commits. Verify the upload using section 17.

## 8. Clone a project that already exists remotely

When the remote is the starting source and you have no local work to combine, clone into a new directory:

```sh
git clone https://github.com/OWNER/REPOSITORY.git my-project
cd my-project
git status
git branch -a
git remote -v
```

Do not clone over a nonempty project folder. A clone preserves history and normally checks out the remote default branch. Do not initialize it again or add the same origin.

If the desired branch is `develop` and only `origin/develop` exists locally:

```sh
git switch --track origin/develop
```

If local `develop` already exists, use `git switch develop`. Follow the README for dependencies, local configuration and checks. Different branches may contain different project versions.

## 9. Local and remote projects both already exist

Save/review local work before integration: commit intended changes or use section 14's stash procedure. Confirm the intended remote, then:

```sh
git fetch origin
git branch -a
git log --oneline --graph --decorate --all -20
git merge-base HEAD origin/main
```

Substitute the actual destination branch. `merge-base` prints a common ancestor if one exists. No common ancestor is different from a missing branch or other error. In a shallow clone, incomplete history can prevent finding an ancestor; obtain the needed history before declaring it unrelated.

### A. Local and remote share history

```sh
git rev-list --left-right --count HEAD...origin/main
```

| Counts | Meaning                   | Action                                                  |
| ------ | ------------------------- | ------------------------------------------------------- |
| `0 0`  | Same history tip          | Nothing to synchronize                                  |
| `2 0`  | Two local-only commits    | Push to the intended branch or publish a feature branch |
| `0 3`  | Three remote-only commits | With a clean working tree, fast-forward                 |
| `2 3`  | Both have unique commits  | Integrate deliberately; section 12                      |

For remote-only updates:

```sh
git merge --ff-only origin/main
```

Do not rename branches to hide divergence. Configure tracking separately using section 11.

### B. Histories were initialized independently

Choose one approach based on whether the local commit history must be preserved.

**Option 1: apply local files to a fresh clone.** Often simpler when local history is not needed:

1. Keep a backup of the local folder.
2. Clone the remote into another directory.
3. Create a branch: `git switch -c import/local-project`.
4. Compare and copy the intended files into the clone, preserving useful remote content. Do not copy the old `.git`, credentials, dependencies or caches.
5. Review, test, stage and commit the combined result.
6. Run `git push -u origin import/local-project`, then open a pull request.

This transfers content, not old local commit history.

**Option 2: merge independent histories.** Use only when both histories intentionally belong to the same project. After committing local work and fetching:

```sh
git switch -c import/local-project
git merge origin/main --allow-unrelated-histories --no-edit
```

Resolve conflicts using section 12, test and publish:

```sh
git push -u origin import/local-project
```

Open a pull request into the intended destination branch. The unrelated-history flag is for this special import, not routine updates. `--no-edit` accepts the generated merge message. If the remote contains another application that should stay separate, use a different repository. [Git merge reference](https://git-scm.com/docs/git-merge).

### C. Moving to another server

Keep the existing history, configure the new destination, inspect it, then publish required branches explicitly. Pushing one branch does not migrate all branches, tags, issues, pull requests, CI settings or permissions. A mirror push can replace/delete destination refs; it is not a generic migration shortcut.

## 10. Daily updates and pull requests

Start with a clean working tree on the team's integration branch:

```sh
git switch main
git pull --ff-only
git switch -c feature/my-change
```

Make changes and run appropriate project checks. Review, commit and publish:

```sh
git diff
git add -- "PATH/TO/CHANGED-FILE"
git diff --cached
git commit -m "Describe the change"
git push -u origin feature/my-change
```

Use `git add .` from the root when all reviewed changes belong together. Create a pull/merge request with the correct target/base branch and source/compare branch. Review checks and changes before merging.

For later commits on the same tracked branch, use `git push`. After a remote merge, switch to your integration branch and pull; the remote merge does not update your local checkout automatically.

If direct commits to `main` are permitted, omit the feature branch/pull request but keep review and checks. Protected branches can require a pull request even for an owner.

## 11. Branch names, renaming and upstream tracking

Inspect first:

```sh
git branch -vv
git branch -r
git ls-remote --heads origin
```

Example rename, **only if `master` exists and `develop` is an unused destination**:

```sh
git branch -m master develop
git push -u origin develop
git rev-parse develop
git ls-remote --heads origin develop
```

Compare the hashes. Publishing the new name does not delete the old remote name. `-m` avoids the overwrite behavior of `-M`. [Git branch reference](https://git-scm.com/docs/git-branch).

Before deleting the old remote name, handle default-branch settings, rules, open requests, CI filters and collaborators. Verify the old branch has no commits missing from the new one:

```sh
git fetch origin
git log --oneline develop..origin/master
```

If commits appear, integrate them first. Once the new branch is verified and old references are handled:

```sh
git push origin --delete master
git fetch --prune origin
```

Skip deletion if the old remote branch never existed or is already absent. Protected/default branches may require provider-side changes. Renaming into an existing `main` is not a merge strategy.

### If the hosting website renamed the branch first

For a clone still using local `master`, after the remote became `develop`:

```sh
git branch -m master develop
git fetch origin
git branch --set-upstream-to=origin/develop develop
git remote set-head origin -a
```

The last command refreshes local `origin/HEAD`, not the server default branch. Platforms differ in how renaming affects requests/references. [GitHub rename behavior](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-branches-in-your-repository/renaming-a-branch).

### Fix missing/wrong tracking

If local `develop` should track an already fetched `origin/develop`:

```sh
git branch --set-upstream-to=origin/develop develop
```

If it needs publishing first, use `git push -u origin develop`. Tracking config does not synchronize commits. Do not track `origin/main` from `develop` merely to suppress a name error.

## 12. Rejected pushes, divergence and merge conflicts

Save work, then diagnose:

```sh
git status
git fetch origin
git branch -vv
git rev-list --left-right --count 'HEAD...@{upstream}'
git log --oneline --graph --decorate --all -15
```

Quotes protect the upstream expression in PowerShell. If tracking is absent, compare against the intended branch explicitly, such as `HEAD...origin/main`. Interpret counts using section 9A.

For ordinary divergence on local `main`, merge the fetched remote branch:

```sh
git merge origin/main --no-edit
```

Substitute the actual branch. If conflicts occur:

```sh
git status
git diff --name-only --diff-filter=U
```

Edit conflicted files. Resolve `<<<<<<<`, `=======` and `>>>>>>>` blocks to the intended final content; do not blindly accept one side. For modify/delete conflicts, decide whether the file should remain.

```sh
git add -- "PATH/TO/RESOLVED-FILE"
git diff --cached
git status
git commit -m "Merge remote updates"
```

Commit only after every conflict is resolved. Use `git rm -- "PATH/TO/FILE"` only when deletion is the intended resolution. Test the result and push. If the remote advances again, fetch and reassess.

To cancel a pending merge before making unrelated edits:

```sh
git merge --abort
```

Start merges with a clean tree; abort may not reconstruct earlier uncommitted edits. If `git status` reports an active **rebase**, resolve/stage conflicts and use `git rebase --continue`, or cancel with `git rebase --abort`. Do not mix merge/rebase completion commands. Teams may prefer rebasing unpublished changes; this guide defaults to merging shared history.

## 13. Locks and commit editors

### index.lock already exists

A lock may belong to an active operation or remain after a crash. Its age alone does not prove it is stale. A common cause is a commit waiting for an editor while another terminal tries to commit.

Check terminals and IDE Source Control. Windows PowerShell diagnostics:

```powershell
Get-Process git*,vim*,ssh* -ErrorAction SilentlyContinue
Get-CimInstance Win32_Process -Filter "Name = 'git.exe' OR Name = 'vim.exe'" |
  Select-Object ProcessId, ParentProcessId, Name, CommandLine
```

Access denied during inspection does not prove no process is running. On macOS/Linux, use Activity Monitor/System Monitor or `ps -ef`. Do not terminate every Git process; others may belong to different projects.

### Git is waiting in Vim

| Intent                | Keys                                                |
| --------------------- | --------------------------------------------------- |
| Cancel waiting commit | Esc, `:cq`, Enter                                   |
| Finish with a message | `i`, type message above comments, Esc, `:wq`, Enter |

For VS Code with `--wait`, save and close the message tab. Avoid surprise editors with `git commit -m "Message"` or `git merge ... --no-edit`, and configure an installed editor in section 3.

### Confirmed stale lock only

Finish/cancel the owning operation first. If it ended/crashed, no Git operation is active for this repository, and the lock remains, find its exact path:

```sh
git rev-parse --show-toplevel
git rev-parse --git-path index.lock
```

Use that output rather than assuming `.git` is a directory; linked worktrees can keep metadata elsewhere. Inspect the exact path before removal.

PowerShell, replace the path with the **confirmed stale lock**:

```powershell
Get-Item -LiteralPath "C:\path\to\actual\index.lock"
Remove-Item -LiteralPath "C:\path\to\actual\index.lock"
git status
```

macOS/Linux, under the same condition:

```sh
ls -l "/path/to/actual/index.lock"
rm -- "/path/to/actual/index.lock"
git status
```

Remove only that lock. Never delete the index or Git metadata directory as a generic fix. Other config/ref locks require identifying their own operation, not automatic removal.

## 14. Staging, ignore rules and unfinished work

| Short status | Meaning                                |
| ------------ | -------------------------------------- |
| `??`         | Untracked                              |
| `A `         | New file staged                        |
| ` M`         | Tracked edits not staged               |
| `M `         | Tracked edits staged                   |
| `MM`         | Staged edits plus newer unstaged edits |
| `UU`         | Unresolved conflict                    |

First column: index. Second: working tree. Inspect with `git diff`, `git diff --cached` and `git diff --cached --stat`.

### Unstage without discarding edits

After a first commit exists:

```sh
git restore --staged -- "PATH/TO/FILE"
```

Before the first commit, remove a staged new file only from the index:

```sh
git rm --cached -- "PATH/TO/FILE"
```

Both leave working files. If Git refuses because staged/working content differs, inspect both instead of forcing. `git restore FILE` without `--staged` can discard working edits; that is a different operation.

### Missing or unexpectedly tracked files

```sh
git check-ignore -v -- "PATH/TO/FILE"
git ls-files -- "PATH/TO/FILE"
git status --short --untracked-files=all
```

`check-ignore` explains an ignore rule for untracked content; no match normally exits with status 1. `ls-files` shows tracked content. To stop tracking a generated file, first add an appropriate ignore rule, then:

```sh
git rm --cached -- "PATH/TO/GENERATED-FILE"
git add .gitignore
git diff --cached
git commit -m "Stop tracking generated output"
```

For a verified generated directory, `git rm -r --cached -- "PATH/TO/GENERATED-DIRECTORY"` removes index entries but keeps local files. This does not erase older commits. For committed secrets, revoke/rotate credentials and handle history cleanup separately.

### Save unfinished work before synchronization

```sh
git stash push -u -m "Work before synchronization"
git pull --ff-only
```

Only after synchronization succeeds:

```sh
git stash apply
git status
```

`-u` includes untracked files, not ignored files. `apply` retains a recovery copy. Resolve conflicts and verify the restored edits, then inspect `git stash list` and drop only the confirmed restored entry, for example `git stash drop 'stash@{0}'`. If the pull fails, address it before applying. Keep backups of ignored configuration separately.

## 15. Common errors and fixes

| Symptom                                           | Diagnose and resolve                                                                                                        |
| ------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| Git command not found                             | Install Git, correct PATH and reopen terminal                                                                               |
| Not a Git repository                              | Check directory; enter correct root, initialize new files or clone an existing project                                      |
| Origin already exists                             | Inspect `git remote -v`; retain it, intentionally set its URL, or add another name                                          |
| Repository not found                              | Verify owner/name/account; private repositories can hide their existence without access                                     |
| Authentication failed / HTTP 403                  | Check login, write permission, token scope/expiry and organization policy; commit identity does not grant access            |
| SSH publickey denied                              | Check key, SSH agent and account association using provider instructions                                                    |
| Author identity unknown                           | Configure name/email at the appropriate scope                                                                               |
| src refspec main does not match any               | Confirm first commit exists and use the actual local branch name                                                            |
| Nothing to commit                                 | Check files are saved, not ignored and not already committed                                                                |
| No upstream / name mismatch                       | Inspect `git branch -vv`; configure intended tracking or publish with `-u`                                                  |
| Non-fast-forward / fetch first                    | Fetch, compare and integrate; section 12                                                                                    |
| Unrelated histories                               | Verify intended project and ancestry; use section 9B only for intentional imports                                           |
| Local changes would be overwritten                | Commit or stash before switching/merging                                                                                    |
| Unmerged files / operation already in progress    | Complete or abort the current operation shown by `git status`                                                               |
| index.lock exists                                 | Identify process/editor; section 13                                                                                         |
| Cannot launch editor                              | Configure an installed editor or use `commit -m`                                                                            |
| Branch name already exists                        | Switch to it or choose an unused name; avoid forced rename                                                                  |
| Default/protected branch deletion refused         | Review provider rules/settings; do not bypass protection                                                                    |
| Protected push / required checks / signed commits | Read server rejection, meet policy or use a pull request                                                                    |
| Secret-scanning rejection                         | Revoke real credentials and remediate affected commits using provider instructions                                          |
| File too large                                    | Identify file/history; use appropriate storage or Git LFS and migrate existing blobs if required                            |
| DNS, timeout or TLS error                         | Check URL, network, proxy/VPN and certificate trust; do not globally disable TLS verification                               |
| Dubious ownership                                 | Verify directory ownership, then fix it or trust only that verified repository, not all paths                               |
| LF/CRLF notices                                   | Inspect `.gitattributes` and core.autocrlf; notices alone are not failed commits; agree on policy before mass normalization |
| Embedded repository warning                       | Inspect nested Git metadata and decide whether a submodule or ordinary files are intended                                   |
| Clone destination not empty                       | Choose a new directory or use the existing repo; do not overwrite work                                                      |
| Files missing after clone                         | Check branch, submodules and LFS requirements; follow README setup                                                          |

File limits and LFS quotas depend on provider/plan. Deleting a large file only from the latest snapshot may leave it in pushed history; installing LFS does not automatically migrate old blobs. [GitHub large-file guidance](https://docs.github.com/en/repositories/working-with-files/managing-large-files/about-large-files-on-github).

For a cached wrong HTTPS account, manage only the relevant host/account entry in the configured credential manager, then reauthenticate. Do not clear unrelated credentials or switch to plaintext storage as a generic fix.

## 16. Recovery and investigating unfamiliar errors

### Preserve work in detached HEAD

If `git status` reports detached HEAD and current commits should be kept:

```sh
git switch -c recovery/my-work
```

Choose an unused name; review and publish the branch normally.

### Find an earlier local commit

```sh
git reflog --date=local -15
git show COMMIT-HASH
```

After verifying the desired hash, preserve it with:

```sh
git branch recovery/found-work COMMIT-HASH
```

Reflog is local and expires; it is not a backup of arbitrary unsaved or untracked files. Avoid deleting Git metadata while investigating missing commits.

### Undo an ordinary shared commit

For a verified non-merge commit, starting with a clean working tree:

```sh
git revert COMMIT-HASH
```

Review, resolve any conflicts, test and push. Revert adds an inverse commit instead of rewriting shared history. Reverting a merge requires understanding the parent history; do not guess a mainline argument.

### Collect useful diagnostic information

```sh
git --version
git status
git branch -vv
git remote -v
git log --oneline --graph --decorate --all -15
```

Record the exact failed command, complete error, OS/shell, and any active editor/Git operation. Redact credentials and confidential URLs before sharing. Fetch before remote comparisons; remote-tracking refs are cached.

Do not use `reset --hard`, `clean -fd`, force-push, forced branch deletion or deletion of Git metadata as unexplained-error fixes. They can discard or replace work. Diagnose the specific failure and preserve work first.

## 17. Verify a successful upload

After pushing the intended branch:

```sh
git status
git branch -vv
git log -1 --oneline
git rev-parse main
git ls-remote --heads origin main
```

Substitute the branch actually pushed. Compare the local and server hashes, then check the correct repository/branch in the hosting UI, expected source, checks and pull-request status.

A clean working tree alone does not prove upload succeeded. If a network failure interrupted a push response, inspect the remote tip before assuming nothing arrived.

For a portability check, clone into a separate directory and follow the README from scratch. This reveals local-only files, missing dependencies and undocumented setup requirements.

Source hosting, CI, deployment, release packaging and domain setup are separate tasks. Publishing source does not automatically create a running website or store application.
