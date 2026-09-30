const CONFIG = {
  WEDDING_DATE: "2026-11-14T17:00:00+06:00",
  WHATSAPP_NUMBER: "996555123456"
};

const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

const audio = $("#bgMusic");
const soundButton = $("#soundToggle");
const envelopeScreen = $("#envelopeScreen");
const envelope = $("#openEnvelope");
const openHint = $("#openHint");
const main = $("#invitationSite");

function updateSoundState(isPlaying) {
  soundButton?.classList.toggle("is-playing", isPlaying);
  soundButton?.setAttribute(
    "aria-label",
    isPlaying ? "Музыканы токтотуу" : "Музыканы күйгүзүү"
  );
}

/*
  Браузер уруксат берсе музыка баракча ачылганда эле башталат.
  iPhone/Safari/Chrome autoplay'ду бөгөттөсө, конвертти биринчи басканда
  ошол user interaction аркылуу музыка сөзсүз иштетилет.
*/
async function tryAutoplay() {
  if (!audio) return;
  audio.volume = 0.72;
  try {
    await audio.play();
    updateSoundState(true);
  } catch {
    updateSoundState(false);
  }
}

async function ensureMusicStarts() {
  if (!audio || !audio.paused) return;
  try {
    audio.volume = 0.72;
    await audio.play();
    updateSoundState(true);
  } catch (error) {
    console.warn("Музыканы иштетүүгө браузер уруксат берген жок:", error);
  }
}

let opening = false;

async function openInvitation() {
  if (opening) return;
  opening = true;

  await ensureMusicStarts();

  envelope?.classList.add("is-open");

  window.setTimeout(() => {
    envelopeScreen?.classList.add("is-leaving");
    document.body.classList.remove("intro-active");
    main?.setAttribute("aria-hidden", "false");

    window.setTimeout(() => {
      reveals();
      scrollEffects();
    }, 80);
  }, 980);
}

envelope?.addEventListener("click", openInvitation);
openHint?.addEventListener("click", openInvitation);

soundButton?.addEventListener("click", async () => {
  if (!audio) return;

  if (audio.paused) {
    try {
      await audio.play();
      updateSoundState(true);
    } catch {}
  } else {
    audio.pause();
    updateSoundState(false);
  }
});

function reveals() {
  const items = $$(".reveal:not(.is-visible), .image-reveal:not(.is-visible)");

  if (!("IntersectionObserver" in window)) {
    items.forEach(el => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, {
    threshold: 0.14,
    rootMargin: "0px 0px -42px 0px"
  });

  items.forEach((el, index) => {
    el.style.transitionDelay = `${Math.min((index % 4) * 70, 210)}ms`;
    observer.observe(el);
  });
}

function countdown() {
  const target = new Date(CONFIG.WEDDING_DATE).getTime();
  if (Number.isNaN(target)) return;

  const nodes = {
    days: $("#days"),
    hours: $("#hours"),
    minutes: $("#minutes"),
    seconds: $("#seconds")
  };

  const two = n => String(n).padStart(2, "0");

  const update = () => {
    let difference = target - Date.now();
    if (difference < 0) difference = 0;

    const days = Math.floor(difference / 86400000);
    const hours = Math.floor((difference % 86400000) / 3600000);
    const minutes = Math.floor((difference % 3600000) / 60000);
    const seconds = Math.floor((difference % 60000) / 1000);

    if (nodes.days) nodes.days.textContent = two(days);
    if (nodes.hours) nodes.hours.textContent = two(hours);
    if (nodes.minutes) nodes.minutes.textContent = two(minutes);
    if (nodes.seconds) nodes.seconds.textContent = two(seconds);
  };

  update();
  setInterval(update, 1000);
}

function rsvp() {
  const form = $("#rsvpForm");
  if (!form) return;

  form.addEventListener("submit", event => {
    event.preventDefault();

    const name = $("#guestName")?.value.trim();
    const attendance = $("#attendance")?.value;
    const count = $("#guestCount")?.value;
    const note = $("#guestMessage")?.value.trim();

    if (!name) {
      $("#guestName")?.focus();
      return;
    }

    const lines = [
      `Саламатсызбы! Мен ${name}.`,
      attendance === "Ооба, катышам"
        ? `Тойго катышам. Биз ${count} адам болобуз.`
        : "Тилекке каршы, тойго катыша албайм.",
      note ? `Билдирүү: ${note}` : ""
    ].filter(Boolean);

    const url =
      `https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`;

    window.open(url, "_blank", "noopener,noreferrer");
  });
}

function scrollEffects() {
  const progress = $("#scrollProgress");
  const parallaxItems = $$(".parallax-img");
  let ticking = false;

  const update = () => {
    const root = document.documentElement;
    const maxScroll = Math.max(1, root.scrollHeight - innerHeight);

    if (progress) {
      progress.style.width = `${Math.min(100, (scrollY / maxScroll) * 100)}%`;
    }

    parallaxItems.forEach(item => {
      const rect = item.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > innerHeight) return;

      const center = rect.top + rect.height / 2 - innerHeight / 2;
      const offset = Math.max(-34, Math.min(34, center * -0.045));
      item.style.setProperty("--parallax", `${offset}px`);
    });

    ticking = false;
  };

  const requestUpdate = () => {
    if (ticking) return;
    requestAnimationFrame(update);
    ticking = true;
  };

  addEventListener("scroll", requestUpdate, { passive: true });
  addEventListener("resize", requestUpdate);
  update();
}

document.addEventListener("DOMContentLoaded", () => {
  countdown();
  rsvp();
  tryAutoplay();
});
