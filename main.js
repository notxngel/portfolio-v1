/* AMStudio — menú, acordeón, tabs, carrusel y formulario */

// ---------- Menú móvil ----------
const menu = document.getElementById('mobile-menu');
const menuToggle = document.getElementById('menu-toggle');
const menuClose = document.getElementById('menu-close');

function setMenu(open) {
  menu.hidden = !open;
  menuToggle.setAttribute('aria-expanded', String(open));
  document.body.style.overflow = open ? 'hidden' : '';
  (open ? menuClose : menuToggle).focus();
}

menuToggle.addEventListener('click', () => setMenu(true));
menuClose.addEventListener('click', () => setMenu(false));
menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && !menu.hidden) setMenu(false);
});

// ---------- Acordeón (Proceso) ----------
const accordionItems = document.querySelectorAll('.accordion-item');

accordionItems.forEach(item => {
  const trigger = item.querySelector('.accordion-trigger');
  const panel = item.querySelector('.accordion-panel');

  trigger.addEventListener('click', () => {
    const isOpen = item.classList.contains('is-open');

    // Solo un paso abierto a la vez
    accordionItems.forEach(other => {
      other.classList.remove('is-open');
      other.querySelector('.accordion-trigger').setAttribute('aria-expanded', 'false');
      other.querySelector('.accordion-panel').hidden = true;
    });

    if (!isOpen) {
      item.classList.add('is-open');
      trigger.setAttribute('aria-expanded', 'true');
      panel.hidden = false;
    }
  });
});

// ---------- Tabs (Stack) ----------
const tabs = Array.from(document.querySelectorAll('[role="tab"]'));

function selectTab(tab) {
  tabs.forEach(t => {
    const selected = t === tab;
    t.setAttribute('aria-selected', String(selected));
    t.tabIndex = selected ? 0 : -1;
    document.getElementById(t.getAttribute('aria-controls')).hidden = !selected;
  });
  tab.focus();
}

tabs.forEach((tab, i) => {
  tab.addEventListener('click', () => selectTab(tab));
  tab.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') selectTab(tabs[(i + 1) % tabs.length]);
    if (e.key === 'ArrowLeft') selectTab(tabs[(i - 1 + tabs.length) % tabs.length]);
  });
});

// ---------- Carrusel ----------
const carousel = document.getElementById('carousel');

document.querySelectorAll('[data-carousel]').forEach(button => {
  button.addEventListener('click', () => {
    const card = carousel.querySelector('.carousel-card');
    const gap = parseFloat(getComputedStyle(carousel).columnGap) || 0;
    const step = card.offsetWidth + gap;
    const direction = button.dataset.carousel === 'next' ? 1 : -1;
    carousel.scrollBy({ left: step * direction, behavior: 'smooth' });
  });
});

// ---------- Formulario de contacto ----------
// GitHub Pages no procesa formularios, así que el mensaje se abre en el
// correo del visitante. Si migras a Netlify, puedes usar Netlify Forms.
const form = document.getElementById('contact-form');
const status = document.getElementById('form-status');

form.addEventListener('submit', e => {
  e.preventDefault();

  if (!form.checkValidity()) {
    status.textContent = 'Completa los tres campos, por favor.';
    form.querySelector(':invalid').focus();
    return;
  }

  const data = new FormData(form);
  const subject = `Proyecto web — ${data.get('nombre')}`;
  const body = `${data.get('mensaje')}\n\n${data.get('nombre')}\n${data.get('correo')}`;

  window.location.href =
    `mailto:contact@ajmatamoros.dev?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  status.textContent = 'Abriendo tu correo…';
});
