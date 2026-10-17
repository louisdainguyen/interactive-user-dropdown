# User Dropdown

An interactive HTML/CSS/JS mockup of a user profile dropdown, built from the Figma file *User Dropdown Function*.

## Features
- Click the profile card to expand the menu (300 ms ease-in-out, matching the Figma prototype).
- Submenus for **Update status**, **Switch account** and **Switch space**: hover on desktop, tap on touch devices.
- Switching accounts updates the header, switching spaces updates the footer logo, and setting a status updates the label and badge.
- Keyboard: `Esc` closes, `1`–`4` highlight menu items, `S` opens Switch account, `⌘/Ctrl + 1–5` picks an account, arrow keys move inside a submenu.
- Light and dark themes. It follows the system setting by default, with a toggle in the top-right corner. Add `?theme=dark` or `?theme=light` to the URL to force one.
- Responsive. It scales down on small screens, and submenus overlay the menu on narrow viewports.

## Project structure
```
index.html          Page markup
css/styles.css      Component styles, design tokens, dark theme
js/icons.js         SVG icons exported from Figma + image paths
js/component.js     Builds the dropdown and exposes a small state API
js/app.js           Interactions, keyboard shortcuts, theme toggle
images/             Avatars and space logos (WebP)
.nojekyll           Tells GitHub Pages to serve files as-is
```

No build step or dependencies. The Inter font loads from Google Fonts, with a system-font fallback.

## Host on GitHub Pages
1. Create a new repository and upload the contents of this folder (keep `index.html` at the root).
2. Open **Settings → Pages**, set **Source** to *Deploy from a branch*, and choose `main` / `(root)`.
3. After a minute, the mockup is live at `https://<your-username>.github.io/<repo-name>/`.

## Run locally
Open `index.html` in a browser, or serve the folder:
```
python3 -m http.server 8000
```
Then visit http://localhost:8000.
