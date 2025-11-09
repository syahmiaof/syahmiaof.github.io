/* Global interactions: nav toggle, theme, starfield, project tilt, contact form */
const navToggle = document.getElementById('nav-toggle');
const mainNav = document.getElementById('main-nav');
const themeToggle = document.getElementById('theme-toggle');

function toggleNav(){
  if(!mainNav) return;
  const hidden = mainNav.classList.contains('hidden');
  mainNav.classList.toggle('hidden', !hidden);
}

if(navToggle){
  navToggle.addEventListener('click', toggleNav);
}

function setTheme(dark){
  if(!themeToggle) return;
  if(dark){
    document.body.classList.add('dark');
    themeToggle.textContent = '☀️';
  } else {
    document.body.classList.remove('dark');
    themeToggle.textContent = '🌙';
  }
  try{ localStorage.setItem('themeDark', dark ? '1' : '0'); } catch(e){}
}

// Initialize theme
(function(){
  const prefersDark = (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
  let stored = null;
  try{ stored = localStorage.getItem('themeDark'); }catch(e){}
  if(stored === null) setTheme(prefersDark);
  else setTheme(stored === '1');
})();

if(themeToggle){
  themeToggle.addEventListener('click', ()=>{
    setTheme(!document.body.classList.contains('dark'));
  });
}

// Contact quick action
function contactMe(){
  const mail = 'mailto:example@example.com?subject=Hello%20Syahmi';
  window.location.href = mail;
}

// Fill year
document.addEventListener('DOMContentLoaded', ()=>{
  const y = new Date().getFullYear();
  const el = document.getElementById('year');
  if(el) el.textContent = y;

  // Wire clear button
  const clear = document.getElementById('clear-form');
  if(clear){
    clear.addEventListener('click', ()=>{
      const form = document.getElementById('contact-form');
      if(form) form.reset();
    });
  }

  // Initialize project-card tilt
  const cards = document.querySelectorAll('.project-card');
  cards.forEach(card=>{
    card.addEventListener('mousemove', handleTilt);
    card.addEventListener('mouseleave', resetTilt);
    // accessibility: keyboard focus
    card.addEventListener('focus', ()=> card.classList.add('focus'));
    card.addEventListener('blur', ()=> card.classList.remove('focus'));
  });

  // Initialize starfield
  initStarfield();

  // Hero planet parallax (mouse)
  const heroWrap = document.querySelector('.planet-wrap');
  if(heroWrap){
    const planet = heroWrap.querySelector('.planet');
    const moon = heroWrap.querySelector('.moon');
    heroWrap.addEventListener('mousemove', (ev)=>{
      const r = heroWrap.getBoundingClientRect();
      const x = (ev.clientX - r.left) / r.width - 0.5; // -0.5..0.5
      const y = (ev.clientY - r.top) / r.height - 0.5;
      const rx = y * 8; const ry = x * -12;
      if(planet) planet.style.transform = `translate(-50%,-50%) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(10px)`;
      if(moon) moon.style.transform = `translateZ(30px) translate(${x * 18}px, ${y * 10}px)`;
    });
    heroWrap.addEventListener('mouseleave', ()=>{
      if(planet) planet.style.transform = '';
      if(moon) moon.style.transform = '';
    });
  }
});

function handleTilt(e){
  const el = e.currentTarget;
  const rect = el.getBoundingClientRect();
  const x = (e.clientX - rect.left) / rect.width;
  const y = (e.clientY - rect.top) / rect.height;
  const rx = (y - 0.5) * 12; // tilt range
  const ry = (x - 0.5) * -12;
  el.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(0)`;
}

function resetTilt(e){
  const el = e.currentTarget;
  el.style.transform = '';
}

/* Starfield particle background - lightweight canvas */
let starCanvas, starCtx, stars = [], starCount = 120, starW, starH, animId;
function initStarfield(){
  starCanvas = document.getElementById('starfield');
  if(!starCanvas) return;
  starCtx = starCanvas.getContext('2d');
  resizeCanvas();
  createStars();
  window.addEventListener('resize', ()=>{ resizeCanvas(); createStars(); });
  tick();
}

function resizeCanvas(){
  starW = window.innerWidth;
  starH = window.innerHeight;
  starCanvas.width = starW * devicePixelRatio;
  starCanvas.height = starH * devicePixelRatio;
  starCanvas.style.width = starW + 'px';
  starCanvas.style.height = starH + 'px';
  starCtx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);
}

function createStars(){
  stars = [];
  const count = Math.max(60, Math.round(starW / 12));
  for(let i=0;i<count;i++){
    stars.push({
      x: Math.random()*starW,
      y: Math.random()*starH,
      r: Math.random()*1.6 + 0.2,
      a: Math.random()*0.9 + 0.1,
      va: Math.random()*0.02 + 0.005
    });
  }
}

function tick(){
  animId = requestAnimationFrame(tick);
  starCtx.clearRect(0,0,starW,starH);
  for(const s of stars){
    s.a += (Math.random()*0.02 - 0.01) * s.va;
    if(s.a < 0.05) s.a = 0.05;
    if(s.a > 1) s.a = 1;
    starCtx.beginPath();
    starCtx.fillStyle = `rgba(255,255,255,${s.a})`;
    starCtx.arc(s.x, s.y, s.r, 0, Math.PI*2);
    starCtx.fill();
  }
}

// Clean up on unload
window.addEventListener('beforeunload', ()=>{ if(animId) cancelAnimationFrame(animId); });


