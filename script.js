document.addEventListener("DOMContentLoaded", () => {
  const current = location.pathname.split("/").pop() || "index.html";
  const pages = [
    ["index.html", "Home"],
    ["about.html", "About Lesotho"],
    ["destinations.html", "Destinations"],
    ["services.html", "Activities"],
    ["gallery.html", "Photo Gallery"],
    ["contact.html", "Register & Contact"]
  ];

  const headerEl = document.getElementById("site-header");
  if (headerEl) {
    headerEl.innerHTML = `
      <nav class="navbar navbar-expand-lg sticky-top">
        <div class="container">
          <a class="navbar-brand" href="index.html">
            <span class="brandmark">L</span>
            <span>Discover <strong>Lesotho</strong></span>
          </a>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav" aria-controls="mainNav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="mainNav">
            <ul class="navbar-nav ms-auto align-items-lg-center">
              ${pages
                .map(([url, title]) => {
                  const isActive =
                    current === url ||
                    (url === "services.html" && current === "service.html") ||
                    (url === "contact.html" && current === "register.html") ||
                    (url === "index.html" && (current === "" || current === "/"));
                  return `
                <li class="nav-item">
                  <a class="nav-link ${isActive ? "active" : ""}" ${isActive ? 'aria-current="page"' : ""} href="${url}">${title}</a>
                </li>`;
                })
                .join("")}
              <li class="nav-item ms-lg-2 mt-2 mt-lg-0">
                <button id="themeToggle" class="theme-toggle" type="button" aria-label="Toggle color theme">☾ Dark mode</button>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    `;

    const navCollapseEl = document.getElementById("mainNav");
    if (navCollapseEl) {
      navCollapseEl.querySelectorAll(".nav-link").forEach((link) => {
        link.addEventListener("click", () => {
          if (window.innerWidth < 992 && typeof bootstrap !== "undefined") {
            const bsCollapse = bootstrap.Collapse.getInstance(navCollapseEl);
            if (bsCollapse) bsCollapse.hide();
          }
        });
      });
    }
  }

  const footerEl = document.getElementById("site-footer");
  if (footerEl) {
    footerEl.innerHTML = `
      <footer class="site-footer">
        <div class="container">
          <div class="row g-4">
            <div class="col-lg-5">
              <div class="footerbrand">
                <span class="brandmark">L</span>
                <span>Discover Lesotho</span>
              </div>
              <p class="mt-3">
                The Kingdom in the Sky ('Muso oa Lesotho). Exploring dramatic Maloti alpine peaks, living Basotho heritage, roaring waterfalls, and authentic highland hospitality.
              </p>
              <p class="text-white-50 small mb-0">
                <strong>National Motto:</strong> <em>Khotso, Pula, Nala</em> (Peace, Rain, Prosperity)
              </p>
            </div>
            <div class="col-6 col-lg-3">
              <h3 class="fs-5 text-white mb-3">Explore</h3>
              <ul class="footerlinks">
                ${pages.slice(0, 4).map(([url, title]) => `<li><a href="${url}">${title}</a></li>`).join("")}
              </ul>
            </div>
            <div class="col-6 col-lg-4">
              <h3 class="fs-5 text-white mb-3">Plan Your Highland Trip</h3>
              <ul class="footerlinks">
                <li><a href="gallery.html">Highland Photo Gallery</a></li>
                <li><a href="contact.html">Register & Contact Desk</a></li>
                <li><a href="services.html#travelTips">Travel & Border FAQ</a></li>
              </ul>
              <p class="small text-white-50 mt-3 mb-0">
                Website showcasing tourism in the Kingdom of Lesotho.
              </p>
            </div>
          </div>
          <div class="footerbottom d-flex flex-column flex-md-row justify-content-between align-items-center gap-2">
            <span>© <span id="year"></span> Discover Lesotho </span>
          </div>
        </div>
      </footer>
      <button id="backTop" class="backtop" aria-label="Back to top">↑</button>
    `;
  }

  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const themeBtn = document.getElementById("themeToggle");
  if (themeBtn) {
    if (localStorage.getItem("discoverLesothoTheme") === "dark") {
      document.body.classList.add("dark-mode");
    }
    const updateThemeLabel = () => {
      themeBtn.textContent = document.body.classList.contains("dark-mode") ? "☀ Light mode" : "☾ Dark mode";
    };
    updateThemeLabel();

    themeBtn.addEventListener("click", () => {
      document.body.classList.toggle("dark-mode");
      localStorage.setItem("discoverLesothoTheme", document.body.classList.contains("dark-mode") ? "dark" : "light");
      updateThemeLabel();
    });
  }

  const backBtn = document.getElementById("backTop");
  if (backBtn) {
    window.addEventListener("scroll", () => {
      backBtn.classList.toggle("visible", window.scrollY > 400);
    });
    backBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  const searchInput = document.getElementById("destinationSearch");
  if (searchInput) {
    const cards = [...document.querySelectorAll(".destination")];
    const filterButtons = [...document.querySelectorAll(".filter")];
    const noResultsEl = document.getElementById("noResults");
    let currentFilter = "all";

    const applyFilter = () => {
      const query = searchInput.value.toLowerCase().trim();
      let count = 0;

      cards.forEach((card) => {
        const textToSearch = (card.dataset.name + " " + card.textContent).toLowerCase();
        const matchesQuery = !query || textToSearch.includes(query);
        const cardCategories = (card.dataset.category || "").split(" ");
        const matchesCategory = currentFilter === "all" || cardCategories.includes(currentFilter);

        const isVisible = matchesQuery && matchesCategory;
        card.classList.toggle("hidden", !isVisible);
        if (isVisible) count++;
      });

      if (noResultsEl) {
        noResultsEl.classList.toggle("hidden", count > 0);
      }
    };

    searchInput.addEventListener("input", applyFilter);

    filterButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        currentFilter = btn.dataset.filter;
        filterButtons.forEach((b) => b.classList.toggle("active", b === btn));
        applyFilter();
      });
    });

    const clearBtn = document.getElementById("clearSearch");
    if (clearBtn) {
      clearBtn.addEventListener("click", () => {
        searchInput.value = "";
        currentFilter = "all";
        filterButtons.forEach((b) => b.classList.toggle("active", b.dataset.filter === "all"));
        applyFilter();
        searchInput.focus();
      });
    }
  }

  const tiles = [...document.querySelectorAll(".tile")];
  const galleryModalEl = document.getElementById("galleryModal");
  if (tiles.length && galleryModalEl && typeof bootstrap !== "undefined") {
    const modal = new bootstrap.Modal(galleryModalEl);
    const imgEl = document.getElementById("galleryPreview");
    const captionEl = document.getElementById("galleryCaption");
    const titleEl = document.getElementById("galleryModalLabel");
    let activeIndex = 0;

    const showPhoto = (index) => {
      activeIndex = (index + tiles.length) % tiles.length;
      const tile = tiles[activeIndex];
      const thumbnailImg = tile.querySelector("img");
      imgEl.src = tile.dataset.full;
      imgEl.alt = thumbnailImg ? thumbnailImg.alt : "Lesotho landscape";
      captionEl.textContent = tile.dataset.caption || "";
      if (titleEl) {
        titleEl.textContent = `Lesotho Gallery — Photo ${activeIndex + 1} of ${tiles.length}`;
      }
    };

    tiles.forEach((tile, idx) => {
      tile.addEventListener("click", () => {
        showPhoto(idx);
        modal.show();
      });
    });

    const prevBtn = document.getElementById("galleryPrev");
    const nextBtn = document.getElementById("galleryNext");
    if (prevBtn) prevBtn.addEventListener("click", () => showPhoto(activeIndex - 1));
    if (nextBtn) nextBtn.addEventListener("click", () => showPhoto(activeIndex + 1));

    document.addEventListener("keydown", (e) => {
      if (galleryModalEl.classList.contains("show")) {
        if (e.key === "ArrowRight") showPhoto(activeIndex + 1);
        if (e.key === "ArrowLeft") showPhoto(activeIndex - 1);
      }
    });
  }

  const activitySelect = document.getElementById("activityType");
  const countInput = document.getElementById("travellerCount");
  const totalDisplay = document.getElementById("estimateTotal");

  const updateCalculator = () => {
    if (!activitySelect || !countInput || !totalDisplay) return;
    let count = parseInt(countInput.value, 10);
    if (isNaN(count) || count < 1) count = 1;
    if (count > 30) count = 30;
    countInput.value = count;

    const pricePerPerson = Number(activitySelect.value) || 0;
    const totalCost = pricePerPerson * count;
    totalDisplay.textContent = "M" + totalCost.toLocaleString("en-US");
  };

  if (activitySelect && countInput) {
    activitySelect.addEventListener("change", updateCalculator);
    countInput.addEventListener("input", updateCalculator);
    updateCalculator();
  }

  const dateInput = document.getElementById("travelDate");
  if (dateInput) {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    dateInput.min = `${yyyy}-${mm}-${dd}`;
  }

  const setupForm = (formId, messageId, successText) => {
    const form = document.getElementById(formId);
    const messageBox = document.getElementById(messageId);
    if (!form || !messageBox) return;

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      e.stopPropagation();
      form.classList.add("was-validated");

      if (!form.checkValidity()) {
        messageBox.className = "form-message error";
        messageBox.textContent = "Please verify all required fields highlighted in red before sending.";
        const firstInvalid = form.querySelector(":invalid");
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      messageBox.className = "form-message success";
      messageBox.textContent = `${successText} (Note: Front-end demo submission — details verified locally).`;
      form.reset();
      form.classList.remove("was-validated");
      if (formId === "bookingForm") {
        updateCalculator();
      }
    });
  };

  const regForm = document.getElementById("registrationForm");
  if (regForm) {
    const password = document.getElementById("regPassword");
    const confirmPassword = document.getElementById("regConfirmPassword");
    const checkPasswordMatch = () => {
      if (password && confirmPassword) {
        if (confirmPassword.value && password.value !== confirmPassword.value) {
          confirmPassword.setCustomValidity("Passwords do not match");
        } else {
          confirmPassword.setCustomValidity("");
        }
      }
    };
    if (password && confirmPassword) {
      password.addEventListener("input", checkPasswordMatch);
      confirmPassword.addEventListener("input", checkPasswordMatch);
    }
  }

  setupForm("combinedForm", "combinedMessageBox", "Thank you! Your traveler registration and inquiry have been successfully received. A confirmation has been logged.");
  setupForm("bookingForm", "bookingMessageBox", "Thank you! Your Lesotho travel enquiry has been recorded.");
  setupForm("contactForm", "contactMessageBox", "Thank you! Your message to Discover Lesotho has been sent. Our mountain team will respond within 24 hours.");
  setupForm("registrationForm", "registerMessageBox", "Welcome to Discover Lesotho! Your traveler profile has been successfully registered.");
});
