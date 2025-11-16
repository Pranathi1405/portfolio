// Smooth internal link scrolling
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click', (e)=>{
    const href = a.getAttribute('href');
    if(!href || href === '#') return;
    e.preventDefault();
    const id = href.slice(1);
    const el = document.getElementById(id);
    if(el) el.scrollIntoView({behavior:'smooth', block:'start'});
  });
});

// IntersectionObserver with staggered child reveals (medium dynamic)
const panels = document.querySelectorAll('.panel');

const revealPanel = (panel) => {
  const base = parseFloat(panel.dataset.stagger) || parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--stagger-base')) || 0.06;
  // collect revealable children in DOM order
  const items = panel.querySelectorAll('.reveal-line, .reveal, .reveal-photo, .reveal-card, .reveal-chips');
  items.forEach((it, i) => {
    // calculate stagger delay (medium intensity)
    const delay = (i * base) + (Math.random() * 0.02); // slight jitter for organic feel
    it.style.transitionDelay = `${delay}s`;
    // for multi-line reveals, add small micro stagger for words/lines
    if(it.classList.contains('reveal-line')) it.style.transitionDuration = '520ms';
    if(it.classList.contains('reveal-photo')) {
      // special transform for photo: rotate + scale
      it.style.transform = 'rotate(-6deg) translateY(8px) scale(0.98)';
      it.style.opacity = '0';
      setTimeout(()=> {
        it.style.transition = 'transform 720ms cubic-bezier(.22,.9,.2,1), opacity 500ms ease';
        it.style.transform = 'none';
        it.style.opacity = '1';
      }, (delay * 1000) + 80);
      return;
    }
    // apply visible by letting CSS handle using .visible on panel
    // but force a tick so transitionDelay applies predictably
  });
};

// Create intersection observer
const io = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.classList.add('visible');
      revealPanel(entry.target);
    }
  });
}, {threshold: 0.28});

// Observe panels
panels.forEach(p => io.observe(p));

// Insert current year
const yearEl = document.getElementById('year');
if(yearEl) yearEl.textContent = new Date().getFullYear();

// Keyboard quick navigation (up/down)
let panelIndex = 0;
const visiblePanels = Array.from(document.querySelectorAll('.panel'));
window.addEventListener('keydown', (e)=>{
  if(e.key === 'ArrowDown'){ panelIndex = Math.min(visiblePanels.length-1, panelIndex+1); visiblePanels[panelIndex].scrollIntoView({behavior:'smooth'}); }
  if(e.key === 'ArrowUp'){ panelIndex = Math.max(0, panelIndex-1); visiblePanels[panelIndex].scrollIntoView({behavior:'smooth'}); }
});

// Mobile menu simple toggle
const menuBtn = document.getElementById('menuBtn');
const topnav = document.querySelector('.topnav');
if(menuBtn){
  menuBtn.addEventListener('click', ()=>{
    if(topnav.style.display === 'block') topnav.style.display = '';
    else topnav.style.display = 'block';
  });
}
