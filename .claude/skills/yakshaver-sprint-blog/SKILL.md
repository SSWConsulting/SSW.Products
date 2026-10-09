---
name: yakshaver-sprint-blog
description: Create a weekly YakShaver "What's New" blog post from the latest sprint review email in SSWConsulting/SSW.YakShaver/sprint-emails. Turns internal sprint progress into a user-facing update in content/blogs/YakShaver/, matching the existing blog style, and generates a banner via the yakshaver-blog-banner skill. Use whenever asked to write the weekly/sprint progress blog.
---

# YakShaver Sprint Progress Blog Generator

Turns the latest sprint review + retro email (internal) into a polished, user-facing
"What's New" blog post in `content/blogs/YakShaver/`. The reader is a YakShaver **user**,
not the team — the job is translation, not transcription.

## Step 1 — Fetch the latest sprint review email

Sprint emails live in the `SSWConsulting/SSW.YakShaver` repo under `sprint-emails/`.
Review emails are named `sprint-<N>-review-retro-email.html` (ignore `-forecast-` emails
and the `SSW.YakShaver - Sprint N ...` saved-page duplicates).

```bash
# Find the latest review email
gh api repos/SSWConsulting/SSW.YakShaver/contents/sprint-emails --jq '.[].name' \
  | grep -E '^sprint-[0-9]+-review-retro-email\.html$' | sort -t- -k2 -n | tail -1

# Get its download URL, then curl it into the scratchpad
gh api "repos/SSWConsulting/SSW.YakShaver/contents/sprint-emails/<file>" --jq '.download_url'
curl -sL "<download_url>" -o <scratchpad>/sprint-<N>-review.html
```

The HTML can be 1–2 MB (embedded images). Extract readable text before reading it:

```bash
python3 -c "
import re, html
content = open('sprint-<N>-review.html', encoding='utf-8', errors='ignore').read()
content = re.sub(r'<(script|style)[^>]*>.*?</\1>', '', content, flags=re.S|re.I)
text = html.unescape(re.sub(r'<[^>]+>', '\n', content))
print('\n'.join(l.strip() for l in text.split('\n') if l.strip()))
" > sprint-<N>-review.txt
```

If the user already provided an email file or pasted content, use that instead.

## Step 2 — Extract what matters (and drop what doesn't)

The email contains these sections — use them like this:

| Email section | Use in blog? |
|---|---|
| Sprint Goals (✔ DONE / ◯ PARTIAL) | **Yes** — these are the headline themes |
| Sprint Backlog (DONE items) | **Yes, filtered** — only user-visible features and fixes |
| Sprint dates / number | Context only — the blog may mention "this week", never "Sprint 116" |
| Summary Recording (YouTube) | Optional embed if it's a public demo |
| Velocity, points, Internal Hours | **No** — internal |
| Retro (went well / didn't / improvements) | **No** — internal; at most mine it for enthusiasm cues |
| AI Tool Usage, R&D, Project Snapshot | **No** — internal |

Filtering backlog items — include only what a user would notice or benefit from:

- ✅ New features, UX improvements, notable bug fixes, new platform/tool support
- ❌ Refactors, CI/build chores, `.env`/infra prep, internal tooling, WON'T DO items,
  test-only changes, "prepare/enable flag" plumbing (fold these into the feature they enabled)

Group survivors into **2–4 themes** (usually the sprint goals). If several small fixes
share an area, present them as one "polish" bullet list rather than item-by-item.
Never include internal issue numbers (`#3781`) or repo names in the blog body.

## Step 3 — Write the blog post

Read 1–2 recent posts in `content/blogs/YakShaver/` first (e.g. `yakshaver-anywhere.mdx`)
to calibrate voice. Create `content/blogs/YakShaver/<slug>.mdx` with a descriptive,
user-facing slug (e.g. `faster-recording-and-smarter-work-items.mdx` — **not**
`sprint-116-update.mdx`).

### Frontmatter (exact shape — matches the Tina schema)

```yaml
---
seo:
  title: <title>
  description: >-
    <140–160 char benefit-led description>
category: What's New
title: <title, ≤ 70 chars>
date: '<today>T13:00:00.000Z'
author: <author name>
authorImage: /people/<First-Last>.jpg
sswPeopleLink: 'https://www.ssw.com.au/people/<first-last>/'
bannerImage: /YakShaver/Blogs/<slug>.png
readLength: <N> min
summaryCard: true
summary: >
  ## <Hook heading>


  <1–2 sentence hook>


  ***


  ## <Theme heading>


  * <bullet>

  * <bullet>


  ***


  ## <Theme heading>


  * <bullet>
---
```

Notes:
- `summary` is rendered as a card: 2–3 `##` sections separated by `***`, bullets inside.
  Keep the blank-line-doubled formatting shown above (Tina's rich-text serialization).
- Author defaults to the person running the skill (check `git config user.name`);
  their image/link follow the `/people/First-Last.jpg` + ssw.com.au/people pattern.
- Title: benefit-led, not sprint-led. "Faster Shaves and a Smarter Leaderboard" ✔,
  "Sprint 116 Review" ✘.

### Body style (match existing posts)

- Open with a 1–2 sentence hook addressed to the reader ("you"), bolding the key
  feature name. No "this sprint we…" openers — say "this week" at most.
- `##` section per theme; bullets with **bold lead-ins** for feature lists;
  numbered steps only for how-to walkthroughs.
- Friendly, confident, concise — posts run 1–3 min read. Sparing emoji (🐂 🎉) is on-brand.
- Screenshots: if the user provides them, save under `public/YakShaver/Blogs/` and
  reference as `![alt](/YakShaver/Blogs/<name>.png)` followed by a `Figure: <caption>` line.
  Don't invent screenshots.
- A public demo video can be embedded:
  `<Youtube thumbnail="https://img.youtube.com/vi/<id>/maxresdefault.jpg" externalVideoLink="https://www.youtube.com/embed/<id>" />`
  Only embed the sprint review recording if the user confirms it's public-appropriate.
- Close with a short call-to-action section pointing at [yakshaver.ai](https://yakshaver.ai).
- Estimate `readLength` at ~200 words/min, rounded up.

## Step 4 — Banner image

Invoke the **yakshaver-blog-banner** skill (`.claude/skills/yakshaver-blog-banner/`) to
create `public/YakShaver/Blogs/<slug>.png` and set `bannerImage` accordingly. Use the
same slug as the MDX file. Kicker is usually `PRODUCT UPDATE` for these posts; base the
illustration on the strongest theme of the week, not on "sprint" imagery.

## Step 5 — Ship it

1. Sanity-check the MDX renders: `pnpm dev` and open `http://localhost:3000/blog/<slug>`
   (blog route = filename without extension). Verify frontmatter parses, summary card
   shows, banner displays.
2. Work on a branch (e.g. `blog/<slug>`), commit the MDX + banner PNG, and open a PR to
   `main` — this repo merges blogs via PR.

Optional: some posts have a Chinese translation in `content/blogs/YakShaver/zh/<slug>.mdx`
(same frontmatter, same `bannerImage`, translated text). Only create one if asked.
