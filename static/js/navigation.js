'use strict';

addEventListener('DOMContentLoaded', () => {
  const SELECTORS_ID = {
    navigationButton: 'navigation-button',
    sidebar: 'sidebar',
  };

  const ACTIVE_CLASS_SELECTORS = {
    navigationButton: 'navigation-button_active',
    sidebar: 'sidebar_active',
  };

  const navigationButtonRef = document.getElementById(
    SELECTORS_ID.navigationButton
  );
  const sidebarRef = document.getElementById(SELECTORS_ID.sidebar);

  navigationButtonRef.addEventListener('click', (ev) => {
    navigationButtonRef.classList.toggle(
      ACTIVE_CLASS_SELECTORS.navigationButton
    );
    sidebarRef.classList.toggle(ACTIVE_CLASS_SELECTORS.sidebar);
  });
});
