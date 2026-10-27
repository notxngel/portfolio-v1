/* AMStudio — menú móvil, acordeón, carrusel y formulario */

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
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && !menu.hidden) setMenu(false);
});

// Si la pantalla crece con el menú abierto, ciérralo
matchMedia('(min-width: 901px)').addEventListener('change', event => {
  if (event.matches && !menu.hidden) setMenu(false);
});

// ---------- Acordeón (Proceso) ----------
const accordionItems = document.querySelectorAll('.accordion-item');

accordionItems.forEach(item => {
  const trigger = item.querySelector('.accordion-trigger');

  trigger.addEventListener('click', () => {
    const wasOpen = item.classList.contains('is-open');

    // Solo un paso abierto a la vez
    accordionItems.forEach(other => {
      other.classList.remove('is-open');
      other.querySelector('.accordion-trigger').setAttribute('aria-expanded', 'false');
      other.querySelector('.accordion-panel').hidden = true;
    });

    if (!wasOpen) {
      item.classList.add('is-open');
      trigger.setAttribute('aria-expanded', 'true');
      item.querySelector('.accordion-panel').hidden = false;
    }
  });
});

// ---------- Carrusel ----------
const carousel = document.getElementById('carousel');

document.querySelectorAll('[data-carousel]').forEach(button => {
  button.addEventListener('click', () => {
    const card = carousel.querySelector('.card');
    const gap = parseFloat(getComputedStyle(carousel).columnGap) || 0;
    const direction = button.dataset.carousel === 'next' ? 1 : -1;
    carousel.scrollBy({ left: (card.offsetWidth + gap) * direction, behavior: 'smooth' });
  });
});

// ---------- Formulario de contacto ----------
// GitHub Pages no procesa formularios: el mensaje se abre en el correo del visitante.
const form = document.getElementById('contact-form');
const status = document.getElementById('form-status');

form.addEventListener('submit', event => {
  event.preventDefault();

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
