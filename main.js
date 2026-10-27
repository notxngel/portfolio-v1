/* AMStudio — menú móvil, acordeón, carrusel y formulario (EN / ES) */

const lang = document.documentElement.lang === 'es' ? 'es' : 'en';
const t = {
  en: {
    required: 'This field is required.',
    email: 'Enter a valid email, like name@example.com.',
    fix: 'Please fix the highlighted fields.',
    opening: 'Opening your email app…',
    subject: 'Web project',
  },
  es: {
    required: 'Este campo es obligatorio.',
    email: 'Escribe un correo válido, como nombre@ejemplo.com.',
    fix: 'Revisa los campos marcados.',
    opening: 'Abriendo tu correo…',
    subject: 'Proyecto web',
  },
}[lang];

// ---------- Menú móvil (diálogo con foco atrapado) ----------
const menu = document.getElementById('mobile-menu');
const menuToggle = document.getElementById('menu-toggle');
const menuClose = document.getElementById('menu-close');
const pageRegions = document.querySelectorAll('.site-header, main, .site-footer');

function setMenu(open) {
  menu.hidden = !open;
  menuToggle.setAttribute('aria-expanded', String(open));
  document.body.style.overflow = open ? 'hidden' : '';
  pageRegions.forEach(region => { region.inert = open; });
  (open ? menuClose : menuToggle).focus();
}

menuToggle.addEventListener('click', () => setMenu(true));
menuClose.addEventListener('click', () => setMenu(false));
menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));

menu.addEventListener('keydown', event => {
  if (event.key === 'Escape') return setMenu(false);
  if (event.key !== 'Tab') return;

  const focusables = menu.querySelectorAll('button, a');
  const first = focusables[0];
  const last = focusables[focusables.length - 1];
  if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
  else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
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
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');

document.querySelectorAll('[data-carousel]').forEach(button => {
  button.addEventListener('click', () => {
    const card = carousel.querySelector('.card');
    const gap = parseFloat(getComputedStyle(carousel).columnGap) || 0;
    const direction = button.dataset.carousel === 'next' ? 1 : -1;
    carousel.scrollBy({
      left: (card.offsetWidth + gap) * direction,
      behavior: reduceMotion.matches ? 'auto' : 'smooth',
    });
  });
});

// ---------- Formulario de contacto ----------
// GitHub Pages no procesa formularios: el mensaje se abre en el correo del visitante.
const form = document.getElementById('contact-form');
const status = document.getElementById('form-status');

function validate(field) {
  const error = document.getElementById(`${field.id}-error`);
  let message = '';
  if (field.validity.valueMissing) message = t.required;
  else if (field.validity.typeMismatch) message = t.email;

  error.textContent = message;
  field.setAttribute('aria-invalid', String(Boolean(message)));
  return !message;
}

form.querySelectorAll('input, textarea').forEach(field => {
  // Revalida mientras escribe solo si ya estaba marcado como inválido
  field.addEventListener('input', () => {
    if (field.getAttribute('aria-invalid') === 'true') validate(field);
  });
});

form.addEventListener('submit', event => {
  event.preventDefault();

  const fields = [...form.querySelectorAll('input, textarea')];
  const invalid = fields.filter(field => !validate(field));

  if (invalid.length) {
    status.textContent = t.fix;
    invalid[0].focus();
    return;
  }

  const data = new FormData(form);
  const subject = `${t.subject} — ${data.get('name')}`;
  const body = `${data.get('message')}\n\n${data.get('name')}\n${data.get('email')}`;

  status.textContent = t.opening;
  window.location.href =
    `mailto:contact@ajmatamoros.dev?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
});
