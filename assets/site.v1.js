(() => {
  const { hostname, protocol, pathname, search, hash } = window.location;
  const conflictMarkerPattern = /<{7}\s*HEAD|={7}|>{7}\s*[0-9a-f]{7,}/g;

  const stripConflictMarkerText = () => {
    const root = document.body;
    if (!root) return;

    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let node = walker.nextNode();

    while (node) {
      if (conflictMarkerPattern.test(node.nodeValue || "")) {
        node.nodeValue = (node.nodeValue || "").replace(conflictMarkerPattern, "").trim();
      }
      conflictMarkerPattern.lastIndex = 0;
      node = walker.nextNode();
    }
  };

  const isIndexHtml = pathname.endsWith("/index.html");
  const needsCanonicalRedirect =
    hostname === "www.signaturedentures.co.uk" || protocol === "http:";

  if (isIndexHtml) {
    window.location.replace("https://signaturedentures.co.uk/");
    return;
  }

  if (needsCanonicalRedirect) {
    window.location.replace(`https://signaturedentures.co.uk${pathname}${search}${hash}`);
    return;
  }

  stripConflictMarkerText();

  const yearNode = document.getElementById("y");
  if (yearNode) {
    yearNode.textContent = String(new Date().getFullYear());
  }

  const COOKIE_DISMISS_KEY = "sd_cookie_notice_dismissed";
  const notice = document.querySelector("[data-cookie-notice]");

  if (!notice) {
    return;
  }

  const dismissButton = notice.querySelector("[data-cookie-dismiss]");

  const isDismissed = () => {
    try {
      return window.localStorage.getItem(COOKIE_DISMISS_KEY) === "1";
    } catch (error) {
      return false;
    }
  };

  const setDismissed = () => {
    try {
      window.localStorage.setItem(COOKIE_DISMISS_KEY, "1");
    } catch (error) {
      // Ignore storage errors; the banner will reappear next visit.
    }
  };

  if (isDismissed()) {
    notice.hidden = true;
    return;
  }

  notice.hidden = false;

  if (!dismissButton) {
    return;
  }

  dismissButton.addEventListener("click", () => {
    notice.hidden = true;
    setDismissed();
  });
})();
