const CONFIG = {
  WEDDING_DATE: "2026-11-14T17:00:00+06:00",
  WHATSAPP_NUMBER: "996555123456"
};

const $ = (s, scope = document) => scope.querySelector(s);
const $$ = (s, scope = document) => [...scope.querySelectorAll(s)];

function loader() {
  const el = $("#loader");
  window.addEventListener("load", () => {
    setTimeout(() => {
      el?.classList.add("is-hidden");
      document.body.classList.remove("is-loading");
    }, 1250);
  });
  setTimeout(() => {
    el?.classList.add("is-hidden");
    document.body.classList.remove("is-loading");
  }, 3200);
}

function reveals() {
  const items = $$(".reveal, .image-reveal");
  if (!("IntersectionObserver" in window)) {
    items.forEach(el => el.classList.add("is-visible"));
    return;
  }
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.14, rootMargin: "0px 0px -40px 0px" });

  items.forEach((el, i) => {
    el.style.transitionDelay = `${Math.min((i % 4) * 70, 210)}ms`;
    obs.observe(el);
  });
}

function countdown() {
  const target = new Date(CONFIG.WEDDING_DATE).getTime();
  if (Number.isNaN(target)) return;

  const nodes = {
    days: $("#days"), hours: $("#hours"),
    minutes: $("#minutes"), seconds: $("#seconds")
  };
  const two = n => String(n).padStart(2, "0");

  const update = () => {
    let diff = target - Date.now();
    if (diff < 0) diff = 0;
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    nodes.days.textContent = two(d);
    nodes.hours.textContent = two(h);
    nodes.minutes.textContent = two(m);
    nodes.seconds.textContent = two(s);
  };
  update();
  setInterval(update, 1000);
}

function music() {
  const audio = $("#bgMusic");
  const btn = $("#soundToggle");
  if (!audio || !btn) return;

  const setState = playing => {
    btn.classList.toggle("is-playing", playing);
    btn.setAttribute("aria-label", playing ? "Музыканы токтотуу" : "Музыканы күйгүзүү");
  };

  btn.addEventListener("click", async () => {
    try {
      if (audio.paused) {
        audio.volume = 0.72;
        await audio.play();
        setState(true);
      } else {
        audio.pause();
        setState(false);
      }
    } catch (e) {
      console.warn("Audio play blocked:", e);
    }
  });
}

function rsvp() {
  const form = $("#rsvpForm");
  if (!form) return;

  form.addEventListener("submit", e => {
    e.preventDefault();

    const name = $("#guestName").value.trim();
    const attendance = $("#attendance").value;
    const count = $("#guestCount").value;
    const note = $("#guestMessage").value.trim();

    if (!name) {
      $("#guestName").focus();
      return;
    }

    const lines = [
      `Саламатсызбы! Мен ${name}.`,
      attendance === "Ооба, катышам"
        ? `Тойго катышам. Биз ${count} адам болобуз.`
        : "Тилекке каршы, тойго катыша албайм.",
      note ? `Билдирүү: ${note}` : ""
    ].filter(Boolean);

    const url = `https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`;
    window.open(url, "_blank", "noopener,noreferrer");
  });
}

function scrollEffects() {
  const progress = $("#scrollProgress");
  const parallax = $$(".parallax-img");

  let ticking = false;

  const update = () => {
    const doc = document.documentElement;
    const max = Math.max(1, doc.scrollHeight - innerHeight);
    progress.style.width = `${Math.min(100, (scrollY / max) * 100)}%`;

    parallax.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > innerHeight) return;
      const center = rect.top + rect.height / 2 - innerHeight / 2;
      const offset = Math.max(-34, Math.min(34, center * -0.045));
      el.style.setProperty("--parallax", `${offset}px`);
    });

    ticking = false;
  };

  const onScroll = () => {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  };

  addEventListener("scroll", onScroll, { passive: true });
  addEventListener("resize", onScroll);
  update();
}

loader();
document.addEventListener("DOMContentLoaded", () => {
  reveals();
  countdown();
  music();
  rsvp();
  scrollEffects();
});
