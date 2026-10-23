const menuToggle = document.getElementById("menu-toggle");
const mobileMenu = document.getElementById("mobile-menu");

if (menuToggle && mobileMenu) {
  menuToggle.addEventListener("click", () => {
    const isOpen = !mobileMenu.classList.toggle("hidden");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });
}
