// UI, content lists, rendering and animations. Database code is in db.js
// ---- EDIT HERE ----
const CONTACT={call:"03490178074",whatsapp:"03348364835",email:"bunerprimeagency@gmail.com",location:"Pir Baba, Buner"}; // the owner can change these from the Admin panel
let WA="";
const services=[["Digital Marketing","Strategy and campaigns that bring real customers."],["Social Media Marketing","Content and community across every platform."],["Meta Ads & Google Ads","Paid ads tuned for leads and sales."],["Web Development","Fast, modern websites and web apps."],["UI/UX Design","Interfaces people enjoy and understand."],["Graphic Design","Logos, branding and social creatives."],["Video Editing","Reels, ads and promos that hold attention."],["AI & Automation","Chatbots and workflows that save hours."],["Photography & Videography","Product and brand shoots, start to finish."],["Digital Tools & Subscriptions","Premium tools and subscriptions, set up for you."]];
const team=[["Mr Kamran Khan","CEO & Founder"],["Kamran Ahmad","Operation Manager"],["Saad Hadi","AI Automation"],["Muhsin Khan","Video Editor"],["Ahmad Jan","Web Developer"],["Abdul Basit","Digital Marketer"],["Jawad Khan","Videography"],["Adnan Khan","SEO Specialist"],["Sawaira Akbar","Meta & Google Ads"],["Shamla Khan","Graphic Designer"]]; // add photo: [name, role, "photo-url"]
const courses=[["Digital Marketing Basics","Learn how to market a business online.","Duration, fee and schedule: to be announced"],["Social Media Management","Plan, post and grow brand accounts.","Duration, fee and schedule: to be announced"],["Graphic Design Starter","Design tools and layout essentials.","Duration, fee and schedule: to be announced"]]; // add new courses here
const soon=[["New Services","More agency services launching soon."]];
// -------------------
const $=id=>document.getElementById(id),ini=n=>n.split(" ").map(w=>w[0]).join("");
$("sn").innerHTML=soon.map(c=>`<div class="card"><h3>${c[0]}</h3><p>${c[1]}</p><span class="tag">Coming soon</span></div>`).join("");
const WAICON='<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>';
const IC={call:'<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/></svg>',mail:'<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/></svg>',pin:'<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/></svg>'};
const intl=n=>{const d=String(n||"").replace(/\D/g,"");return d.startsWith("92")?d:"92"+d.replace(/^0/,"")};
const nice=n=>String(n||"").replace(/^(\d{4})(\d{7})$/,"$1 $2");
function toast(m){let t=document.getElementById("toast");if(!t){t=document.createElement("div");t.id="toast";t.setAttribute("role","status");document.body.append(t)}t.textContent=m;t.classList.add("on");clearTimeout(t._h);t._h=setTimeout(()=>t.classList.remove("on"),3200)}
function applyContact(){const C=CONTACT,E2=esc;WA=intl(C.whatsapp);const wl="https://wa.me/"+WA+"?text="+encodeURIComponent("Hello Buner Prime Agency (BPA), I want to know more about your services.");
$("wa2").href=wl;$("wa2").innerHTML=WAICON+"<span>WhatsApp</span>";$("wa3").href=wl;$("wa3").innerHTML=WAICON+" Get updates on WhatsApp";
const map="https://www.google.com/maps/search/?api=1&query="+encodeURIComponent(C.location);
const card=(cls,ico,lab,val,href,ext)=>`<a class="cc2 ${cls}" href="${E2(href)}"${ext?' target="_blank" rel="noopener"':""}><span class="ico">${ico}</span><span><small>${lab}</small><b>${E2(val)}</b></span></a>`;
$("ccards").innerHTML=card("",IC.call,"Call us",nice(C.call),"tel:+"+intl(C.call))+card("w",WAICON,"WhatsApp",nice(C.whatsapp),wl,1)+card("",IC.mail,"Email",C.email,"mailto:"+C.email)+card("",IC.pin,"Location",C.location,map,1);
$("fc").innerHTML=`<a href="tel:+${intl(C.call)}">${nice(C.call)}</a><br><a href="mailto:${E2(C.email)}">${E2(C.email)}</a><br>${E2(C.location)}`}
$("cf").onsubmit=async e=>{e.preventDefault();const f=e.target,b=f.querySelector("button");if(f.p.value.replace(/\D/g,"").length<10){toast("Please enter a valid phone number");f.p.focus();return}b.disabled=true;b.textContent="Sending...";if(typeof saveInquiry==="function"){try{await Promise.race([saveInquiry({name:f.n.value,phone:f.p.value,message:f.m.value}),new Promise(r=>setTimeout(r,1500))])}catch(x){}}toast("Thank you! Opening WhatsApp...");setTimeout(()=>{location.href="https://wa.me/"+WA+"?text="+encodeURIComponent(`Hello Buner Prime Agency (BPA),\nName: ${f.n.value}\nPhone: ${f.p.value}\n${f.m.value}`);b.disabled=false;b.textContent="Send on WhatsApp";f.reset()},600)};
$("burger").onclick=()=>$("menu").classList.toggle("open");
$("menu").onclick=()=>$("menu").classList.remove("open");


