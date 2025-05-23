document.addEventListener("DOMContentLoaded", function () {
  const testimonialContainer = document.querySelector(".testimonials-container");
  const testimonialCards = document.querySelectorAll(".testimonial-card");
  const prevButton = document.getElementById("prev");
  const nextButton = document.getElementById("next");
  const dotsContainer = document.querySelector(".dots");

  let currentIndex = 0;
  const totalCards = testimonialCards.length;
  const slideWidth = testimonialCards[0].offsetWidth;

  // Desativa o carrossel no mobile (telas menores que 768px)
  if (window.innerWidth < 768) {
    testimonialContainer.style.transform = 'none';
    return;
  }

  function updateSlider(index) {
    testimonialContainer.style.transform = `translateX(-${index * slideWidth}px)`;
    updateDots(index);
  }

  function updateDots(index) {
    const dots = document.querySelectorAll(".dot");
    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === index);
    });
  }

  function createDots() {
    for (let i = 0; i < totalCards; i++) {
      const dot = document.createElement("span");
      dot.classList.add("dot");
      if (i === 0) dot.classList.add("active");
      dot.addEventListener("click", () => {
        currentIndex = i;
        updateSlider(currentIndex);
      });
      dotsContainer.appendChild(dot);
    }
  }

  prevButton.addEventListener("click", () => {
    if (currentIndex > 0) {
      currentIndex--;
      updateSlider(currentIndex);
    }
  });

  nextButton.addEventListener("click", () => {
    if (currentIndex < totalCards - 1) {
      currentIndex++;
      updateSlider(currentIndex);
    }
  });

  createDots();
});
