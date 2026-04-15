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

// Testimonial carousel — JS-driven infinite scroll with drag support
const track = document.querySelector('.testimonial-track');
const carousel = document.querySelector('.testimonial-carousel');
if (track && carousel) {
  const originals = Array.from(track.children);
  const originalCount = originals.length;

  let offset = 0;
  let halfWidth = 0;
  let autoSpeed = 0.5; // px per frame (~30px/s @ 60fps)
  let isDragging = false;
  let isHovering = false;
  let dragStartX = 0;
  let dragStartOffset = 0;
  let velocity = 0;
  let lastDragX = 0;

  // Clone enough full sets so the track is always wider than the viewport
  // plus one loop period — otherwise the right side goes empty before wrapping.
  const ensureClones = () => {
    const firstClone = track.children[originalCount];
    if (!firstClone) return;
    halfWidth = firstClone.offsetLeft;
    const needed = carousel.offsetWidth + halfWidth;
    while (track.scrollWidth < needed) {
      for (let i = 0; i < originalCount; i++) {
        const clone = originals[i].cloneNode(true);
        clone.setAttribute('aria-hidden', 'true');
        track.appendChild(clone);
      }
    }
  };
  // Seed with one set of clones so ensureClones can measure the period.
  originals.forEach(card => {
    const clone = card.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    track.appendChild(clone);
  });

  const measure = () => { ensureClones(); };
  measure();
  window.addEventListener('resize', measure);
  window.addEventListener('load', measure);
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(measure);
  }

  const normalize = () => {
    if (offset <= -halfWidth) offset += halfWidth;
    if (offset > 0) offset -= halfWidth;
  };

  const tick = () => {
    if (!isDragging) {
      if (Math.abs(velocity) > 0.1) {
        offset += velocity;
        velocity *= 0.94;
      } else if (!isHovering) {
        offset -= autoSpeed;
      }
      normalize();
      track.style.transform = `translateX(${offset}px)`;
    }
    requestAnimationFrame(tick);
  };
  tick();

  carousel.addEventListener('mouseenter', () => { isHovering = true; });
  carousel.addEventListener('mouseleave', () => { isHovering = false; });

  const onDown = (clientX) => {
    isDragging = true;
    dragStartX = clientX;
    lastDragX = clientX;
    dragStartOffset = offset;
    velocity = 0;
    carousel.classList.add('dragging');
    dot.classList.add('grabbing');
    ring.classList.add('grabbing');
  };
  const onMove = (clientX) => {
    if (!isDragging) return;
    const delta = clientX - dragStartX;
    offset = dragStartOffset + delta;
    velocity = clientX - lastDragX;
    lastDragX = clientX;
    normalize();
    track.style.transform = `translateX(${offset}px)`;
  };
  const onUp = () => {
    if (!isDragging) return;
    isDragging = false;
    carousel.classList.remove('dragging');
    dot.classList.remove('grabbing');
    ring.classList.remove('grabbing');
  };

  carousel.addEventListener('mousedown', (e) => { e.preventDefault(); onDown(e.clientX); });
  window.addEventListener('mousemove', (e) => onMove(e.clientX));
  window.addEventListener('mouseup', onUp);

  carousel.addEventListener('touchstart', (e) => onDown(e.touches[0].clientX), { passive: true });
  window.addEventListener('touchmove', (e) => onMove(e.touches[0].clientX), { passive: true });
  window.addEventListener('touchend', onUp);
}

// Scroll rail — glow position follows scroll progress
const railGlow = document.querySelector('.scroll-rail-glow');
if (railGlow) {
  let ticking = false;
  const updateRail = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? scrollTop / docHeight : 0;
    const railHeight = window.innerHeight;
    const glowHeight = railHeight * 0.18;
    const maxTravel = railHeight - glowHeight;
    railGlow.style.transform = `translateY(${progress * maxTravel}px)`;
    ticking = false;
  };
  const onScroll = () => {
    if (!ticking) {
      requestAnimationFrame(updateRail);
      ticking = true;
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', updateRail);
  updateRail();
}

// Footer year
document.getElementById('year').textContent = new Date().getFullYear();

// FAQ Chat Widget
const faqWidget = document.getElementById('faqWidget');
const faqToggle = document.getElementById('faqToggle');
const faqBody = document.getElementById('faqBody');
const faqQuestions = document.getElementById('faqQuestions');

if (faqWidget && faqToggle && faqBody && faqQuestions) {
  faqToggle.addEventListener('click', () => {
    faqWidget.classList.toggle('open');
  });

  document.addEventListener('click', (e) => {
    if (!faqWidget.contains(e.target) && faqWidget.classList.contains('open')) {
      faqWidget.classList.remove('open');
    }
  });

  const scrollBottom = () => {
    faqBody.scrollTop = faqBody.scrollHeight;
  };

  faqQuestions.querySelectorAll('.faq-q').forEach(btn => {
    btn.addEventListener('click', () => {
      const question = btn.textContent;
      const answer = btn.getAttribute('data-a');

      const userMsg = document.createElement('div');
      userMsg.className = 'faq-msg faq-msg-user';
      userMsg.textContent = question;
      faqBody.appendChild(userMsg);
      btn.classList.add('used');
      scrollBottom();

      const typing = document.createElement('div');
      typing.className = 'faq-msg-typing';
      typing.innerHTML = '<span></span><span></span><span></span>';
      faqBody.appendChild(typing);
      scrollBottom();

      setTimeout(() => {
        typing.remove();
        const botMsg = document.createElement('div');
        botMsg.className = 'faq-msg faq-msg-bot';
        botMsg.textContent = answer;
        faqBody.appendChild(botMsg);
        scrollBottom();
      }, 750);
    });
  });
}
