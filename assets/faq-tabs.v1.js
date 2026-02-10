(() => {
  const tablist = document.querySelector('.faq-tabs');
  const tabs = tablist ? Array.from(tablist.querySelectorAll('[role="tab"]')) : [];
  const panels = Array.from(document.querySelectorAll('.faq-panel[role="tabpanel"]'));

  if (!tablist || tabs.length === 0 || panels.length === 0) return;

  document.body.classList.add('js-tabs');

  const getTabPanel = (tab) => {
    const panelId = tab.getAttribute('aria-controls');
    if (!panelId) return null;
    return panels.find((panel) => panel.id === panelId) || null;
  };

  const activateTab = (tab) => {
    const activePanel = getTabPanel(tab);
    if (!activePanel) return;

    tabs.forEach((t) => {
      const isActive = t === tab;
      t.setAttribute('aria-selected', isActive ? 'true' : 'false');
      t.tabIndex = isActive ? 0 : -1;
    });

    panels.forEach((panel) => {
      panel.hidden = panel !== activePanel;
    });
  };

  activateTab(tabs[0]);

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => activateTab(tab));

    tab.addEventListener('keydown', (event) => {
      const currentIndex = tabs.indexOf(tab);
      let nextIndex = null;

      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
        nextIndex = (currentIndex + 1) % tabs.length;
      } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
        nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
      } else if (event.key === 'Home') {
        nextIndex = 0;
      } else if (event.key === 'End') {
        nextIndex = tabs.length - 1;
      } else if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        activateTab(tab);
        return;
      } else {
        return;
      }

      event.preventDefault();
      tabs[nextIndex].focus();
      activateTab(tabs[nextIndex]);
    });
  });

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let scrollRaf = null;
  document.addEventListener('toggle', (event) => {
    const target = event.target;
    if (!target || target.tagName !== 'DETAILS' || !target.open) return;

    const panel = target.closest('.faq-panel[role="tabpanel"]');
    if (!panel || panel.hidden) return;

    const behavior = prefersReducedMotion.matches ? 'auto' : 'smooth';
    if (scrollRaf) {
      window.cancelAnimationFrame(scrollRaf);
    }
    scrollRaf = window.requestAnimationFrame(() => {
      scrollRaf = null;
      if (!target.open || panel.hidden) return;
      target.scrollIntoView({ block: 'center', behavior });
    });
  }, true);
})();
