(() => {
  const header = document.querySelector(".site-header");
  if (!header) {
    return;
  }

  const menuToggle = header.querySelector(".menu-toggle");
  const overlay = header.querySelector(".nav-overlay");
  const backdrop = header.querySelector(".nav-overlay-backdrop");
  const panel = header.querySelector(".nav-overlay-panel");

  if (!menuToggle || !overlay || !backdrop || !panel) {
    return;
  }

  const desktopQuery = window.matchMedia("(min-width: 769px)");
  const focusableSelector = [
    "a[href]:not([tabindex='-1'])",
    "button:not([disabled]):not([tabindex='-1'])",
    "input:not([disabled]):not([type='hidden']):not([tabindex='-1'])",
    "select:not([disabled]):not([tabindex='-1'])",
    "textarea:not([disabled]):not([tabindex='-1'])",
    "[tabindex]:not([tabindex='-1'])",
  ].join(",");

  let isOpen = false;
  let lastFocusedElement = null;
  let closeTimer = null;

  const isVisible = (element) =>
    !!(element.offsetWidth || element.offsetHeight || element.getClientRects().length);

  const getFocusableElements = () =>
    Array.from(overlay.querySelectorAll(focusableSelector)).filter(
      (element) => isVisible(element) && !element.hasAttribute("disabled")
    );

  const updateExpandedState = (expanded) => {
    menuToggle.setAttribute("aria-expanded", expanded ? "true" : "false");
  };

  const lockBackgroundScroll = () => {
    document.documentElement.classList.add("nav-open");
    document.body.classList.add("nav-open");
  };

  const unlockBackgroundScroll = () => {
    document.documentElement.classList.remove("nav-open");
    document.body.classList.remove("nav-open");
  };

  const onKeyDown = (event) => {
    if (!isOpen) {
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      closeMenu();
      return;
    }

    if (event.key !== "Tab") {
      return;
    }

    const focusableElements = getFocusableElements();
    if (focusableElements.length === 0) {
      event.preventDefault();
      panel.focus();
      return;
    }

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    const activeElement = document.activeElement;

    if (!overlay.contains(activeElement)) {
      event.preventDefault();
      firstElement.focus();
      return;
    }

    if (event.shiftKey && activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
      return;
    }

    if (!event.shiftKey && activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  };

  const closeMenu = ({ restoreFocus = true } = {}) => {
    if (!isOpen) {
      return;
    }

    isOpen = false;
    window.clearTimeout(closeTimer);

    overlay.classList.remove("is-open");
    overlay.setAttribute("aria-hidden", "true");
    updateExpandedState(false);
    unlockBackgroundScroll();
    document.removeEventListener("keydown", onKeyDown);

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    closeTimer = window.setTimeout(() => {
      if (!isOpen) {
        overlay.hidden = true;
      }
    }, reduceMotion ? 0 : 250);

    if (restoreFocus) {
      const focusTarget = lastFocusedElement instanceof HTMLElement ? lastFocusedElement : menuToggle;
      focusTarget.focus();
    }
  };

  const openMenu = () => {
    if (isOpen || desktopQuery.matches) {
      return;
    }

    lastFocusedElement =
      document.activeElement instanceof HTMLElement ? document.activeElement : menuToggle;
    isOpen = true;
    window.clearTimeout(closeTimer);

    overlay.hidden = false;
    overlay.setAttribute("aria-hidden", "false");
    updateExpandedState(true);
    lockBackgroundScroll();

    requestAnimationFrame(() => {
      overlay.classList.add("is-open");
    });

    document.addEventListener("keydown", onKeyDown);

    const currentPageLink = overlay.querySelector(".nav-overlay-nav a[aria-current='page']");
    const focusTarget = currentPageLink || getFocusableElements()[0] || panel;
    focusTarget.focus();
  };

  menuToggle.addEventListener("click", () => {
    if (isOpen) {
      closeMenu({ restoreFocus: false });
      return;
    }

    openMenu();
  });

  backdrop.addEventListener("click", () => {
    closeMenu();
  });

  overlay.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      closeMenu({ restoreFocus: false });
    });
  });

  const onDesktopChange = (event) => {
    if (event.matches) {
      closeMenu({ restoreFocus: false });
    }
  };

  if (typeof desktopQuery.addEventListener === "function") {
    desktopQuery.addEventListener("change", onDesktopChange);
  } else {
    desktopQuery.addListener(onDesktopChange);
  }

  window.addEventListener("pagehide", () => {
    closeMenu({ restoreFocus: false });
  });
})();
