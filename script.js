const menuToggle = document.querySelector('.menu-toggle');
const navRight = document.querySelector('.nav-right');

menuToggle?.addEventListener('click', () => {
  const open = navRight.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(open));
});

document.querySelectorAll('.nav-right a').forEach((link) => {
  link.addEventListener('click', () => {
    navRight.classList.remove('open');
    menuToggle?.setAttribute('aria-expanded', 'false');
  });
});

const dots = document.querySelectorAll('.slider-dots button');
dots.forEach((dot) => {
  dot.addEventListener('click', () => {
    dots.forEach((item) => item.classList.remove('active'));
    dot.classList.add('active');
  });
});

const form = document.querySelector('#contact-form');
form?.addEventListener('submit', (event) => {
  event.preventDefault();
  const status = form.querySelector('.form-status');
  status.textContent = 'Thanks — your message is ready to be sent to our team.';
  form.reset();
});
