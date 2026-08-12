# Letterhead — Employment Verification Letter Generator

A small, static HR tool that generates employment verification letters for
multiple company brands from one form. Switch the tab, the letterhead swaps;
fill in the employee, client, and role, and the letter updates live.

**[Live preview →](#)** *(update this link once GitHub Pages is enabled — see below)*

## Features

- **Tabbed company switcher** — one click swaps the company name, letterhead
  color, and masthead. Ships with Pride Global, Russell Tobin and
  Associates, Pride One, Pride Now, and Rocket Shippers.
- **Three engagement types** — Employee (W2), C2C (Corp-to-Corp), and
  Independent Contractor each generate their own letter language
  automatically; the form only shows the fields relevant to the selected
  type (staffing partner for C2C, contracting LLC for Independent
  Contractor, employment sub-type and work location for W2).
- **Live preview** — the letter updates as you type: masthead, return
  address, RE line, body, and footer all stay in sync.
- **Pay rate & schedule** — hourly/annual/daily pay basis, weekly hours,
  payment frequency, and first paycheck date, combined into the same
  sentence structure used in the real letter templates.
- **Job Description and Benefits sections** — optional free-text sections
  that appear as their own titled paragraphs near the end of the letter.
- **Signature section** — type a name and pick from five signature-style
  fonts, or upload a signature image (PNG, JPG, SVG, GIF, WEBP).
- **Editable company address & tagline per brand** — each tab remembers
  its own values as you switch between them.
- **Print / Save as PDF** and **Copy letter text** for pasting into email.

## Adding or editing companies

Open `script.js` and edit the `COMPANIES` array at the top of the file:

```js
const COMPANIES = [
  { id: "pride-global", name: "Pride Global", accent: "#2F6F62" },
  // add a new brand:
  { id: "new-brand", name: "New Brand Name", accent: "#123456" },
];
```

- `id` — a unique, URL-safe key (lowercase, hyphens).
- `name` — exactly how the company should appear in the subject line, body,
  and signature of the letter.
- `accent` — a hex color used for that brand's tab, letterhead bar, and
  company name styling.

No build step is required — the array is read directly by the browser.

## Running it locally

This is a static site (`index.html`, `style.css`, `script.js`) with no
dependencies or build step.

```bash
# from the project folder
python3 -m http.server 8000
# then open http://localhost:8000
```

Or just double-click `index.html` to open it directly in a browser.

## Publishing on GitHub Pages

1. Push this folder to a new GitHub repository.
2. In the repo, go to **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to `Deploy from a branch`,
   branch `main`, folder `/ (root)`.
3. Save — GitHub will publish the site at
   `https://<your-username>.github.io/<repo-name>/` within a minute or two.

## Notes

- Everything runs client-side in the browser; no data is sent anywhere or
  stored between sessions. Refreshing the page resets the form.
- Letters are meant as a fast first draft — always have a second person
  review before a letter goes out the door.
