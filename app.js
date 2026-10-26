// 2Hours site: header state, scroll reveals and the hero phone demo.
(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Header gets a frosted background once you scroll.
  const top = document.getElementById('top');
  const onScroll = () => top && top.classList.toggle('scrolled', scrollY > 8);
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Reveal on scroll (fast ease-out, staggered with --d).
  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => e.isIntersecting && (e.target.classList.add('in'), io.unobserve(e.target))),
    { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
  );
  document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

  // ---------- Hero phone: one story, on a loop ----------
  const phone = document.getElementById('phone');
  if (!phone) return;
  const b1 = document.getElementById('b1');
  const b2 = document.getElementById('b2');
  const tap = document.getElementById('tap');
  const shield = document.getElementById('shield');
  const bar = document.getElementById('bar');
  const steps = document.getElementById('steps');
  const faces = shield.querySelectorAll('.faces img');
  const C = 352;

  const face = (i) => faces.forEach((f, j) => f.classList.toggle('on', j === i));
  const setSteps = (n) => {
    steps.textContent = n;
    bar.style.strokeDashoffset = String(C * (1 - n / 300));
  };

  if (reduced) {
    phone.classList.add('t7', 'locked');
    shield.classList.add('show');
    face(1);
    setSteps(218);
    return;
  }

  let timers = [];
  let raf = 0;
  const at = (ms, fn) => timers.push(setTimeout(fn, ms));
  const ease = (p) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);

  const count = (dur) => {
    const t0 = performance.now();
    const tick = (now) => {
      const p = Math.min(1, (now - t0) / dur);
      const n = Math.round(ease(p) * 300);
      setSteps(n);
      if (n > 110) face(1);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
  };

  const reset = () => {
    timers.forEach(clearTimeout);
    timers = [];
    cancelAnimationFrame(raf);
    phone.classList.remove('t7', 'locked');
    [b1, b2].forEach((b) => b.classList.remove('show'));
    shield.classList.remove('show', 'hide', 'won');
    tap.classList.remove('go');
    face(0);
    setSteps(0);
  };

  const play = () => {
    reset();
    at(700, () => phone.classList.add('t7'));
    at(950, () => b1.classList.add('show'));
    at(1250, () => phone.classList.add('locked'));
    at(3000, () => b1.classList.remove('show'));
    at(3300, () => {
      void tap.offsetWidth; // restart the tap ripple
      tap.classList.add('go');
    });
    at(3750, () => shield.classList.add('show'));
    at(4500, () => count(2600));
    at(7250, () => {
      shield.classList.add('won');
      face(2);
    });
    at(8300, () => {
      shield.classList.add('hide');
      shield.classList.remove('show');
    });
    at(8550, () => phone.classList.remove('locked'));
    at(8900, () => b2.classList.add('show'));
    at(11300, () => b2.classList.remove('show'));
    at(12000, play);
  };

  // Only run while the phone is on screen.
  let running = false;
  new IntersectionObserver(
    ([e]) => {
      if (e.isIntersecting && !running) {
        running = true;
        play();
      } else if (!e.isIntersecting && running) {
        running = false;
        reset();
      }
    },
    { threshold: 0.25 },
  ).observe(phone);
})();
