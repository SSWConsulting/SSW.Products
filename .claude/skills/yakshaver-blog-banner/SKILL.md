---
name: yakshaver-blog-banner
description: Create a YakShaver blog banner image (1200×675 PNG) in the consistent house style — dark background, red glow, YakShaver logo, bold headline left, flat vector illustration right. Use whenever adding or updating a banner for a YakShaver blog post in content/blogs/YakShaver/.
---

# YakShaver Blog Banner Generator

Generates blog banner PNGs that match the existing YakShaver blog style. Banners are
authored as a self-contained HTML file, rendered to PNG with headless Chrome, and
saved to `public/YakShaver/Blogs/<blog-slug>.png`.

Before designing, look at 2–3 existing banners for calibration:
`public/YakShaver/Blogs/how-much-time-does-yakshaver-save.png`,
`new-support-macos.png`, `yakshave-on-browser.png` (view them with the Read tool).

## Design system (do not deviate)

**Canvas**: 1200×675 px (16:9 — matches the `bannerImage` frontmatter requirement).

**Layout**:
- YakShaver logo top-left at `top: 44px; left: 56px; height: 46px`
- Left column (x=56, width ≤ 560px, vertically centred around y≈380): kicker → headline → red dash → subtitle
- Right zone (roughly x 690–1140, y 110–500): one flat vector illustration of the topic
- Never place text or illustration within 56px of the canvas edge

**Colors**:
- Background: `#161616` with two radial red glows (see template) — the glow sits behind the illustration side
- Brand red (accents, kicker, dash, highlights): `#e5484d`
- Headline: `#ffffff` · Subtitle / secondary: `#9b9b9b` · Muted UI text: `#bdbdbd`
- Illustration surfaces: `#1c1c1c`–`#262626` cards with `1px solid #333` borders

**Typography** (Helvetica Neue / Arial):
- Kicker: 20px, bold, uppercase, `letter-spacing: 6px`, brand red. Usually `PRODUCT UPDATE`; other options: `PRODUCTIVITY · ROI`, `GETTING STARTED` — pick to match the post category
- Headline: 62px, weight 800, white, max 2 lines, `line-height: 1.13`. Shorten the blog title if needed — punchy beats complete
- Red dash: 92×6px, `border-radius: 3px`, 30px above/26px below
- Subtitle: 26px, `#9b9b9b`, one line, ≤ 45 characters — a benefit statement, not a description

**Illustration** (the only part you design per-post):
- One concept, flat vector style, no photos, no gradients on shapes, no more than ~3 elements
- Built from the design-system palette; brand red is the focal accent (glow shadows like
  `box-shadow: 0 0 0 10px rgba(229,72,77,0.18), 0 0 40px rgba(229,72,77,0.5)` make red elements pop)
- Common motifs already in use: browser/app window with macOS traffic lights, dashed red capture
  region with corner handles, red record button, stopwatch/timer, document/work-item card, badges
  and pill chips. Reuse these CSS pieces from the template where they fit
- Give containers `display: flex; flex-direction: column` and inner areas `flex: 1` so nothing
  clips at fixed heights (this has bitten before)

## Process

1. **Copy the template** `template.html` (next to this file) into the scratchpad directory as
   `<blog-slug>-banner.html`.
2. **Set the logo path**: replace `{{LOGO_SRC}}` with the absolute file URL to the logo, e.g.
   `file:///<repo-root>/public/YakShaver/yakshaver-logo.png`.
3. **Write the copy**: kicker, headline (≤ 2 lines), subtitle. Update `<title>` too.
4. **Design the illustration**: replace the contents of `<div class="illustration">` with your
   concept, following the illustration rules above.
5. **Render** with headless Chrome from the scratchpad directory:

   ```bash
   "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
     --headless=new --disable-gpu --hide-scrollbars \
     --window-size=1200,675 \
     --screenshot=<blog-slug>.png \
     --allow-file-access-from-files \
     "file://$PWD/<blog-slug>-banner.html"
   ```

   (On Windows/Linux substitute the Chrome/Chromium binary path.)
6. **Verify visually**: open the PNG with the Read tool and check —
   - [ ] Exactly 1200×675 (macOS: `sips -g pixelWidth -g pixelHeight <file>.png`; Windows: `Add-Type -AssemblyName System.Drawing; [System.Drawing.Image]::FromFile("<file>.png") | Select Width, Height`)
   - [ ] Nothing clipped: illustration fully inside its card, badges/chips visible
   - [ ] Headline fits in 2 lines; subtitle in 1 line
   - [ ] Side-by-side sanity check against an existing banner: same logo position, kicker
         treatment, dash, and overall balance
   Iterate on the HTML and re-render until it passes.
7. **Ship it**: copy the PNG to `public/YakShaver/Blogs/<blog-slug>.png` and set
   `bannerImage: /YakShaver/Blogs/<blog-slug>.png` in the post's MDX frontmatter (both the
   English post and its `zh/` translation reference the same image).
