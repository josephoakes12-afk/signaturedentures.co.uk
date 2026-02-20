(() => {
  const { hostname, protocol, pathname, search, hash } = window.location;

  if (pathname.endsWith("/index.html")) {
    window.location.replace("https://signaturedentures.co.uk/");
    return;
  }

  if (hostname === "www.signaturedentures.co.uk" || protocol === "http:") {
    window.location.replace(`https://signaturedentures.co.uk${pathname}${search}${hash}`);
    return;
  }

  const yearNode = document.getElementById("y");
  if (yearNode) {
    yearNode.textContent = String(new Date().getFullYear());
  }

  const COOKIE_DISMISS_KEY = "sd_cookie_notice_dismissed";
  const notice = document.querySelector("[data-cookie-notice]");
  const dismissButton = notice ? notice.querySelector("[data-cookie-dismiss]") : null;

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

  if (notice) {
    if (isDismissed()) {
      notice.hidden = true;
    } else {
      notice.hidden = false;
      if (dismissButton) {
        dismissButton.addEventListener("click", () => {
          notice.hidden = true;
          setDismissed();
        });
      }
    }
  }

  if ("serviceWorker" in navigator) {
    window.addEventListener(
      "load",
      () => {
        navigator.serviceWorker
          .register("/sw.js")
          .then((registration) => registration.update())
          .catch(() => {
            // Ignore registration errors to keep first paint non-blocking.
          });
      },
      { once: true }
    );
  }
})();
