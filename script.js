const body = document.body;
const menuToggle = document.querySelector(".menu-toggle");
const navPanel = document.querySelector(".nav-panel");
const navLinks = document.querySelectorAll(".nav-panel a");
const revealItems = document.querySelectorAll(".reveal");
const counters = document.querySelectorAll("[data-count]");
const serviceFilters = document.querySelectorAll(".service-filter");
const serviceCards = document.querySelectorAll(".service-card");
const whatsappLinks = document.querySelectorAll("[data-whatsapp-message]");
const quoteForm = document.querySelector("#quote-form");
const whatsappNumber = "211922166062";

function buildWhatsAppUrl(message) {
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}

function closeMenu() {
  body.classList.remove("menu-open");
  menuToggle.setAttribute("aria-expanded", "false");
}

menuToggle.addEventListener("click", () => {
  const isOpen = body.classList.toggle("menu-open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

navLinks.forEach((link) => {
  link.addEventListener("click", closeMenu);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMenu();
  }
});

whatsappLinks.forEach((link) => {
  link.setAttribute("href", buildWhatsAppUrl(link.dataset.whatsappMessage));
  link.setAttribute("target", "_blank");
  link.setAttribute("rel", "noopener noreferrer");
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16 }
);

revealItems.forEach((item) => revealObserver.observe(item));

function animateCounter(counter) {
  const target = Number(counter.dataset.count);
  const duration = 1100;
  const startTime = performance.now();

  function update(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    counter.textContent = Math.floor(eased * target);

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      counter.textContent = target;
    }
  }

  requestAnimationFrame(update);
}

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 }
);

counters.forEach((counter) => counterObserver.observe(counter));

serviceFilters.forEach((filter) => {
  filter.addEventListener("click", () => {
    const category = filter.dataset.filter;

    serviceFilters.forEach((item) => item.classList.remove("is-active"));
    filter.classList.add("is-active");

    serviceCards.forEach((card) => {
      const shouldShow = category === "all" || card.dataset.category === category;
      card.classList.toggle("is-hidden", !shouldShow);
    });
  });
});

quoteForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(quoteForm);
  const name = formData.get("name") || "there";
  const phone = formData.get("phone") || "not provided";
  const service = formData.get("service") || "a service";
  const message = formData.get("message") || "No extra message provided.";

  const whatsappMessage = [
    `Hello PowerLink, I would like a quote for ${service}.`,
    `Name: ${name}`,
    `Phone: ${phone}`,
    `Message: ${message}`,
  ].join("\n");

  window.open(buildWhatsAppUrl(whatsappMessage), "_blank", "noopener,noreferrer");
  quoteForm.reset();
});

const sections = document.querySelectorAll("main section[id]");
const activeLinkObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      navLinks.forEach((link) => {
        link.classList.toggle("is-active", link.getAttribute("href") === `#${entry.target.id}`);
      });
    });
  },
  { rootMargin: "-45% 0px -45% 0px" }
);

sections.forEach((section) => activeLinkObserver.observe(section));

// Gallery Lightbox Functionality
const galleryItems = document.querySelectorAll("[data-gallery-item]");
const lightbox = document.getElementById("gallery-lightbox");
const lightboxImage = document.getElementById("lightbox-image");
const lightboxClose = document.querySelector(".lightbox-close");
const lightboxPrev = document.querySelector(".lightbox-prev");
const lightboxNext = document.querySelector(".lightbox-next");
let currentGalleryIndex = 0;

function openLightbox(index) {
  currentGalleryIndex = index;
  const imgElement = galleryItems[index].querySelector("img");
  lightboxImage.src = imgElement.src;
  lightboxImage.alt = imgElement.alt;
  lightbox.classList.add("is-open");
  lightbox.setAttribute("aria-hidden", "false");
  body.style.overflow = "hidden";
}

function closeLightbox() {
  lightbox.classList.remove("is-open");
  lightbox.setAttribute("aria-hidden", "true");
  body.style.overflow = "";
}

function showPrevImage() {
  currentGalleryIndex = (currentGalleryIndex - 1 + galleryItems.length) % galleryItems.length;
  const imgElement = galleryItems[currentGalleryIndex].querySelector("img");
  lightboxImage.src = imgElement.src;
  lightboxImage.alt = imgElement.alt;
}

function showNextImage() {
  currentGalleryIndex = (currentGalleryIndex + 1) % galleryItems.length;
  const imgElement = galleryItems[currentGalleryIndex].querySelector("img");
  lightboxImage.src = imgElement.src;
  lightboxImage.alt = imgElement.alt;
}

galleryItems.forEach((item, index) => {
  const viewButton = item.querySelector(".gallery-view");
  if (viewButton) {
    viewButton.addEventListener("click", (e) => {
      e.stopPropagation();
      openLightbox(index);
    });
  }
  item.addEventListener("click", () => openLightbox(index));
});

lightboxClose.addEventListener("click", closeLightbox);
lightboxPrev.addEventListener("click", showPrevImage);
lightboxNext.addEventListener("click", showNextImage);

lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) {
    closeLightbox();
  }
});

document.addEventListener("keydown", (e) => {
  if (!lightbox.classList.contains("is-open")) return;

  if (e.key === "Escape") {
    closeLightbox();
  } else if (e.key === "ArrowLeft") {
    showPrevImage();
  } else if (e.key === "ArrowRight") {
    showNextImage();
  }
});
