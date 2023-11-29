/**
 * @see https://inclusive-components.design/menus-menu-buttons/
 */
const addClass = (document, selector, ...classes) => {
  const element = document.querySelector(selector);
  element.classList.add(...classes);
  return element;
};

const toggleMenu = () => {
  const navGroup = document.querySelector(".nav-group");
  navGroup.classList.toggle("is-hidden");
  const button = document.querySelector(".Site-header button");
  const expanded = button.getAttribute("aria-expanded") === "true";
  button.setAttribute("aria-expanded", String(!expanded));
};

const setup = () => {
  /**
   Adjust to your CSS classes!
   */

  addClass(document, ".nav-group", "nav-group--overlay", "is-hidden");

  const toggle = document.querySelector(".site-header  button");
  toggle.addEventListener("click", toggleMenu);
};

export const init = () => {
  if (
    "querySelector" in document &&
    "head" in document &&
    "classList" in document.head &&
    "addEventListener" in window
  ) {
    document.addEventListener("DOMContentLoaded", setup);
  }
};
