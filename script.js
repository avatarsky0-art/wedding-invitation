
const CONFIG = {
  WEDDING_DATE: "2026-11-14T17:00:00+06:00",
  WHATSAPP_NUMBER: "996555123456"
};

const $ = (s, scope = document) => scope.querySelector(s);
const $$ = (s, scope = document) => [...scope.querySelectorAll(s)];

const gate = $("#gate");
const openButton = $("#openInvite");
const site = $("#site");
const audio = $("#bgMusic");
const musicToggle = $("#musicToggle");
const musicPlayer = $("#musicPlayer");

function setMusicState(playing) {
  musicToggle?.classList.toggle("is-playing", playing);
  musicToggle?.setAttribute("aria-label", playing ? "Музыканы токтотуу" : "Музыканы күйгүзүү");
}

async function startMusic() {
  if (!audio) return;
  try {
    audio.volume = 0.72;
    await audio.play();
    setMusicState(true);
  } catch (error) {
    setMusicState(false);
  }
}

window.openInvitation = function openInvitation() {
  gate?.classList.add("is-open");
  document.body.classList.remove("is-locked");
  site?.setAttribute("aria-hidden", "false");
  startMusic();
  setTimeout(initReveal, 50);
};

openButton?.addEventListener("click", window.openInvitation);

musicToggle?.addEventListener("click", async () => {
  if (!audio) return;
  if (audio.paused) await startMusic();
  else { audio.pause(); setMusicState(false); }
});

musicPlayer?.addEventListener("click", async () => {
  if (!audio) return;
  if (audio.paused) await startMusic();
  else { audio.pause(); setMusicState(false); }
});

function initReveal() {
  const nodes = $$(".reveal:not(.is-visible)");
  if (!("IntersectionObserver" in window)) {
    nodes.forEach(n => n.classList.add("is-visible"));
    return;
  }
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12 });
  nodes.forEach(node => observer.observe(node));
}

function initCountdown() {
  const target = new Date(CONFIG.WEDDING_DATE).getTime();
  const pad = n => String(n).padStart(2, "0");
  const nodes = { days: $("#days"), hours: $("#hours"), minutes: $("#minutes"), seconds: $("#seconds") };
  function tick() {
    let diff = Math.max(0, target - Date.now());
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    if (nodes.days) nodes.days.textContent = pad(days);
    if (nodes.hours) nodes.hours.textContent = pad(hours);
    if (nodes.minutes) nodes.minutes.textContent = pad(minutes);
    if (nodes.seconds) nodes.seconds.textContent = pad(seconds);
  }
  tick();
  setInterval(tick, 1000);
}

function initRsvp() {
  const form = $("#rsvpForm");
  form?.addEventListener("submit", event => {
    event.preventDefault();
    const name = $("#guestName")?.value.trim();
    const attendance = $("#attendance")?.value;
    const count = $("#guestCount")?.value;
    const note = $("#guestMessage")?.value.trim();
    if (!name) return $("#guestName")?.focus();
    const lines = [
      `Саламатсызбы! Мен ${name}.`,
      attendance === "Ооба, катышам" ? `Тойго катышам. Биз ${count} адам болобуз.` : "Тилекке каршы, тойго катыша албайм.",
      note ? `Билдирүү: ${note}` : ""
    ].filter(Boolean);
    const url = `https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`;
    window.open(url, "_blank", "noopener,noreferrer");
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initCountdown();
  initRsvp();
});
