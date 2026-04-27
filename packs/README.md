# Reef sample plugin packs

This directory is **`samples/packs/<pack-name>/`**: each **immediate subfolder** is one fully self-contained Reef plugin with `reef.pack.json` at that folder’s root.

**Git layout:** treat the parent [`samples/`](../README.md) tree as a **repository of repositories** — each pack can be its own remote (submodules in the monorepo, or standalone repos) so you can share **per-pack links** for **Settings → Plugins → Install from URL**. For submodules, clone options, and when _not_ to nest `git init` inside a tracked pack, read [`samples/README.md`](../README.md).

Every pack has a `reef.pack.json` (the manifest) plus any files it references. One public Git repo = one pack of one `kind`. Combinations are achieved by installing several packs and enabling them on a profile.

| Folder                                     | `kind`                   | What it shows                                                                                                     |
| ------------------------------------------ | ------------------------ | ----------------------------------------------------------------------------------------------------------------- |
| `skill-grocery/`                           | `skill`                  | Inline `content` only (no extra files).                                                                           |
| `skill-coding-style/`                      | `skill`                  | Two `.md` files merged into **one** skill via `entries[]` (order preserved; parts joined with a horizontal rule). |
| `endpoint-tool-weather/`                   | `endpoint_tool`          | Public HTTP tool with `parameters` + `declared_capabilities.network_domains`.                                     |
| `dynamic-tool-html-fetcher/`               | `dynamic_tool`           | Two tools: inline `body`, and `entry` pointing at `tools/extract-page-summary.js`.                                |
| `prompt-template-pirate/`                  | `prompt_template`        | Two prompts: inline `content`, and `entry` to `templates/pirate-shanty.md`.                                       |
| `thought-extension-tool-active-inference/` | `thought_extension_tool` | One row in each of the four thought-extension taxonomies.                                                         |
| `voice-profile-multi/`                     | `voice_profile`          | Three providers — `native`, `google`, `elevenlabs` — no API keys in the pack.                                     |
| `profile-research-assistant/`              | `profile`                | Sanitized profile (`api_key: ""`) that lists suggested pack ids in `plugins_enabled`.                             |

## Try one locally

**Standalone** — make a single pack directory its own repo (leaf folder only, not `samples/packs` itself):

```bash
cd samples/packs/skill-grocery
git init -q && git add . && git commit -q -m "init"
# add remote, push; use that repo’s default-branch archive URL in the app
```

**Submodules in the app monorepo** — see [`samples/README.md`](../README.md).

**In the app:** Settings → Plugins → Install from URL (GitHub/GitLab **source archive** of the **pack** repo, or your host).

## Composing into a profile

Each pack contributes one type of thing. To build a "research assistant with weather, coding style, and active-inference thought-extension tools", install:

- `skill-coding-style`
- `endpoint-tool-weather`
- `thought-extension-tool-active-inference`
- `profile-research-assistant` (which already lists the three above in `plugins_enabled`)

…then on the profile, toggle the matching entries under **Plugins**.

## Authoring rules (aligned with loaders)

- `id` is lowercase, dotted/kebab; reverse-DNS is recommended.
- `manifest_version` is currently `"1"`. `kind` is the discriminator.

### `skill`

- Each item becomes one `Skill` row on the profile (`id`, `name`, `description`, `active`, **`content`** string only).
- **Pack manifest** may use:
  - **`content`** — inline text, or
  - **`entry`** — one file under the pack root (e.g. `SKILL.md`), or
  - **`entries`** — non-empty array of relative paths; when set, the loader merges optional `content`, optional single `entry`, then each `entries` path **in order**, with a horizontal rule between parts. File text is read at **pack load** and stored as that single `content` string (not re-read per chat turn).
- If **`entries` is omitted or empty**, legacy behavior applies: `content ?? readFile(entry)`.

### `dynamic_tool`

- Per tool: **`body`** (inline JS) **or** **`entry`** to a single `.js` file. Read at pack load; executed later in the dynamic-tool sandbox.
- Declare **`declared_capabilities.network_domains`** for hosts the tool may `fetch` (install review).

### `endpoint_tool`, `prompt_template`, `thought_extension_tool`, `voice_profile`, `profile`

- Follow the Zod shapes in `lib/plugins/pack.schema.ts` (e.g. thought-extension `rows` by `category`, profile `api_key: ""` with no secrets).

### General

- **Never** ship secrets. `profile` packs require `api_key: ""` (and similarly empty basic-auth fields) where applicable; the schema rejects inline credentials.
- Paths in `entry` / `entries` / dynamic `entry` are relative to the pack root, UTF-8, and may not contain `..`. Symlinks in tarballs are stripped at install.
