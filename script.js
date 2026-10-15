const STORAGE_KEY = "milano-cart";
const cart = loadCart();
const cartDrawer = document.querySelector(".cart-drawer");
const drawerOverlay = document.querySelector(".drawer-overlay");
const cartItems = document.querySelector(".cart-items");
const cartEmpty = document.querySelector(".cart-empty");
const cartFooter = document.querySelector(".cart-footer");
const cartCount = document.querySelector(".cart-count");
const cartTitleCount = document.querySelector(".cart-title-count");
const cartTotal = document.querySelector(".cart-total strong");
const toast = document.querySelector(".toast");
const floatingCart = document.querySelector("#floating-cart");
const floatingCartButton = document.querySelector(".floating-cart-button");
const floatingCartCount = document.querySelector(".floating-cart-count");
const productModal = document.querySelector("#product-modal");
const productModalOverlay = document.querySelector(".product-modal-overlay");
const productModalClose = document.querySelector(".product-modal-close");
const productModalImage = document.querySelector("#product-modal-image");
const productModalName = document.querySelector("#product-modal-title");
const productModalPrice = document.querySelector("#product-modal-price");
const productModalDescription = document.querySelector("#product-modal-description");
const productColors = document.querySelector("#product-colors");
const productSizes = document.querySelector("#product-sizes");
const productModalAdd = document.querySelector("#product-modal-add");
let toastTimer;
let activeProduct = null;
let selectedColor = "";
let selectedSize = "";

const PRODUCT_VARIANTS = {
  "adidas-profile": {
    colors: [
      { name: "Blanco", value: "#f3efe8" },
      { name: "Negro", value: "#1c1c1c" },
      { name: "Azul", value: "#445d87" },
    ],
    sizes: [36, 37, 38, 39, 40, 41, 42],
  },
  "jordan-profile": {
    colors: [
      { name: "Blanco", value: "#f2efe9" },
      { name: "Rojo", value: "#be3b35" },
      { name: "Gris", value: "#8d8d8c" },
    ],
    sizes: [37, 38, 39, 40, 41, 42, 43],
  },
  "new-balance-profile": {
    colors: [
      { name: "Crema", value: "#d9c9b5" },
      { name: "Azul", value: "#2d4d7a" },
      { name: "Negro", value: "#1e1c1a" },
    ],
    sizes: [35, 36, 37, 38, 39, 40, 41],
  },
  "nike-profile": {
    colors: [
      { name: "Arena", value: "#c9b297" },
      { name: "Marrón", value: "#8a5e44" },
      { name: "Blanco", value: "#f3efe8" },
    ],
    sizes: [36, 37, 38, 39, 40, 41, 42],
  },
  "adidas-boost-profile": {
    colors: [
      { name: "Negro", value: "#171717" },
      { name: "Blanco", value: "#f3efe8" },
      { name: "Naranja", value: "#d97a4c" },
    ],
    sizes: [37, 38, 39, 40, 41, 42],
  },
  "nike-zoom-profile": {
    colors: [
      { name: "Rojo", value: "#c72a20" },
      { name: "Blanco", value: "#f0eee8" },
      { name: "Negro", value: "#1e1c1c" },
    ],
    sizes: [36, 37, 38, 39, 40, 41],
  },
  "handball-clear": {
    colors: [
      { name: "Rosa", value: "#f2b6c5" },
      { name: "Blanco", value: "#f4eee7" },
      { name: "Lila", value: "#b4a1d6" },
    ],
    sizes: [28, 29, 30, 31, 32, 33, 34, 35],
  },
  "jordan-travis": {
    colors: [
      { name: "Negro", value: "#1b1b1c" },
      { name: "Rojo", value: "#c72a20" },
      { name: "Blanco", value: "#f3efe8" },
    ],
    sizes: [38, 39, 40, 41, 42, 43],
  },
  "jordan-thunder": {
    colors: [
      { name: "Mostaza", value: "#c8972c" },
      { name: "Blanco", value: "#f3f0ed" },
      { name: "Naranja", value: "#d97a4c" },
    ],
    sizes: [28, 29, 30, 31, 32, 33, 34, 35],
  },
  "handball-earth": {
    colors: [
      { name: "Arena", value: "#c9b297" },
      { name: "Verde", value: "#70866f" },
      { name: "Marrón", value: "#6a4d3a" },
    ],
    sizes: [28, 29, 30, 31, 32, 33, 34, 35],
  },
  "jordan-mocha": {
    colors: [
      { name: "Blanco", value: "#f3efe8" },
      { name: "Gris", value: "#a5a19d" },
      { name: "Negro", value: "#171717" },
    ],
    sizes: [37, 38, 39, 40, 41, 42],
  },
  "nb-9060": {
    colors: [
      { name: "Gris", value: "#a1a3a7" },
      { name: "Azul", value: "#5b7594" },
      { name: "Blanco", value: "#f0efe9" },
    ],
    sizes: [36, 37, 38, 39, 40, 41, 42],
  },
  "rumbo-mini": {
    colors: [
      { name: "Rosa", value: "#f2b6c5" },
      { name: "Blanco", value: "#f3efe8" },
      { name: "Lila", value: "#b4a1d6" },
    ],
    sizes: [28, 29, 30, 31, 32, 33, 34, 35],
  },
  "rumbo-sun-sandal": {
    colors: [
      { name: "Arena", value: "#c9b297" },
      { name: "Coral", value: "#d97a4c" },
      { name: "Negro", value: "#1e1c1a" },
    ],
    sizes: [36, 37, 38, 39, 40, 41],
  },
  "rumbo-trail-boot": {
    colors: [
      { name: "Marrón", value: "#8a5e44" },
      { name: "Negro", value: "#1b1b1c" },
      { name: "Arena", value: "#c9b297" },
    ],
    sizes: [36, 37, 38, 39, 40, 41, 42],
  },
  "rumbo-trek-boot": {
    colors: [
      { name: "Marrón", value: "#8a5e44" },
      { name: "Negro", value: "#1b1b1c" },
      { name: "Arena", value: "#c9b297" },
    ],
    sizes: [36, 37, 38, 39, 40, 41, 42],
  },
};

