# doctorj.in — Eleventy + Decap CMS

## What changed vs. the current zip-upload deployment

- Every existing page (`index.html`, `/clinical/`, `/projects/`, `/locations/`, assets,
  fonts, images, `robots.txt`, `sitemap.xml`, `manifest.json`, `llms.txt`) lives under
  `content/` and is copied through **byte-for-byte unchanged** — verified against the
  live site page by page. Nothing about the existing 24 pages was rewritten or re-templated.
- Only `/blog/` is now Eleventy-built from Markdown files in `blog/posts/`, so it can be
  edited through Decap CMS. The one existing post
  (`welcome-to-the-studio-journal.html`) was converted to
  `blog/posts/welcome-to-the-studio-journal.md` — same URL, same content, same schema.
- `robots.txt` gets one addition: `Disallow: /admin/`.
- `content/assets/style.css` gets ~10 new scoped CSS rules (`.post-content ...`) so
  future CMS-written paragraphs pick up the same typography as the hand-built pages,
  since Markdown output won't carry hand-added classes like `pd-p`.
- A `_headers` file now carries the CSP/security headers your site already sends
  (copied from the live response headers), plus a relaxed CSP scoped to `/admin/*` only,
  needed for Decap CMS (`unpkg.com`) and Netlify Identity.

## Deploying it

### 1. Push this to GitHub
Replace the contents of `drjishnumaxfac-star/portfolio` with this project (keep it a
fresh commit rather than a patch, per what's worked before). `node_modules/` and `_site/`
are excluded — Netlify installs and builds them.

### 2. Change Netlify's build settings
Site settings → Build & deploy → Build settings:
- **Build command:** `npm run build`
- **Publish directory:** `_site`

(This is also in `netlify.toml`, so Netlify should pick it up automatically once it's
building from Git instead of a zip.)

### 3. Switch the site from zip-deploy to Git-deploy
Site settings → Build & deploy → Continuous deployment → Link to the GitHub repo
(`drjishnumaxfac-star/portfolio`, branch `main`). Do one deploy and confirm the live
site looks unchanged before touching anything else.

### 4. Enable Identity + Git Gateway
- Site settings → Identity → **Enable Identity**
- Identity → Services → **Enable Git Gateway**
- Identity → Invite users → invite yourself

### 5. Log in and post
Go to `doctorj.in/admin` → accept the email invite → set a password → you'll see the
"Blog Posts" collection with Title / Date / Category / Description / Body fields.
Publishing commits a new `.md` file to `blog/posts/`, Netlify rebuilds, and it's live
in about a minute at `doctorj.in/blog/your-post-title.html`.

### 6. Double check
- `doctorj.in/admin/` should require the Identity login (not be publicly editable)
- `doctorj.in/robots.txt` should list `Disallow: /admin/`
- A test post should show up on `/blog/` immediately above the existing one, numbered
  `01` again (numbering is automatic, driven by publish date — no manual renumbering)

## Adding a second collection later (optional)
Right now Decap only manages the blog. If you later want e.g. the clinical FAQ answers
or reviews editable too, that means converting those specific pages into Eleventy
templates with data files — deliberately not done here, to avoid touching the 24 pages
that already work and are indexed.
