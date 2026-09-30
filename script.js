// ======================================================
// WEDDING CONFIG — ОСНОВНЫЕ ДАННЫЕ МЕНЯЙТЕ ТОЛЬКО ЗДЕСЬ
// ======================================================
const CONFIG = {
  GROOM_NAME: "Азамат",
  BRIDE_NAME: "Айдана",

  // Формат: YYYY-MM-DDTHH:MM:SS+06:00
  // Для Кыргызстана обычно используется +06:00.
  WEDDING_DATE: "2026-12-12T17:00:00+06:00",

  VENUE_NAME: "Royal Hall",
  VENUE_ADDRESS: "Бишкек шаары, мисал дарек 12",
  MAP_URL: "https://maps.google.com/",

  // Только цифры: код страны + номер. Например Кыргызстан: 996555123456
  WHATSAPP_NUMBER: "996555123456",

  // Необязательно. Оставьте пустым "", если Google Forms не нужен.
  GOOGLE_FORM_URL: ""
};
// ======================================================

const MONTHS_KY = [
  "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
  "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"
];

const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

function formatTwoDigits(value) {
  return String(value).padStart(2, "0");
}

function populateWeddingData() {
  $$("[data-groom]").forEach((el) => {
    el.textContent = CONFIG.GROOM_NAME;
  });

  $$("[data-bride]").forEach((el) => {
    el.textContent = CONFIG.BRIDE_NAME;
  });

  const venueName = $("[data-venue-name]");
  const venueAddress = $("[data-venue-address]");
  const mapButton = $("#mapButton");

  if (venueName) venueName.textContent = CONFIG.VENUE_NAME;
  if (venueAddress) venueAddress.textContent = CONFIG.VENUE_ADDRESS;

  if (mapButton) {
    mapButton.href = CONFIG.MAP_URL || "#";
    if (!CONFIG.MAP_URL || CONFIG.MAP_URL === "#") {
      mapButton.setAttribute("aria-disabled", "true");
    }
  }

  const weddingDate = new Date(CONFIG.WEDDING_DATE);

  if (!Number.isNaN(weddingDate.getTime())) {
    const day = formatTwoDigits(weddingDate.getDate());
    const month = MONTHS_KY[weddingDate.getMonth()];
    const year = weddingDate.getFullYear();

    $$("[data-date-day]").forEach((el) => (el.textContent = day));
    $$("[data-date-month]").forEach((el) => (el.textContent = month));
    $$("[data-date-year]").forEach((el) => (el.textContent = year));

    const footerDate = $("#footerDate");
    if (footerDate) {
      footerDate.textContent = `${day} • ${formatTwoDigits(weddingDate.getMonth() + 1)} • ${year}`;
    }
  }

  // Browser title can be changed dynamically.
  document.title = `${CONFIG.GROOM_NAME} & ${CONFIG.BRIDE_NAME} — Wedding Invitation`;

  const googleFormLink = $("#googleFormLink");
  if (googleFormLink && CONFIG.GOOGLE_FORM_URL) {
    googleFormLink.href = CONFIG.GOOGLE_FORM_URL;
    googleFormLink.hidden = false;
  }
}

function initLoader() {
  const loader = $("#loader");

  document.body.classList.add("is-loading");

  window.addEventListener("load", () => {
    window.setTimeout(() => {
      loader?.classList.add("is-hidden");
      document.body.classList.remove("is-loading");
    }, 1350);
  });

  // Fallback: do not trap the visitor if some external asset is slow.
  window.setTimeout(() => {
    loader?.classList.add("is-hidden");
    document.body.classList.remove("is-loading");
  }, 3200);
}

function initCountdown() {
  const target = new Date(CONFIG.WEDDING_DATE).getTime();
  const countdown = $("#countdown");
  const done = $("#countdownDone");

  if (Number.isNaN(target)) {
    console.warn("WEDDING_DATE форматы туура эмес.");
    return;
  }

  const nodes = {
    days: $("#days"),
    hours: $("#hours"),
    minutes: $("#minutes"),
    seconds: $("#seconds")
  };

  const update = () => {
    const distance = target - Date.now();

    if (distance <= 0) {
      if (countdown) countdown.hidden = true;
      if (done) done.hidden = false;
      return false;
    }

    const day = Math.floor(distance / 86_400_000);
    const hour = Math.floor((distance % 86_400_000) / 3_600_000);
    const minute = Math.floor((distance % 3_600_000) / 60_000);
    const second = Math.floor((distance % 60_000) / 1_000);

    if (nodes.days) nodes.days.textContent = formatTwoDigits(day);
    if (nodes.hours) nodes.hours.textContent = formatTwoDigits(hour);
    if (nodes.minutes) nodes.minutes.textContent = formatTwoDigits(minute);
    if (nodes.seconds) nodes.seconds.textContent = formatTwoDigits(second);

    return true;
  };

  update();

  const interval = window.setInterval(() => {
    const keepRunning = update();
    if (!keepRunning) window.clearInterval(interval);
  }, 1000);
}