function loadCart() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(saved)
      ? saved.filter(
          (item) =>
            item &&
            item.id &&
            Number.isFinite(item.price) &&
            Number.isFinite(item.quantity),
        )
      : [];
  } catch {
    return [];
  }
}

function saveCart() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 2200);
}

function renderFloatingCart() {
  const quantity = getCartQuantity();
  floatingCart.classList.toggle("has-items", quantity > 0);
  floatingCartCount.textContent = quantity;
}

function updateBodyScrollLock() {
  const isLocked =
    cartDrawer.classList.contains("is-open") ||
    productModal.classList.contains("is-open");
  document.body.style.overflow = isLocked ? "hidden" : "";
}

function openCart() {
  cartDrawer.classList.add("is-open");
  drawerOverlay.classList.add("is-visible");
  cartDrawer.setAttribute("aria-hidden", "false");
  drawerOverlay.setAttribute("aria-hidden", "false");
  updateBodyScrollLock();
  document.querySelector(".close-cart").focus();
}

function closeCart() {
  cartDrawer.classList.remove("is-open");
  drawerOverlay.classList.remove("is-visible");
  cartDrawer.setAttribute("aria-hidden", "true");
  drawerOverlay.setAttribute("aria-hidden", "true");
  updateBodyScrollLock();
}

