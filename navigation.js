const menuToggle = document.querySelector(".menu-toggle");
const mobileMenu = document.querySelector(".mobile-menu");
const announcement = document.querySelector(".announcement");

if (menuToggle && mobileMenu) {
  const updateMenuTop = () => {
    const announcementBottom = announcement?.getBoundingClientRect().bottom ?? 0;
    mobileMenu.style.setProperty("--mobile-menu-top", `${Math.max(announcementBottom, 0)}px`);
  };

  const closeMenu = () => {
    menuToggle.classList.remove("is-open");
    mobileMenu.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Abrir menú");
  };

  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.classList.toggle("is-open");
    if (isOpen) updateMenuTop();
    mobileMenu.classList.toggle("is-open", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Cerrar menú" : "Abrir menú");
  });

  window.addEventListener("resize", updateMenuTop);
  window.addEventListener("scroll", updateMenuTop, { passive: true });

  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });
}
