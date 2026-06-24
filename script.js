const products = [
  ["Table With Back Splash", "Preparation"],
  ["Table Without Back Splash", "Preparation"],
  ["Single Bowl Sink", "Preparation"],
  ["Double Bowl Sink", "Preparation"],
  ["Pot Wash", "Preparation"],
  ["Knee Operated Hand Wash", "Preparation"],
  ["Wall Mounted Cupboard", "Storage"],
  ["Base Cabinet With Drawer", "Storage"],
  ["Kitchen Hood With Fresh Air", "Others"],
  ["Four Tier Shelf", "Trolleys & Shelves"],
  ["Tray Trolley", "Trolleys & Shelves"],
  ["Flat Trolley", "Trolleys & Shelves"],
  ["Two Tier Trolley", "Trolleys & Shelves"],
  ["Three Tier Trolley", "Trolleys & Shelves"],
  ["Single Wall Shelf", "Trolleys & Shelves"],
  ["Double Shawarma Machine", "Cooking"],
  ["Single Shawarma Machine", "Cooking"],
  ["Chicken Grill", "Cooking"],
  ["BBQ Grill Unit", "Cooking"],
  ["Tandoor Oven", "Cooking"],
  ["Bain Marie", "Cooking"],
  ["GN Container", "Storage"],
  ["Cooking Range", "Cooking"],
  ["Chinese Cooking Range", "Cooking"],
  ["Poratha / Chapati Tawa", "Cooking"],
  ["Table Top Chiller / Freezer", "Refrigeration"],
  ["Juice Counter", "Refrigeration"],
  ["Turbic Fan", "Others"],
  ["Handrail Works", "Others"]
].map(([name, category], index) => ({ name, category, index }));

const productGrid = document.querySelector("#productGrid");
const emptyState = document.querySelector("#emptyState");
const searchInput = document.querySelector("#productSearch");
const tabs = document.querySelectorAll(".tab");
let activeFilter = "all";
const heroSlides = document.querySelectorAll(".hero-slide");
const heroDots = document.querySelectorAll(".hero-dot");
let activeSlide = 0;
let heroTimer;

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/\//g, " ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function renderProducts() {
  const term = searchInput.value.trim().toLowerCase();
  const filtered = products.filter((product) => {
    const matchesCategory = activeFilter === "all" || product.category === activeFilter;
    const matchesSearch = product.name.toLowerCase().includes(term);
    return matchesCategory && matchesSearch;
  });

  productGrid.innerHTML = filtered.map((product) => `
    <article class="product-card reveal is-visible" data-category="${product.category}">
      <div class="product-card__image">
        <img src="assets/products/${slugify(product.name)}.png" alt="${product.name}" loading="eager">
      </div>
      <div class="product-card__body">
        <h3>${product.name}</h3>
        <span class="badge">${product.category}</span>
      </div>
    </article>
  `).join("");

  emptyState.hidden = filtered.length > 0;
}

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    tabs.forEach((item) => item.classList.remove("is-active"));
    tab.classList.add("is-active");
    activeFilter = tab.dataset.filter;
    renderProducts();
  });
});

searchInput.addEventListener("input", renderProducts);

function showSlide(index) {
  activeSlide = (index + heroSlides.length) % heroSlides.length;
  heroSlides.forEach((slide, slideIndex) => {
    slide.classList.toggle("is-active", slideIndex === activeSlide);
  });
  heroDots.forEach((dot, dotIndex) => {
    dot.classList.toggle("is-active", dotIndex === activeSlide);
  });
}

function startHeroSlider() {
  clearInterval(heroTimer);
  heroTimer = setInterval(() => showSlide(activeSlide + 1), 6200);
}

document.querySelector("[data-hero-prev]").addEventListener("click", () => {
  showSlide(activeSlide - 1);
  startHeroSlider();
});

document.querySelector("[data-hero-next]").addEventListener("click", () => {
  showSlide(activeSlide + 1);
  startHeroSlider();
});

heroDots.forEach((dot) => {
  dot.addEventListener("click", () => {
    showSlide(Number(dot.dataset.slide));
    startHeroSlider();
  });
});

const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");

navToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("is-open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

navLinks.addEventListener("click", (event) => {
  if (event.target.matches("a")) {
    navLinks.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
  }
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.14 });

document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));

document.querySelector("#quote").addEventListener("submit", (event) => {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const message = [
    "Hello Rajwa, I need a quote.",
    `Name: ${form.get("name")}`,
    `Phone: ${form.get("phone")}`,
    `Email: ${form.get("email") || "Not provided"}`,
    `Requirement: ${form.get("message")}`
  ].join("\n");
  window.open(`https://wa.me/971569903629?text=${encodeURIComponent(message)}`, "_blank", "noopener");
});

renderProducts();
startHeroSlider();