function formatPrice(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function normalizeKey(value) {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function getProductConfig(productId) {
  return (
    PRODUCT_VARIANTS[productId] ?? {
      colors: [{ name: "Blanco", value: "#f3efe8" }],
      sizes: [39, 40, 41, 42],
    }
  );
}

function renderColorOptions(colors) {
  productColors.innerHTML = colors
    .map(
      (color) => `
        <button
          class="color-option ${selectedColor === color.name ? "is-selected" : ""}"
          type="button"
          data-color="${color.name}"
          title="${color.name}"
          aria-label="Seleccionar color ${color.name}"
          style="--swatch-color:${color.value};"
        >
          <span class="color-swatch"></span>
          <span>${color.name}</span>
        </button>
      `,
    )
    .join("");

  productColors.querySelectorAll(".color-option").forEach((button) => {
    button.addEventListener("click", () => {
      selectedColor = button.dataset.color;
      renderColorOptions(colors);
      updateModalButtonState();
    });
  });
}

function renderSizeOptions(sizes) {
  productSizes.innerHTML = sizes
    .map(
      (size) => `
        <button
          class="size-option ${selectedSize === String(size) ? "is-selected" : ""}"
          type="button"
          data-size="${size}"
          aria-label="Seleccionar talle ${size}"
        >
          ${size}
        </button>
      `,
    )
    .join("");

  productSizes.querySelectorAll(".size-option").forEach((button) => {
    button.addEventListener("click", () => {
      selectedSize = button.dataset.size;
      renderSizeOptions(sizes);
      updateModalButtonState();
    });
  });
}

function updateModalButtonState() {
  const isReady = Boolean(activeProduct && selectedColor && selectedSize);
  productModalAdd.disabled = !isReady;
  productModalAdd.textContent = isReady
    ? "Agregar al carrito"
    : "Selecciona color y talle";
}

function openProductModal(product) {
  const config = getProductConfig(product.id);
  activeProduct = {
    ...product,
    ...config,
  };
  selectedColor = config.colors[0]?.name || "";
  selectedSize = String(config.sizes[0] || "");

  productModalName.textContent = activeProduct.name;
  productModalPrice.textContent = formatPrice(activeProduct.price);
  productModalDescription.textContent = activeProduct.description || "";
  productModalImage.src = activeProduct.image;
  productModalImage.alt = activeProduct.name;

  renderColorOptions(config.colors);
  renderSizeOptions(config.sizes);
  updateModalButtonState();

  productModal.classList.add("is-open");
  productModalOverlay.classList.add("is-visible");
  productModal.setAttribute("aria-hidden", "false");
  productModalOverlay.setAttribute("aria-hidden", "false");
  updateBodyScrollLock();
}

function closeProductModal() {
  productModal.classList.remove("is-open");
  productModalOverlay.classList.remove("is-visible");
  productModal.setAttribute("aria-hidden", "true");
  productModalOverlay.setAttribute("aria-hidden", "true");
  activeProduct = null;
  selectedColor = "";
  selectedSize = "";
  updateBodyScrollLock();
}

function addToCart(product, options = {}) {
  const itemName = product.name;
  const itemId =
    product.variantId ||
    `${product.id}-${normalizeKey(options.color || product.color || "")}-${normalizeKey(options.size || product.size || "")}`;

  const item = {
    ...product,
    id: itemId,
    name: itemName,
    color: options.color || product.color || "",
    size: options.size || product.size || "",
    price: Number(product.price),
    quantity: 1,
  };

  const existing = cart.find((cartItem) => cartItem.id === item.id);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push(item);
  }

  saveCart();
  renderCart();
  showToast(`${item.name} · ${item.color} · Talle ${item.size} añadido al carrito`);
}

function getCartQuantity() {
  return cart.reduce((total, item) => total + item.quantity, 0);
}

function getCartTotal() {
  return cart.reduce((total, item) => total + item.price * item.quantity, 0);
}

function renderCart() {
  const quantity = getCartQuantity();
  cartCount.textContent = quantity;
  cartTitleCount.textContent = `(${quantity})`;
  cartTotal.textContent = formatPrice(getCartTotal());
  cartEmpty.classList.toggle("is-visible", quantity === 0);
  cartFooter.style.display = quantity === 0 ? "none" : "block";
  renderFloatingCart();
  cartItems.innerHTML = cart
    .map(
      (item) => `
        <article class="cart-item">
          <img src="${item.image}" alt="${item.name}">
          <div class="cart-item-info">
            <h3>${item.name}</h3>
            <p>${formatPrice(item.price)} · ${item.color || "Color"} · Talle ${item.size || "-"}</p>
            <div class="quantity" aria-label="Cantidad de ${item.name}">
              <button type="button" data-action="decrease" data-id="${item.id}" aria-label="Disminuir cantidad">−</button>
              <span>${item.quantity}</span>
              <button type="button" data-action="increase" data-id="${item.id}" aria-label="Aumentar cantidad">+</button>
            </div>
          </div>
          <div class="cart-item-price">
            <strong>${formatPrice(item.price * item.quantity)}</strong>
            <button class="remove-item" type="button" data-action="remove" data-id="${item.id}">Eliminar</button>
          </div>
        </article>
      `,
    )
    .join("");
}

document.querySelector(".cart-button").addEventListener("click", openCart);
floatingCartButton.addEventListener("click", () => {
  if (cartDrawer.classList.contains("is-open")) {
    closeCart();
    return;
  }

  openCart();
});
cartItems.addEventListener("click", (event) => {
  if (!(event.target instanceof Element)) return;

  const button = event.target.closest("button[data-action]");
  if (!button) return;

  const itemIndex = cart.findIndex((item) => item.id === button.dataset.id);
  if (itemIndex === -1) return;

  if (button.dataset.action === "remove") {
    cart.splice(itemIndex, 1);
  } else if (button.dataset.action === "increase") {
    cart[itemIndex].quantity += 1;
  } else if (button.dataset.action === "decrease") {
    cart[itemIndex].quantity = Math.max(1, cart[itemIndex].quantity - 1);
  } else {
    return;
  }

  saveCart();
  renderCart();
});
document
  .querySelectorAll(".close-cart")
  .forEach((button) => button.addEventListener("click", closeCart));
drawerOverlay.addEventListener("click", closeCart);
productModalOverlay.addEventListener("click", closeProductModal);
productModalClose.addEventListener("click", closeProductModal);
productModalAdd.addEventListener("click", () => {
  if (!activeProduct || !selectedColor || !selectedSize) {
    showToast("Seleccioná un color y un talle antes de continuar");
    return;
  }

  const variantId = `${activeProduct.id}-${normalizeKey(selectedColor)}-${normalizeKey(selectedSize)}`;

  addToCart(
    {
      ...activeProduct,
      id: activeProduct.id,
      name: activeProduct.name,
      image: activeProduct.image,
      price: Number(activeProduct.price),
    },
    { color: selectedColor, size: selectedSize, variantId },
  );

  closeProductModal();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && cartDrawer.classList.contains("is-open")) {
    closeCart();
    return;
  }

  if (event.key === "Escape" && productModal.classList.contains("is-open")) {
    closeProductModal();
  }
});

