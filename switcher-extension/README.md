# Samsung Smartphones Layout Switcher

A Chrome extension that switches the All Smartphones page between layout versions A, B and C.

## Install

1. Open `chrome://extensions` in Chrome.
2. Turn on **Developer mode** (top right).
3. Click **Load unpacked** and choose this `switcher-extension` folder.

## Use

1. Open https://www.samsung.com/us/smartphones/all-smartphones/
2. Click the extension icon and choose a version. The tab reloads with that layout.
3. Choose **Original page** to turn the layout off.

## Files

- `manifest.json`: extension settings and the page it runs on.
- `content.js`: applies the chosen stylesheet, and binds the Filters header toggle for B and C.
- `popup.html`, `popup.js`: the version picker.
- `versions/`: copies of `version-a.css`, `version-b.css` and `version-c.css` from `smartphones/`.

If you edit a stylesheet in `smartphones/`, copy it into `versions/` again and reload the extension in `chrome://extensions`.
