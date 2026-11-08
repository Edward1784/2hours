// Reveal on scroll: quick, once.
const io = new IntersectionObserver(
  (entries) => {
    for (const e of entries) {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    }
  },
  { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
);
document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

// Sunny: asleep with the mask down until you wake it. Pupils follow the pointer.
const sunny = document.getElementById('sunny');
const hint = document.getElementById('hint');
if (sunny) {
  let timer;
  sunny.addEventListener('click', () => {
    const waking = sunny.classList.contains('asleep');
    sunny.classList.toggle('asleep', !waking);
    sunny.classList.remove('waving');
    hint.classList.add('gone');
    if (waking) {
      clearTimeout(timer);
      void sunny.offsetWidth;
      sunny.classList.add('waving');
      timer = setTimeout(() => sunny.classList.remove('waving'), 1500);
    }
  });
  const pupils = sunny.querySelector('.pupils');
  addEventListener(
    'pointermove',
    (e) => {
      const r = sunny.getBoundingClientRect();
      const x = Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width / 2)) / 420));
      const y = Math.max(-1, Math.min(1, (e.clientY - (r.top + r.height / 2)) / 420));
      pupils.style.transform = `translate(${x * 14}px, ${y * 10}px)`;
    },
    { passive: true },
  );
}

// Tour tabs.
const COPY = {
  home: 'Your next lock, your streak and your garden, all at a glance.',
  patrol: 'Beat the lock, and Sunny checks you stayed up.',
  insights: 'Every morning you beat, and how fast you got up.',
  garden: 'Beat your locks, earn sunshine, grow a little garden.',
};
const tourImg = document.querySelector('#tour-phone img');
const tabCopy = document.getElementById('tab-copy');
document.querySelectorAll('.tabs button').forEach((b) => {
  b.addEventListener('click', () => {
    document.querySelectorAll('.tabs button').forEach((x) => x.classList.toggle('on', x === b));
    swap(tourImg, `/assets/screens/${b.dataset.tab}.webp`);
    tabCopy.textContent = COPY[b.dataset.tab];
  });
});

// Mission tiles drive the phone.
const missionImg = document.querySelector('#mission-phone img');
document.querySelectorAll('#tiles .tile').forEach((t) => {
  t.addEventListener('click', () => {
    document.querySelectorAll('#tiles .tile').forEach((x) => x.classList.toggle('on', x === t));
    swap(missionImg, `/assets/screens/${t.dataset.mission}.webp`);
  });
});

function swap(img, src) {
  img.classList.add('swap');
  const next = new Image();
  next.onload = () => {
    img.src = src;
    requestAnimationFrame(() => img.classList.remove('swap'));
  };
  next.src = src;
}

// The closing sun rises as you scroll to it.
const sky = document.getElementById('sky');
if (sky && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const sun = sky.querySelector('.rise');
  let ticking = false;
  const update = () => {
    ticking = false;
    const r = sky.getBoundingClientRect();
    const p = Math.max(0, Math.min(1, (innerHeight - r.top) / (innerHeight * 0.9)));
    sun.style.transform = `translate(-50%, ${(1 - p) * 62}%)`;
  };
  addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    },
    { passive: true },
  );
  update();
}

// Header goes solid after the hero.
const header = document.querySelector('.top');
addEventListener('scroll', () => header.classList.toggle('scrolled', scrollY > 24), { passive: true });
