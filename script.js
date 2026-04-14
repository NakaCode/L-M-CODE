// Custom cursor with smooth trailing ring
const dot = document.querySelector('.cursor-img');
const ring = document.querySelector('.cursor-ring');

let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let ringX = mouseX;
let ringY = mouseY;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  dot.style.left = mouseX + 'px';
  dot.style.top = mouseY + 'px';
});

function animateRing() {
  ringX += (mouseX - ringX) * 0.18;
  ringY += (mouseY - ringY) * 0.18;
  ring.style.left = ringX + 'px';
  ring.style.top = ringY + 'px';
  requestAnimationFrame(animateRing);
}
animateRing();

// Hover states on interactive elements
const hoverTargets = document.querySelectorAll('a, button, .card, .step, input, textarea');
hoverTargets.forEach(el => {
  el.addEventListener('mouseenter', () => {
    ring.classList.add('hover');
    dot.classList.add('hover');
  });
  el.addEventListener('mouseleave', () => {
    ring.classList.remove('hover');
    dot.classList.remove('hover');
  });
});

// Hide cursor when leaving window
document.addEventListener('mouseleave', () => {
  dot.style.opacity = '0';
  ring.style.opacity = '0';
});
document.addEventListener('mouseenter', () => {
  dot.style.opacity = '1';
  ring.style.opacity = '1';
});

// Scroll reveal
const revealEls = document.querySelectorAll('.card, .step, .project, .section-head, .about-text, .about-visual, .cta-box, .hero-inner > *');
revealEls.forEach(el => el.classList.add('reveal'));

const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealEls.forEach(el => io.observe(el));

// Testimonial carousel — duplicate cards for seamless loop
const track = document.querySelector('.testimonial-track');
if (track) {
  const cards = Array.from(track.children);
  cards.forEach(card => {
    const clone = card.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    track.appendChild(clone);
  });
}

// Footer year
document.getElementById('year').textContent = new Date().getFullYear();
