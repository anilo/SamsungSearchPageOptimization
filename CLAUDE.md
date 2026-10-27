# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

There are no build, lint or test commands. The folder has no package.json, no git repo and no test suite. Verify changes manually on the live page:

1. Open https://www.samsung.com/us/smartphones/all-smartphones/ in the browser pane and do a fresh load.
2. Inject the override CSS with a `<style>` element, then measure with `getBoundingClientRect()`.
3. Do not open the local `.html` files to check behaviour. Browsers open `file://` pages as static snapshots without JavaScript.

## Architecture

This is a local snapshot of samsung.com's All Smartphones page, plus override stylesheets for layout experiments.

- `smartphones/index.html`: saved page markup. It loads CSS and JS from `resources.samsung.com` and images from `images.samsung.com`, so it needs internet access.
- `smartphones/css/`, `smartphones/js/`, `css/`, `js/`, `images/`, `fonts/`: downloaded reference assets from the homepage and the smartphones page. The homepage files at the top level are reference only.
- `smartphones/above-the-fold.css`: base override stylesheet. It hides the category carousel, promo bars and the eligibility row, and hides "Learn more" and the chat widget (`#ae_app`). It also tightens the H1, filter header and card padding, and fixes image/title and price/Buy spacing.
- `smartphones/version-a.css`, `version-b.css`, `version-c.css`, each with a matching `version-*.html`:
  - A: compact text filter pills, always visible.
  - B: labelled filter tiles. The tiles collapse behind the "Filters" title.
  - C: the filter bar is hidden behind the "Filters" title, which opens a dropdown.
- `version-b.html` and `version-c.html` each have a small inline script. It binds `.pd21-top__title` to toggle `body.filters-open`, and closes the dropdown on outside clicks.

Overrides target Samsung's own class names (`pd21-*`, `nv19-*`, `co77-*`, `gnb-promo-*`, `#ae_app`). They break when Samsung changes the page markup, so check the selectors against the live page first.

## Gotchas

- The live page's header height depends on load state. A cookie banner or promo bar changes the offsets, so measure after a fresh load.
- Samsung's assets are used on the basis that this work is internal to Samsung, as the user has stated. Do not publish these pages externally without brand sign-off.
