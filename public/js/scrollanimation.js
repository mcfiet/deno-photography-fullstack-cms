let options = {
  root: null,
  rootMargin: "-50px -1px -50px -1px",
  threshold: 0.2,
};

observer = new IntersectionObserver(startAnimation, options);
const animations = document.querySelectorAll(".animation-wrapper");

animations.forEach((element) => observer.observe(element));

function startAnimation(entries, observer) {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const slideIn = entry.target.querySelector(".Slide-in");
      const slideUp = entry.target.querySelectorAll(".Slide-up");
      if (slideIn) {
        slideIn.classList.add("start");
      } else if (slideUp) {
        for (const slide of slideUp) {
          slide.classList.add("start");
        }
      }
    }
  });
}
