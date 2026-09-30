const CONFIG={WEDDING_DATE:"2026-11-14T17:00:00+06:00",WHATSAPP_NUMBER:"996555123456"};
const $=(s,scope=document)=>scope.querySelector(s); const $$=(s,scope=document)=>[...scope.querySelectorAll(s)];
const entry=$("#entry"),openButton=$("#openInvitation"),page=$("#page"),audio=$("#bgMusic"),musicButton=$("#musicToggle");

function setMusicState(playing){
  musicButton?.classList.toggle("playing",playing);
  musicButton?.setAttribute("aria-label",playing?"Музыканы токтотуу":"Музыканы күйгүзүү");
}
async function startMusic(){
  if(!audio)return;
  try{audio.volume=.72;await audio.play();setMusicState(true)}catch(e){setMusicState(false)}
}
function openInvitation(){
  entry?.classList.add("is-hidden");
  document.body.classList.remove("locked");
  page?.setAttribute("aria-hidden","false");
  startMusic();
  setTimeout(initReveal,50);
}
if(openButton) openButton.onclick=openInvitation;

musicButton?.addEventListener("click",async()=>{
  if(!audio)return;
  if(audio.paused) await startMusic(); else{audio.pause();setMusicState(false)}
});

function initReveal(){
  const items=$$(".reveal");
  if(!("IntersectionObserver" in window)){items.forEach(x=>x.classList.add("visible"));return}
  const io=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){entry.target.classList.add("visible");io.unobserve(entry.target)}
    });
  },{threshold:.12});
  items.forEach(x=>io.observe(x));
}
function initCountdown(){
  const target=new Date(CONFIG.WEDDING_DATE).getTime();
  const nodes={days:$("#days"),hours:$("#hours"),minutes:$("#minutes"),seconds:$("#seconds")};
  const pad=n=>String(n).padStart(2,"0");
  function update(){
    let diff=Math.max(0,target-Date.now());
    nodes.days.textContent=pad(Math.floor(diff/86400000));
    nodes.hours.textContent=pad(Math.floor((diff%86400000)/3600000));
    nodes.minutes.textContent=pad(Math.floor((diff%3600000)/60000));
    nodes.seconds.textContent=pad(Math.floor((diff%60000)/1000));
  }
  update();setInterval(update,1000);
}
function initRSVP(){
  const form=$("#rsvpForm");
  form?.addEventListener("submit",e=>{
    e.preventDefault();
    const name=$("#guestName").value.trim(),attendance=$("#attendance").value,count=$("#guestCount").value,note=$("#guestMessage").value.trim();
    if(!name)return $("#guestName").focus();
    const lines=[`Саламатсызбы! Мен ${name}.`,attendance==="Ооба, катышам"?`Тойго катышам. Биз ${count} адам болобуз.`:"Тилекке каршы, тойго катыша албайм.",note?`Билдирүү: ${note}`:""].filter(Boolean);
    window.open(`https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`,"_blank","noopener,noreferrer");
  });
}
document.addEventListener("DOMContentLoaded",()=>{initCountdown();initRSVP()});
