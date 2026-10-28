// Stores the chosen version and reloads the active Samsung tab.
const buttons = document.querySelectorAll("button[data-version]");

function markActive(version) {
  buttons.forEach((button) => {
    button.classList.toggle("active", button.dataset.version === version);
  });
}

chrome.storage.local.get("version", (result) => markActive(result.version || "off"));

buttons.forEach((button) => {
  button.addEventListener("click", () => {
    const version = button.dataset.version;
    chrome.storage.local.set({ version }, () => {
      markActive(version);
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const tab = tabs[0];
        if (tab && tab.url && tab.url.startsWith("https://www.samsung.com/us/smartphones/")) {
          chrome.tabs.reload(tab.id);
        }
      });
    });
  });
});
