(() => {
  "use strict";

  const root = document.documentElement;
  const themeButton = document.querySelector("#theme-toggle");
  const menuButton = document.querySelector("#menu-toggle");
  const nav = document.querySelector("#site-nav");
  const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");

  function readSavedTheme() {
    try {
      return window.localStorage.getItem("nadir-portfolio-theme");
    } catch {
      return null;
    }
  }

  function setTheme(theme, save = false) {
    root.dataset.theme = theme;
    if (themeButton) {
      const dark = theme === "dark";
      themeButton.setAttribute("aria-pressed", String(dark));
      themeButton.setAttribute("aria-label", `Switch to ${dark ? "light" : "dark"} theme`);
      themeButton.title = `Switch to ${dark ? "light" : "dark"} theme`;
    }
    if (save) {
      try {
        window.localStorage.setItem("nadir-portfolio-theme", theme);
      } catch {
        // The theme still changes for this page view when storage is unavailable.
      }
    }
  }

  const savedTheme = readSavedTheme();
  setTheme(savedTheme === "light" || savedTheme === "dark" ? savedTheme : (systemTheme.matches ? "dark" : "light"));

  themeButton?.addEventListener("click", () => {
    setTheme(root.dataset.theme === "dark" ? "light" : "dark", true);
  });

  systemTheme.addEventListener?.("change", (event) => {
    if (!readSavedTheme()) setTheme(event.matches ? "dark" : "light");
  });

  function closeMenu(restoreFocus = false) {
    if (!menuButton || !nav) return;
    nav.classList.remove("is-open");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open navigation");
    if (restoreFocus) menuButton.focus();
  }

  menuButton?.addEventListener("click", () => {
    if (!nav) return;
    const open = !nav.classList.contains("is-open");
    nav.classList.toggle("is-open", open);
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.setAttribute("aria-label", `${open ? "Close" : "Open"} navigation`);
  });

  nav?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => closeMenu());
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && nav?.classList.contains("is-open")) closeMenu(true);
  });

  const sectionLinks = [...document.querySelectorAll('.site-nav a[href^="#"]')];
  if ("IntersectionObserver" in window && sectionLinks.length) {
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        for (const link of sectionLinks) {
          if (link.hash === `#${entry.target.id}`) link.setAttribute("aria-current", "location");
          else link.removeAttribute("aria-current");
        }
      }
    }, { rootMargin: "-26% 0px -66% 0px" });

    for (const link of sectionLinks) {
      const section = document.querySelector(link.hash);
      if (section) observer.observe(section);
    }
  }
})();
