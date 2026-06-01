import { useEffect, useRef, useState } from 'react';

const prefersReduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isTouch = () =>
  typeof window !== 'undefined' &&
  window.matchMedia &&
  window.matchMedia('(hover: none)').matches;

export function hexA(hex, a) {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16),
    g = parseInt(h.slice(2, 4), 16),
    b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${a})`;
}
export function hexRgb(hex) {
  const h = hex.replace('#', '');
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}

/* ───────── useInView ───────── */
export function useInView(opts = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const check = () => {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      if (r.top < vh * (1 - (opts.threshold ?? 0.1)) && r.bottom > 0) {
        setInView(true);
        return true;
      }
      return false;
    };
    if (check()) return;
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => { if (e.isIntersecting) { setInView(true); io.unobserve(el); } }),
      { threshold: opts.threshold ?? 0.1, rootMargin: opts.rootMargin ?? '0px 0px -6% 0px' },
    );
    io.observe(el);
    const t = setTimeout(check, 600);
    return () => { io.disconnect(); clearTimeout(t); };
  }, []);
  return [ref, inView];
}

/* ───────── Reveal / Enter ───────── */
export function Reveal({ children, delay = 0, y = 20, style = {}, className = '', as: Tag = 'div' }) {
  const [ref, inView] = useInView();
  return (
    <Tag
      ref={ref}
      className={className}
      style={{
        ...style,
        transform: inView ? 'translateY(0)' : `translateY(${y}px)`,
        transition: `transform .8s cubic-bezier(.2,.8,.2,1) ${delay}ms`,
        willChange: 'transform',
      }}
    >
      {children}
    </Tag>
  );
}

export function Enter({ children, delay = 0, style = {} }) {
  const [pre, setPre] = useState(true);
  useEffect(() => {
    const raf = requestAnimationFrame(() => requestAnimationFrame(() => setPre(false)));
    const t = setTimeout(() => setPre(false), 80);
    return () => { cancelAnimationFrame(raf); clearTimeout(t); };
  }, []);
  return (
    <div className={'enter' + (pre ? ' pre' : '')} style={{ transitionDelay: delay + 'ms', ...style }}>
      {children}
    </div>
  );
}

/* ───────── MaskLines (kinetic headline) ───────── */
export function MaskLines({ lines, className = '', lineClass = '', delay = 0, stagger = 100, as: Tag = 'div' }) {
  const [mounted, setMounted] = useState(false);
  const [failsafe, setFailsafe] = useState(false);
  useEffect(() => {
    const raf = requestAnimationFrame(() => requestAnimationFrame(() => setMounted(true)));
    const t = setTimeout(() => setMounted(true), 100);
    const fs = setTimeout(() => setFailsafe(true), 1400 + delay + lines.length * stagger);
    return () => { cancelAnimationFrame(raf); clearTimeout(t); clearTimeout(fs); };
  }, []);
  return (
    <Tag className={`mask-lines ${className}`}>
      {lines.map((ln, i) => (
        <span className="mask-line" key={i}>
          <span
            className={`mask-inner ${mounted ? 'in' : ''} ${failsafe ? 'shown' : ''} ${lineClass}`}
            style={{ transitionDelay: delay + i * stagger + 'ms' }}
          >
            {ln}
          </span>
        </span>
      ))}
    </Tag>
  );
}

/* ───────── useCountUp ───────── */
export function useCountUp(target, { duration = 1500 } = {}) {
  const [ref, inView] = useInView();
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let raf, start;
    const tick = (ts) => {
      if (!start) start = ts;
      const p = Math.min(1, (ts - start) / duration);
      setVal(target * (1 - Math.pow(1 - p, 4)));
      if (p < 1) raf = requestAnimationFrame(tick); else setVal(target);
    };
    raf = requestAnimationFrame(tick);
    const settle = setTimeout(() => setVal(target), duration + 500);
    return () => { cancelAnimationFrame(raf); clearTimeout(settle); };
  }, [inView, target]);
  return [ref, Math.round(val).toLocaleString()];
}

/* ───────── Magnetic ───────── */
export function Magnetic({ children, strength = 0.25, style = {}, ...rest }) {
  const ref = useRef(null);
  const onMove = (e) => {
    if (isTouch()) return;
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.transform = `translate(${(e.clientX - (r.left + r.width / 2)) * strength}px, ${(e.clientY - (r.top + r.height / 2)) * strength}px)`;
  };
  const reset = () => { if (ref.current) ref.current.style.transform = 'translate(0,0)'; };
  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={reset}
      onPointerDown={reset}
      style={{ transition: 'transform .35s cubic-bezier(.2,.8,.2,1)', display: 'inline-block', ...style }}
      {...rest}
    >
      {children}
    </div>
  );
}

/* ───────── Marquee ───────── */
export function Marquee({ items, speed = 38, reverse = false }) {
  const seq = [...items, ...items];
  return (
    <div className="marquee">
      <div
        className="marquee-track"
        style={{ animationDuration: `${speed}s`, animationDirection: reverse ? 'reverse' : 'normal' }}
      >
        {seq.map((it, i) => (
          <span className="marquee-item" key={i}>
            <span className="marquee-dot">✦</span>
            <span>{it}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* ───────── AnimatedCheck ───────── */
export function AnimatedCheck({ accent, size = 60 }) {
  return (
    <div className="check-burst" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox="0 0 64 64">
        <circle cx="32" cy="32" r="29" fill="none" stroke={accent} strokeOpacity="0.22" strokeWidth="2.5" />
        <circle className="ck-ring" cx="32" cy="32" r="29" fill="none" stroke={accent} strokeWidth="2.5" strokeLinecap="round" transform="rotate(-90 32 32)" />
        <path className="ck-tick" d="M20 33 L29 42 L45 24" fill="none" stroke={accent} strokeWidth="3.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

/* ───────── useScrolled ───────── */
export function useScrolled(y = 24) {
  const [s, setS] = useState(false);
  useEffect(() => {
    const onScroll = () => setS(window.scrollY > y);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [y]);
  return s;
}

/* ───────── ScrollProgress ───────── */
export function ScrollProgress({ accent }) {
  const ref = useRef(null);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      const p = h > 0 ? window.scrollY / h : 0;
      if (ref.current) ref.current.style.transform = `scaleX(${p})`;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);
  return (
    <div className="scroll-progress">
      <div ref={ref} className="scroll-progress-bar" style={{ background: accent }} />
    </div>
  );
}

/* ───────── CustomCursor ───────── */
export function CustomCursor({ accent }) {
  const dot = useRef(null);
  const ring = useRef(null);
  useEffect(() => {
    if (isTouch() || prefersReduced()) return;
    document.body.classList.add('has-cursor');
    let mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my, raf;
    const onMove = (e) => {
      mx = e.clientX; my = e.clientY;
      if (dot.current) dot.current.style.transform = `translate(${mx}px, ${my}px)`;
      const t = e.target;
      const interactive = t && t.closest && t.closest('a, button, [data-cursor], input, textarea, .seg-btn, .faq-q, .info-card, .cur-card');
      if (ring.current) ring.current.classList.toggle('hover', !!interactive);
    };
    const loop = () => {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      if (ring.current) ring.current.style.transform = `translate(${rx}px, ${ry}px)`;
      raf = requestAnimationFrame(loop);
    };
    const onDown = () => ring.current && ring.current.classList.add('down');
    const onUp = () => ring.current && ring.current.classList.remove('down');
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerdown', onDown);
    window.addEventListener('pointerup', onUp);
    loop();
    return () => {
      document.body.classList.remove('has-cursor');
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      cancelAnimationFrame(raf);
    };
  }, []);
  if (typeof window !== 'undefined' && (isTouch() || prefersReduced())) return null;
  return (
    <>
      <div ref={ring} className="cursor-ring" style={{ borderColor: accent }} />
      <div ref={dot} className="cursor-dot" style={{ background: accent }} />
    </>
  );
}

/* ───────── Preloader ───────── */
export function Preloader({ onDone, accent }) {
  const [count, setCount] = useState(0);
  const [leaving, setLeaving] = useState(false);
  useEffect(() => {
    if (prefersReduced()) {
      setLeaving(true);
      const t = setTimeout(onDone, 200);
      return () => clearTimeout(t);
    }
    let n = 0;
    const iv = setInterval(() => {
      n += Math.max(2, Math.round((100 - n) * 0.22));
      if (n >= 100) {
        n = 100;
        clearInterval(iv);
        setCount(100);
        setTimeout(() => setLeaving(true), 180);
        setTimeout(onDone, 900);
      } else setCount(n);
    }, 55);
    const safety = setTimeout(() => { clearInterval(iv); setLeaving(true); onDone(); }, 2600);
    return () => { clearInterval(iv); clearTimeout(safety); };
  }, []);
  return (
    <div className={'preloader' + (leaving ? ' leaving' : '')}>
      <div className="preloader-inner">
        <div className="pre-mark">
          The Modern<span className="pre_us" style={{ color: accent }}>_</span>dev
        </div>
        <div className="pre-count">
          <span className="tnum">{count}</span>
          <span className="pre-pct">%</span>
        </div>
      </div>
      <div className="pre-bar">
        <div className="pre-bar-fill" style={{ width: count + '%', background: accent }} />
      </div>
    </div>
  );
}

/* ───────── DotField (hero canvas) ───────── */
export function DotField({ accent = '#C0492B', style = {} }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    if (prefersReduced()) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w, h, dpr, dots = [], raf, mx = -9999, my = -9999, tmx = -9999, tmy = -9999;
    const [ar, ag, ab] = hexRgb(accent);
    const baseR = 1.5, gap = 30, reach = 130;
    function resize() {
      dpr = Math.min(2, window.devicePixelRatio || 1);
      const r = canvas.getBoundingClientRect();
      w = r.width; h = r.height;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      dots = [];
      const cols = Math.ceil(w / gap) + 1, rows = Math.ceil(h / gap) + 1;
      for (let i = 0; i < cols; i++)
        for (let j = 0; j < rows; j++)
          dots.push({ x: i * gap, y: j * gap, ph: (i + j) * 0.5 });
    }
    let t = 0;
    function frame() {
      t += 0.02;
      ctx.clearRect(0, 0, w, h);
      mx += (tmx - mx) * 0.12;
      my += (tmy - my) * 0.12;
      for (const d of dots) {
        const dx = d.x - mx, dy = d.y - my, dist = Math.hypot(dx, dy);
        const wave = Math.sin(t + d.ph) * 0.5 + 0.5;
        let r = baseR + wave * 0.7, push = 0, mix = 0;
        if (dist < reach) {
          const f = 1 - dist / reach;
          push = f * 14; mix = f; r += f * 2.6;
        }
        const ang = Math.atan2(dy, dx);
        const px = d.x + Math.cos(ang) * push, py = d.y + Math.sin(ang) * push;
        const baseAlpha = 0.16 + wave * 0.10;
        const cr = Math.round(170 + (ar - 170) * mix);
        const cg = Math.round(160 + (ag - 160) * mix);
        const cb = Math.round(142 + (ab - 142) * mix);
        ctx.beginPath();
        ctx.fillStyle = `rgba(${cr},${cg},${cb},${baseAlpha + mix * 0.55})`;
        ctx.arc(px, py, r, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(frame);
    }
    const onMove = (e) => {
      const r = canvas.getBoundingClientRect();
      tmx = e.clientX - r.left;
      tmy = e.clientY - r.top;
    };
    const onLeave = () => { tmx = -9999; tmy = -9999; };
    resize();
    frame();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    window.addEventListener('pointermove', onMove);
    canvas.addEventListener('pointerleave', onLeave);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener('pointermove', onMove);
    };
  }, [accent]);
  return <canvas ref={canvasRef} className="dotfield" style={style} aria-hidden="true" />;
}

/* ───────── HorizontalPin (vertical scroll → horizontal travel) ───────── */
export function HorizontalPin({ children, className = '' }) {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  useEffect(() => {
    const section = sectionRef.current, track = trackRef.current;
    if (!section || !track) return;
    const setHeight = () => {
      if (window.matchMedia('(max-width: 760px)').matches) {
        section.style.height = 'auto';
        track.style.transform = 'none';
        return;
      }
      const maxX = Math.max(0, track.scrollWidth - window.innerWidth);
      section.style.height = window.innerHeight + maxX + 'px';
    };
    const onScroll = () => {
      if (window.matchMedia('(max-width: 760px)').matches) {
        track.style.transform = 'none';
        return;
      }
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = section.offsetHeight - vh;
      const passed = Math.min(Math.max(-rect.top, 0), total);
      const p = total > 0 ? passed / total : 0;
      const maxX = Math.max(0, track.scrollWidth - window.innerWidth);
      track.style.transform = `translate3d(${-p * maxX}px,0,0)`;
    };
    setHeight();
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    const onResize = () => { setHeight(); onScroll(); };
    window.addEventListener('resize', onResize);
    const ro = new ResizeObserver(setHeight);
    ro.observe(track);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      ro.disconnect();
    };
  }, []);
  return (
    <section ref={sectionRef} className={`hpin ${className}`}>
      <div className="hpin-sticky">
        <div ref={trackRef} className="hpin-track">{children}</div>
      </div>
    </section>
  );
}