function initRevealAnimations() {
  const elements = $$(".reveal:not(.is-visible)");

  if (!("IntersectionObserver" in window)) {
    elements.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        obs.unobserve(entry.target);
      });
    },
    {
      threshold: 0.14,
      rootMargin: "0px 0px -40px 0px"
    }
  );

  elements.forEach((el) => observer.observe(el));
}

function initMusic() {
  const audio = $("#bgMusic");
  const toggle = $("#musicToggle");

  if (!audio || !toggle) return;

  toggle.addEventListener("click", async () => {
    try {
      if (audio.paused) {
        await audio.play();
        toggle.classList.add("is-playing");
        toggle.setAttribute("aria-label", "Музыканы токтотуу");
      } else {
        audio.pause();
        toggle.classList.remove("is-playing");
        toggle.setAttribute("aria-label", "Музыканы күйгүзүү");
      }
    } catch (error) {
      console.warn("Музыканы иштетүү мүмкүн болгон жок:", error);
    }
  });

  audio.addEventListener("ended", () => {
    toggle.classList.remove("is-playing");
  });

  // If music.mp3 has not been added yet, hide the inactive control.
  audio.addEventListener("error", () => {
    toggle.hidden = true;
  });
}

function initRSVP() {
  const form = $("#rsvpForm");

  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = $("#guestName")?.value.trim();
    const count = $("#guestCount")?.value || "1";
    const message = $("#guestMessage")?.value.trim();
    const attendance =
      $('input[name="attendance"]:checked')?.value || "Ооба, катышам";

    if (!name) {
      $("#guestName")?.focus();
      return;
    }

    if (!CONFIG.WHATSAPP_NUMBER) {
      alert("WHATSAPP_NUMBER толтурулган эмес.");
      return;
    }

    const attending = attendance.startsWith("Ооба");

    const lines = attending
      ? [
          `Саламатсызбы! Мен ${name}, тойго катышам.`,
          `Биз ${count} адам болобуз.`,
          message ? `Каалоо/билдирүү: ${message}` : ""
        ]
      : [
          `Саламатсызбы! Мен ${name}.`,
          "Тилекке каршы, тойго катыша албайм.",
          message ? `Каалоо/билдирүү: ${message}` : ""
        ];

    const text = lines.filter(Boolean).join("\n");
    const url = `https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;

    window.open(url, "_blank", "noopener,noreferrer");
  });
}

function initLightbox() {
  const lightbox = $("#lightbox");
  const image = $("#lightboxImage");
  const closeButton = $("#lightboxClose");
  const items = $$("[data-lightbox]");

  if (!lightbox || !image || !closeButton) return;

  let lastFocusedElement = null;

  const open = (src, alt, trigger) => {
    lastFocusedElement = trigger;
    image.src = src;
    image.alt = alt || "Wedding photo";
    lightbox.hidden = false;
    document.body.classList.add("lightbox-open");
    closeButton.focus();
  };

  const close = () => {
    lightbox.hidden = true;
    image.src = "";
    document.body.classList.remove("lightbox-open");
    lastFocusedElement?.focus();
  };

  items.forEach((item) => {
    item.addEventListener("click", () => {
      const img = $("img", item);
      open(item.dataset.lightbox, img?.alt, item);
    });
  });

  closeButton.addEventListener("click", close);

  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) close();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !lightbox.hidden) close();
  });
}

function initMapSafety() {
  const mapButton = $("#mapButton");

  mapButton?.addEventListener("click", (event) => {
    if (!CONFIG.MAP_URL || CONFIG.MAP_URL === "#") {
      event.preventDefault();
      alert("MAP_URL азырынча кошула элек.");
    }
  });
}

populateWeddingData();
initLoader();

document.addEventListener("DOMContentLoaded", () => {
  initCountdown();
  initRevealAnimations();
  initMusic();
  initRSVP();
  initLightbox();
  initMapSafety();
});
