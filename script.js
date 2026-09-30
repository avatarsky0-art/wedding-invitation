
const CONFIG = {
  WEDDING_DATE: '2026-11-14T17:00:00+06:00',
  WHATSAPP_NUMBER: '996555123456'
};

const qs = (s, scope=document) => scope.querySelector(s);
const qsa = (s, scope=document) => [...scope.querySelectorAll(s)];

const cover = qs('#cover');
const openBtn = qs('#openInvitation');
const invitation = qs('#invitation');
const audio = qs('#bgMusic');
const musicToggle = qs('#musicToggle');
const playerRow = qs('#playerRow');

function setMusicState(playing){
  musicToggle.classList.toggle('is-playing', playing);
  musicToggle.setAttribute('aria-label', playing ? 'Музыканы токтотуу' : 'Музыканы күйгүзүү');
}

async function playMusic(){
  try{
    audio.volume = 0.72;
    await audio.play();
    setMusicState(true);
  }catch(e){
    setMusicState(false);
  }
}

function openInvitation(){
  cover.classList.add('is-hidden');
  document.body.classList.remove('locked');
  invitation.setAttribute('aria-hidden','false');
  playMusic();
  setTimeout(()=>revealOnScroll(), 60);
}

openBtn?.addEventListener('click', openInvitation);
playerRow?.addEventListener('click', async ()=>{
  if(audio.paused) await playMusic();
  else { audio.pause(); setMusicState(false); }
});
musicToggle?.addEventListener('click', async ()=>{
  if(audio.paused) await playMusic();
  else { audio.pause(); setMusicState(false); }
});

function countdown(){
  const target = new Date(CONFIG.WEDDING_DATE).getTime();
  const nodes = {days:qs('#days'),hours:qs('#hours'),minutes:qs('#minutes'),seconds:qs('#seconds')};
  const pad = n => String(n).padStart(2,'0');
  function update(){
    let diff = Math.max(0, target - Date.now());
    const d = Math.floor(diff/86400000);
    const h = Math.floor((diff%86400000)/3600000);
    const m = Math.floor((diff%3600000)/60000);
    const s = Math.floor((diff%60000)/1000);
    nodes.days.textContent = pad(d);
    nodes.hours.textContent = pad(h);
    nodes.minutes.textContent = pad(m);
    nodes.seconds.textContent = pad(s);
  }
  update();
  setInterval(update,1000);
}

function rsvp(){
  const form = qs('#rsvpForm');
  form?.addEventListener('submit', e=>{
    e.preventDefault();
    const name = qs('#guestName').value.trim();
    const attendance = qs('#attendance').value;
    const count = qs('#guestCount').value;
    const note = qs('#guestMessage').value.trim();
    if(!name) return qs('#guestName').focus();
    const text = [
      `Саламатсызбы! Мен ${name}.`,
      attendance === 'Ооба, катышам' ? `Тойго катышам. Биз ${count} адам болобуз.` : 'Тилекке каршы, тойго катыша албайм.',
      note ? `Билдирүү: ${note}` : ''
    ].filter(Boolean).join('
');
    const url = `https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
    window.open(url,'_blank','noopener,noreferrer');
  });
}

function revealOnScroll(){
  const items = qsa('.reveal');
  const io = new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  },{threshold:.14});
  items.forEach(el=>io.observe(el));
}

document.addEventListener('DOMContentLoaded', ()=>{
  countdown();
  rsvp();
});
