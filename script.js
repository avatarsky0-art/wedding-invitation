
const CONFIG={WEDDING_DATE:"2026-11-14T17:00:00+06:00",WHATSAPP_NUMBER:"996555123456"};
const $=(s,scope=document)=>scope.querySelector(s),$$=(s,scope=document)=>[...scope.querySelectorAll(s)];
const audio=$("#bgMusic"),openLink=$("#openInvitation"),musicBtn=$("#musicBtn");
async function playMusic(){try{audio.volume=.72;await audio.play();musicBtn.classList.add("playing");musicBtn.setAttribute("aria-label","Музыканы токтотуу")}catch(e){}}
openLink?.addEventListener("click",()=>{playMusic()});
musicBtn?.addEventListener("click",async()=>{if(audio.paused){await playMusic()}else{audio.pause();musicBtn.classList.remove("playing");musicBtn.setAttribute("aria-label","Музыканы күйгүзүү")}});
function countdown(){const target=new Date(CONFIG.WEDDING_DATE).getTime(),pad=n=>String(n).padStart(2,"0");function u(){let d=Math.max(0,target-Date.now());$("#days").textContent=pad(Math.floor(d/86400000));$("#hours").textContent=pad(Math.floor((d%86400000)/3600000));$("#minutes").textContent=pad(Math.floor((d%3600000)/60000));$("#seconds").textContent=pad(Math.floor((d%60000)/1000))}u();setInterval(u,1000)}
function reveals(){const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("visible");io.unobserve(e.target)}}),{threshold:.12});$$('.reveal').forEach(el=>io.observe(el))}
$("#rsvpForm")?.addEventListener("submit",e=>{e.preventDefault();const n=$("#guestName").value.trim(),a=$("#attendance").value,c=$("#guestCount").value,m=$("#guestMessage").value.trim();if(!n)return $("#guestName").focus();const lines=[`Саламатсызбы! Мен ${n}.`,a==="Ооба, катышам"?`Тойго катышам. Биз ${c} адам болобуз.`:"Тилекке каршы, тойго катыша албайм.",m?`Билдирүү: ${m}`:""].filter(Boolean);window.open(`https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`,"_blank","noopener,noreferrer")});
document.addEventListener("DOMContentLoaded",()=>{countdown();reveals()});
