(() => {
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
