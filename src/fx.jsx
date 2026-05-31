import { useEffect, useRef, useState } from 'react';

export function useInView(opts = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const check = () => {
      const er = el.getBoundingClientRect();
      const rr = { top: 0, bottom: window.innerHeight };
      if (er.top < rr.bottom - er.height * (opts.threshold ?? 0.2) && er.bottom > rr.top) {
        setInView(true);
        return true;
      }
      return false;
    };
    if (check()) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { setInView(true); io.unobserve(el); } }),
      { threshold: opts.threshold ?? 0.2, rootMargin: opts.rootMargin ?? '0px 0px -6% 0px' },
    );
    io.observe(el);
    const t = setTimeout(check, 500);
    return () => { io.disconnect(); clearTimeout(t); };
  }, []);
  return [ref, inView];
}

export function Reveal({ children, delay = 0, y = 20, style = {}, className = '' }) {
  const [ref, inView] = useInView();
  return (
    <div
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
    </div>
  );
}

export function Magnetic({ children, strength = 0.25, style = {}, ...rest }) {
  const ref = useRef(null);
  const onMove = (e) => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const mx = e.clientX - (r.left + r.width / 2);
    const my = e.clientY - (r.top + r.height / 2);
    el.style.transform = `translate(${mx * strength}px, ${my * strength}px)`;
  };
  const reset = () => { if (ref.current) ref.current.style.transform = 'translate(0,0)'; };
  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={reset}
      onPointerDown={reset}
      style={{ transition: 'transform .35s cubic-bezier(.2,.8,.2,1)', ...style }}
      {...rest}
    >
      {children}
    </div>
  );
}

export function AnimatedCheck({ accent, size = 64 }) {
  return (
    <div className="check-burst" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox="0 0 64 64">
        <circle cx="32" cy="32" r="29" fill="none" stroke={accent} strokeOpacity="0.25" strokeWidth="2" />
        <circle className="ck-ring" cx="32" cy="32" r="29" fill="none" stroke={accent} strokeWidth="2.5" strokeLinecap="round" />
        <path className="ck-tick" d="M20 33 L29 42 L45 24" fill="none" stroke={accent} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

export function Enter({ children, delay = 0, style = {} }) {
  const [pre, setPre] = useState(true);
  useEffect(() => {
    const raf = requestAnimationFrame(() => requestAnimationFrame(() => setPre(false)));
    const t = setTimeout(() => setPre(false), 80);
    return () => { cancelAnimationFrame(raf); clearTimeout(t); };
  }, []);
  return <div className={'enter' + (pre ? ' pre' : '')} style={{ transitionDelay: delay + 'ms', ...style }}>{children}</div>;
}
