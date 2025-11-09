// Mobile nav toggle
const navToggle = document.getElementById('nav-toggle');
const mainNav = document.getElementById('main-nav');

if(navToggle){
  navToggle.addEventListener('click', ()=>{
    const visible = mainNav.getAttribute('data-visible') === 'true';
    mainNav.setAttribute('data-visible', String(!visible));
    mainNav.classList.toggle('hidden');
  });
}

// Theme toggle (persist in localStorage)
const themeToggle = document.getElementById('theme-toggle');
function setTheme(dark){
  if(dark){
    document.body.classList.add('dark');
    themeToggle.textContent = '☀️';
  } else {
    document.body.classList.remove('dark');
    themeToggle.textContent = '🌙';
  }
  try{ localStorage.setItem('themeDark', dark ? '1' : '0'); } catch(e){}
}

// Initialize theme from localStorage or system preference
(function(){
  const pref = (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
  let themeDark = null;
  try{ themeDark = localStorage.getItem('themeDark'); }catch(e){}
  if(themeDark === null){ setTheme(pref); }
  else{ setTheme(themeDark === '1'); }
})();

if(themeToggle){
  themeToggle.addEventListener('click', ()=>{
    const isDark = document.body.classList.contains('dark');
    setTheme(!isDark);
  });
}

// Simple contact action
function contactMe(){
  // fallback: open mailto or show contact section
  const mail = 'mailto:example@example.com?subject=Hello%20Syahmi';
  window.location.href = mail;
}

// Fill current year in footer
document.addEventListener('DOMContentLoaded', ()=>{
  const y = new Date().getFullYear();
  const el = document.getElementById('year');
  if(el) el.textContent = y;
});