const esc=x=>String(x??"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const store={team:team.map(t=>({n:t[0],r:t[1],p:t[2]||""})),courses:courses.map(c=>({n:c[0],d:c[1],x:c[2]})),
services:services.map(a=>({n:a[0],d:a[1]})),
portfolio:[
{s:"Web Development",t:"Website project",i:"",l:""},
{s:"Graphic Design",t:"Brand design",i:"",l:""},
{s:"Video Editing",t:"Promo video",i:"",l:""},
{s:"Meta Ads & Google Ads",t:"Ad campaign",i:"",l:""},
{s:"Social Media Marketing",t:"Social media page",i:"",l:""},
{s:"Photography & Videography",t:"Product shoot",i:"",l:""}
]};
function renderSvc(){const E=esc;$("svc").innerHTML=store.services.map(s=>`<div class="card"><div class="ic">${E(ini(s.n).slice(0,2))}</div><h3>${E(s.n)}</h3><p>${E(s.d)}</p></div>`).join("");$("mq").innerHTML=[...store.services,...store.services].map(s=>`<span>${E(s.n)}</span>`).join("")}
let pf="All";
function renderPort(){const E=esc,names=store.services.map(x=>x.n);
$("ptabs").innerHTML=["All",...names].map(n=>`<button class="tab${n===pf?" on":""}" data-s="${E(n)}">${E(n)}</button>`).join("");
const items=store.portfolio.filter(p=>pf==="All"||p.s===pf);
$("port").innerHTML=items.length?items.map(p=>{const img=/^(https:|images\/|blob:|data:image\/)/.test(p.i||"")?`<img src="${E(p.i)}" alt="${E(p.t)}" loading="lazy">`:"";const inner=`${img}<div class="pcap"><span class="tg">${E(p.s)}</span><b>${E(p.t)}</b></div>`;return /^https:/.test(p.l||"")?`<a class="port pc" href="${E(p.l)}" target="_blank" rel="noopener">${inner}</a>`:`<div class="port pc">${inner}</div>`}).join(""):`<p class="sub" style="grid-column:1/-1">Projects for this service will be added soon.</p>`;
document.querySelectorAll("#ptabs .tab").forEach(b=>b.onclick=()=>{pf=b.dataset.s;renderPort()})}
function render(){const E=esc;
const tcard=t=>{let sl=String(t.n||"").toLowerCase().replace(/[^a-z]+/g,"-").replace(/^-|-$/g,"");const pk=sl.replace(/^mr-/,"");const src=/^(https:|images\/|blob:|data:image\/)/.test(t.p||"")?t.p:(window.PH&&(window.PH[sl]||window.PH[pk]))||`images/team/${pk}.jpg`;return`<div class="card tm"><div class="ring"><div class="ph"><img src="${E(src)}" alt="${E(t.n)}" style="width:100%;height:100%;object-fit:cover;border-radius:14px" onerror="this.parentNode.textContent='${ini(t.n||"?")}'"></div></div><div class="rolep">${E(t.r)}</div><div class="namep">${E(t.n)}</div></div>`};
$("tm3").innerHTML=store.team.slice(0,3).map(tcard).join("");$("tm").innerHTML=store.team.map(tcard).join("");
$("cs").innerHTML=store.courses.map(c=>`<div class="card"><div class="cimg">Course image</div><h3>${E(c.n)}</h3><p>${E(c.d)}</p><p style="margin-top:8px">${E(c.x)}</p><a class="btn g" style="margin-top:16px;padding:9px 18px" href="https://wa.me/${WA}?text=${encodeURIComponent("Hello Buner Prime Agency (BPA), I want to join: "+c.n)}">Enroll</a></div>`).join("");
document.querySelectorAll("#tm .card,#tm3 .card,#cs .card").forEach(c=>c.classList.add("rv","in"));renderPort();renderSvc()}
applyContact();
render();
// ---- animations ----
const rm=matchMedia("(prefers-reduced-motion: reduce)").matches;
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target);const b=e.target.querySelector("[data-n]");if(b)count(b)}}),{threshold:.15});
document.querySelectorAll(".card,.port,.step,details,.nums div").forEach((el,i)=>{if(!rm){el.classList.add("rv");el.style.transitionDelay=(i%5)*70+"ms"}io.observe(el)});
function count(b){const n=+b.dataset.n;if(rm){b.textContent=n;return}let i=0;const t=setInterval(()=>{b.textContent=++i;if(i>=n)clearInterval(t)},900/n)}
document.addEventListener("mousemove",e=>{const c=e.target.closest&&e.target.closest(".card");if(c){const r=c.getBoundingClientRect();c.style.setProperty("--mx",e.clientX-r.left+"px");c.style.setProperty("--my",e.clientY-r.top+"px")}
const h=document.querySelector(".hero");if(!rm&&h&&e.clientY<h.getBoundingClientRect().bottom){$("cube").style.transform=`rotateX(${18-(e.clientY/innerHeight-.5)*18}deg) rotateY(${-24+(e.clientX/innerWidth-.5)*30}deg)`}});
addEventListener("scroll",()=>{const d=document.documentElement;$("bar").style.width=scrollY/(d.scrollHeight-innerHeight)*100+"%";$("top").classList.toggle("show",scrollY>600)},{passive:true});
const words=["grow online.","get noticed.","sell more.","look premium."];let wi=0,ci=words[0].length,del=true;
(function type(){const w=words[wi];$("rot").textContent=w.slice(0,ci);let d=del?45:90;if(del){ci--;if(ci<0){del=false;wi=(wi+1)%words.length;ci=0}}else{ci++;if(ci>w.length){del=true;ci=w.length;d=1600}}setTimeout(type,d)})();
if(rm)$("rot").classList.remove("caret");
function go(p){document.body.className=p==="home"?"":"sub-"+p;if(p!=="home")scrollTo(0,0)}
function route(){const h=location.hash;go(h==="#courses-page"?"courses":h==="#soon-page"?"soon":h==="#team-page"?"team":"home")}
addEventListener("hashchange",route);route();
