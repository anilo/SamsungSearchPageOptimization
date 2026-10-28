// Applies the chosen layout version to the All Smartphones page.
// Version is stored by popup.js in chrome.storage.local under "version" ("a", "b", "c" or "off").
(function () {
  const STYLE_ID = "atf-version-style";

  function applyStyle(css) {
    let style = document.getElementById(STYLE_ID);
    if (!style) {
      style = document.createElement("style");
      style.id = STYLE_ID;
      (document.head || document.documentElement).appendChild(style);
    }
    style.textContent = css;
  }

  function removeStyle() {
    const style = document.getElementById(STYLE_ID);
    if (style) style.remove();
  }

  // Versions B and C have a collapsible Filters header. Bind its title to open and close the dropdown.
  function bindFilterToggle() {
    const title = document.querySelector(".pd21-top__title");
    if (!title || title.dataset.atfBound) return;
    title.dataset.atfBound = "1";
    title.addEventListener("click", () => document.body.classList.toggle("filters-open"));
  }

  function closeOnOutsideClick(event) {
    if (!document.body || !document.body.classList.contains("filters-open")) return;
    if (event.target.closest && event.target.closest(".pd21-filter, .pd21-top__title")) return;
    document.body.classList.remove("filters-open");
  }

  function activate(version) {
    if (version !== "a" && version !== "b" && version !== "c") {
      removeStyle();
      return;
    }
    fetch(chrome.runtime.getURL(`versions/version-${version}.css`))
      .then((response) => response.text())
      .then(applyStyle);

    if (version !== "a") {
      setInterval(bindFilterToggle, 500);
      document.addEventListener("click", closeOnOutsideClick);
    }
  }

  chrome.storage.local.get("version", (result) => activate(result.version || "off"));

  chrome.storage.onChanged.addListener((changes) => {
    if (changes.version) {
      // Reload is handled by popup.js, so the page starts clean.
      removeStyle();
    }
  });
})();