document.querySelectorAll(".product-card").forEach((card) => {
  const product = {
    id: card.dataset.id,
    name: card.dataset.name,
    description: card.dataset.description,
    price: Number(card.dataset.price),
    image: card.dataset.image,
  };

  card.addEventListener("click", (event) => {
    if (event.target.closest("button")) return;
    openProductModal(product);
  });

  card
    .querySelector(".quick-add")
    .addEventListener("click", (event) => {
      event.stopPropagation();
      openProductModal(product);
    });
});

document.querySelector(".checkout-button").addEventListener("click", () => {
  if (!cart.length) return;
  showToast(
    `Compra de muestra por ${formatPrice(getCartTotal())}. No se realizó ningún pago.`,
  );
  cart.splice(0, cart.length);
  saveCart();
  renderCart();
  closeCart();
});

const categoryCarousel = document.querySelector(".category-carousel");
if (categoryCarousel) {
  let categoryTimer;

  const getCategoryScrollStep = () => {
    const firstCard = categoryCarousel.querySelector(".category-card");
    if (!firstCard) return 0;

    const gap = Number.parseFloat(getComputedStyle(categoryCarousel).columnGap) || 0;
    return firstCard.getBoundingClientRect().width + gap;
  };

  const moveCategoryCarousel = (direction = 1) => {
    const step = getCategoryScrollStep();
    if (!step) return;

    const maxScroll = categoryCarousel.scrollWidth - categoryCarousel.clientWidth;

    if (direction > 0 && categoryCarousel.scrollLeft >= maxScroll - 1) {
      categoryCarousel.scrollTo({ left: 0, behavior: "smooth" });
    } else if (direction < 0 && categoryCarousel.scrollLeft <= 1) {
      categoryCarousel.scrollTo({ left: maxScroll, behavior: "smooth" });
    } else {
      categoryCarousel.scrollBy({ left: step * direction, behavior: "smooth" });
    }
  };

  const startCategoryTimer = () => {
    clearInterval(categoryTimer);
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      categoryTimer = setInterval(() => moveCategoryCarousel(), 5000);
    }
  };

  document.querySelector(".category-prev")?.addEventListener("click", () => {
    moveCategoryCarousel(-1);
    startCategoryTimer();
  });
  document.querySelector(".category-next")?.addEventListener("click", () => {
    moveCategoryCarousel();
    startCategoryTimer();
  });
  startCategoryTimer();

  setInterval(moveCategoryCarousel, 3000);
}

const slides = [...document.querySelectorAll(".hero-slide")];
const dots = [...document.querySelectorAll(".hero-dot")];
let activeSlide = 0;
let slideTimer;

function showSlide(index) {
  activeSlide = (index + slides.length) % slides.length;
  slides.forEach((slide, slideIndex) =>
    slide.classList.toggle("is-active", slideIndex === activeSlide),
  );
  dots.forEach((dot, dotIndex) => {
    const isActive = dotIndex === activeSlide;
    dot.classList.toggle("is-active", isActive);
    dot.setAttribute("aria-selected", String(isActive));
  });
}

