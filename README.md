# Samples

- **`packs/`** — Reef plugin pack examples. **Each subfolder is one installable pack** (`reef.pack.json` at that folder’s root). See [`packs/README.md`](packs/README.md).

The **`samples/` tree is meant to work as a repository-of-repositories**: each pack can be its own Git project with its own remote, so you can share **per-pack URLs** (for **Settings → Plugins → Install from URL**) independently of the main app repo.

## Repository of repositories

### 1) Git submodules in this monorepo (recommended)

The parent repo records **which commit** of each pack repo to use; `samples/packs/<name>` is a **submodule** pointing at a public (or private) pack repository.

**Initial setup** (create one empty GitHub repo per pack, or one org with many repos):

```bash
# From the llm-organizer root, add a pack that already has its own remote:
git submodule add https://github.com/<org>/reef-pack-skill-grocery.git samples/packs/skill-grocery
git commit -m "Add skill-grocery pack submodule"
```

Repeat for `skill-coding-style`, `dynamic-tool-html-fetcher`, etc., each submodule URL is the **canonical link** for that pack (clone, archive, or “Open in GitHub” for `reef.pack.json` at repo root).

**Clone this repo with all pack submodules populated:**

```bash
git clone --recurse-submodules https://github.com/<org>/llm-organizer.git
# If you already cloned without submodules:
cd llm-organizer && git submodule update --init --recursive
```

**Update pack pointers** when a pack repo moves forward:

```bash
cd samples/packs/skill-grocery
git pull origin main
cd ../../..
git add samples/packs/skill-grocery
git commit -m "Bump skill-grocery submodule"
```

**Share only one pack:** send the **pack repo URL** (the submodule’s `url` in `.gitmodules`), not the monorepo path. The installer expects an archive whose root is the pack, which matches a single-pack GitHub repository.

### 2) Standalone pack repos (no submodule in the monorepo)

You can keep pack sources **only** in separate repositories and not wire them as submodules here. Copy or subtree-split the folders under `samples/packs/<name>` into a new repo whose root is that pack. Same rule: one remote = one `reef.pack.json` at the root of the clone.

### 3) Packs committed directly in the monorepo (no per-pack remotes)

Contributors can keep pack **files** tracked normally under `samples/packs/`. In that case **do not** run `git init` inside a pack subfolder in the same worktree: a nested `.git` alongside tracked files is confusing and error-prone. Use (1) or (2) when you need a separate public URL per pack.

## Install from URL (reminder)

For the app, the URL must resolve to a tree whose **root** contains `reef.pack.json` — the same shape as a single-pack repository or a pathless GitHub **archive of the default branch** of that repository.