function startCarousel() {
  clearInterval(slideTimer);
  slideTimer = setInterval(() => showSlide(activeSlide + 1), 5500);
}

const heroPrevious = document.querySelector(".hero-prev");
const heroNext = document.querySelector(".hero-next");
if (slides.length && heroPrevious && heroNext) {
  heroPrevious.addEventListener("click", () => {
    showSlide(activeSlide - 1);
    startCarousel();
  });
  heroNext.addEventListener("click", () => {
    showSlide(activeSlide + 1);
    startCarousel();
  });
  dots.forEach((dot, index) =>
    dot.addEventListener("click", () => {
      showSlide(index);
      startCarousel();
    }),
  );
  startCarousel();
}

const catalogFilters = document.querySelector(".catalog-filters");
if (catalogFilters) {
  const productCards = [...document.querySelectorAll(".catalog-grid .product-card")];
  const collectionFilter = catalogFilters.querySelector("#filter-collection");
  const styleFilter = catalogFilters.querySelector("#filter-style");
  const categoryFilter = catalogFilters.querySelector("#filter-category");
  const sizeFilter = catalogFilters.querySelector("#filter-size");
  const minimumPrice = catalogFilters.querySelector("#filter-min-price");
  const maximumPrice = catalogFilters.querySelector("#filter-max-price");
  const resetFilters = catalogFilters.querySelector(".filter-reset");
  const resultCount = document.querySelector("#catalog-result-count");
  const noResults = document.querySelector(".catalog-empty");
  const searchFilter = catalogFilters.querySelector("#filter-search");

  const initialParams = new URLSearchParams(window.location.search);
  const initialCategory = initialParams.get("categoria");
  if (
    initialCategory &&
    [...categoryFilter.options].some((option) => option.value === initialCategory)
  ) {
    categoryFilter.value = initialCategory;
  }
  if (initialParams.get("filtro") === "nuevos") {
    collectionFilter.value = "nuevos";
  }
  if (initialParams.has("buscar")) {
    searchFilter.value = initialParams.get("buscar");
    searchFilter.focus({ preventScroll: true });
  }

  const applyCatalogFilters = () => {
    const selectedCollection = collectionFilter.value;
    const selectedStyle = styleFilter.value;
    const selectedCategory = categoryFilter.value;
    const selectedSize = sizeFilter.value;
    const searchTerm = searchFilter.value.trim().toLocaleLowerCase();
    const minPrice = Number(minimumPrice.value) || 0;
    const maxPrice =
      maximumPrice.value === ""
        ? Number.POSITIVE_INFINITY
        : Number(maximumPrice.value);
    let visibleCount = 0;

    productCards.forEach((card) => {
      const matchesCollection =
        selectedCollection === "all" ||
        (selectedCollection === "nuevos" && card.dataset.new === "true");
      const matchesStyle =
        selectedStyle === "all" || card.dataset.style === selectedStyle;
      const matchesCategory =
        selectedCategory === "all" ||
        card.dataset.category.split(/\s+/).includes(selectedCategory);
      const availableSizes = card.dataset.sizes.split(",");
      const matchesSize =
        selectedSize === "all" || availableSizes.includes(selectedSize);
      const matchesSearch =
        !searchTerm ||
        card.dataset.name.toLocaleLowerCase().includes(searchTerm);
      const price = Number(card.dataset.price);
      const matchesPrice = price >= minPrice && price <= maxPrice;
      const isVisible =
        matchesCollection &&
        matchesStyle &&
        matchesCategory &&
        matchesSize &&
        matchesSearch &&
        matchesPrice;

      card.hidden = !isVisible;
      if (isVisible) visibleCount += 1;
    });

    resultCount.textContent = `${visibleCount} productos`;
    noResults.hidden = visibleCount > 0;
  };

  catalogFilters.addEventListener("input", applyCatalogFilters);
  catalogFilters.addEventListener("change", applyCatalogFilters);
  resetFilters.addEventListener("click", () => {
    catalogFilters.reset();
    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.delete("categoria");
    currentUrl.searchParams.delete("filtro");
    currentUrl.searchParams.delete("buscar");
    window.history.replaceState({}, "", currentUrl);
    applyCatalogFilters();
  });
  applyCatalogFilters();
}

document
  .querySelector(".search-button")
  .addEventListener("click", () => {
    const searchFilter = document.querySelector("#filter-search");
    if (searchFilter) {
      searchFilter.focus();
      searchFilter.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    window.location.href = "productos.html?buscar=";
  });
renderCart();
