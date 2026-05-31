import { useEffect, useRef, useState } from 'react';
import { Enter, Reveal, Magnetic, AnimatedCheck, useInView } from './fx.jsx';

const ACCENT = '#C0492B';
const TOTAL_SEATS = 40;
const INITIAL_TAKEN = 27;
// Same-origin /api/* routes, handled by the Vercel functions in /api during
// `vercel dev` and once deployed. `npm run dev` (Vite alone) doesn't serve
// /api, so locally use `vercel dev` to exercise the form end-to-end.

const PLAN = [
  { n: '01', t: 'We start from nothing', d: "Never written a line of code? Good. That's exactly who I made this for." },
  { n: '02', t: 'AI is your pair', d: "You'll code with Claude next to you, asking, editing, shipping. Then we make a little robot do something fun." },
  { n: '03', t: "You're never stuck alone", d: "It's a small group. Ask me anything. We go at your pace, not mine." },
];

const validEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
const hexA = (hex, a) => {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16), g = parseInt(h.slice(2, 4), 16), b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${a})`;
};

function Marker({ accent }) {
  return (
    <svg className="marker" viewBox="0 0 300 14" preserveAspectRatio="none" aria-hidden="true">
      <path d="M4 9 C 70 3, 150 3, 210 6 C 250 8, 280 7, 296 5" fill="none"
        stroke={accent} strokeWidth="4.5" strokeLinecap="round" />
    </svg>
  );
}

function Logo({ accent }) {
  return (
    <svg className="logo" viewBox="0 0 30 28" aria-label="The Modern_dev mark" role="img">
      <circle cx="15" cy="8" r="3.2" fill={accent} />
      <path d="M3 20 C 9 16.5, 21 16.5, 27 20" fill="none"
        stroke={accent} strokeWidth="2.6" strokeLinecap="round" />
    </svg>
  );
}

function Seats({ accent, taken, total, pct, left }) {
  const [ref, inView] = useInView();
  return (
    <div ref={ref}>
      <div className="seat-top">
        <span className="seat-label">The room's filling up</span>
        <span className="seat-count" style={{ color: accent }}>{left} seats left</span>
      </div>
      <div className="seat-track">
        <div className="seat-fill" style={{ width: (inView ? pct : 0) + '%' }} />
      </div>
      <div className="seat-sub">{taken} of {total} taken</div>
    </div>
  );
}

function FloatField({ label, hint, value, onChange, type = 'text', error, autoComplete, name }) {
  return (
    <div className={'fl' + (error ? ' fl-err' : '')}>
      <input
        className="fl-input"
        type={type}
        name={name}
        autoComplete={autoComplete}
        value={value}
        placeholder=" "
        onChange={(e) => onChange(e.target.value)}
      />
      <label className="fl-label">{label}</label>
      {hint && !error && <span className="fl-hint">{hint}</span>}
      {error && <span className="fl-errtxt">{error}</span>}
    </div>
  );
}

function Segmented({ options, value, onChange, accent }) {
  const idx = options.indexOf(value);
  return (
    <div className="seg-track">
      {idx >= 0 && (
        <div className="seg-pill" style={{
          background: hexA(accent, 0.12),
          borderColor: accent,
          width: `calc(${100 / options.length}% - 6px)`,
          transform: `translateX(calc(${idx * 100}% + ${idx * 6}px))`,
        }} />
      )}
      {options.map((opt) => (
        <button
          type="button"
          key={opt}
          onClick={() => onChange(opt)}
          className={'seg-btn' + (value === opt ? ' is-on' : '')}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

export default function App() {
  const accent = ACCENT;
  const [form, setForm] = useState({ name: '', email: '', tg: '', level: '', website: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [taken, setTaken] = useState(INITIAL_TAKEN);
  const [seatNo, setSeatNo] = useState(null);
  const [submitError, setSubmitError] = useState(null);
  const formRef = useRef(null);

  useEffect(() => { document.documentElement.style.setProperty('--accent', accent); }, [accent]);

  // Real seat count from /api/signup-count, polled every 30s. Falls back to
  // the demo theater (setInterval bump) when the endpoint isn't reachable.
  useEffect(() => {
    let cancelled = false;
    let demoTimer = null;
    let pollTimer = null;
    const startDemo = () => {
      if (done || demoTimer) return;
      demoTimer = setInterval(
        () => setTaken((c) => (c < TOTAL_SEATS - 4 && Math.random() < 0.4 ? c + 1 : c)),
        11000,
      );
    };
    const fetchCount = async () => {
      try {
        const res = await fetch('/api/signup-count');
        if (!res.ok) throw new Error(`status ${res.status}`);
        const { count } = await res.json();
        if (!cancelled && typeof count === 'number') {
          setTaken(INITIAL_TAKEN + count);
        }
      } catch {
        startDemo();
      }
    };
    fetchCount();
    pollTimer = setInterval(fetchCount, 30000);
    return () => {
      cancelled = true;
      if (pollTimer) clearInterval(pollTimer);
      if (demoTimer) clearInterval(demoTimer);
    };
  }, [done]);

  const update = (f, v) => {
    setForm((s) => ({ ...s, [f]: v }));
    if (errors[f]) setErrors((e) => ({ ...e, [f]: null }));
  };
  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  async function submit(e) {
    e.preventDefault();
    setSubmitError(null);

    if (form.website) return;

    const errs = {};
    if (!form.name.trim()) errs.name = 'your name?';
    if (!form.email.trim()) errs.email = 'needed';
    else if (!validEmail(form.email)) errs.email = 'check this';
    if (!form.level) errs.level = 'pick one';
    if (Object.keys(errs).length) return setErrors(errs);

    setSubmitting(true);

    try {
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          telegram: form.tg,
          experience: form.level,
        }),
      });
      if (res.status === 409) {
        setSubmitError("You're already on the list. Check your email for the invite.");
        return;
      }
      if (!res.ok) throw new Error(`Submit failed (${res.status})`);
      const n = taken + 1;
      setTaken(n);
      setSeatNo(n);
      setDone(true);
    } catch (err) {
      console.error(err);
      setSubmitError("Couldn't save your seat. Try again, or email cyber@themodern.dev.");
    } finally {
      setSubmitting(false);
    }
  }

  const seatsLeft = TOTAL_SEATS - taken;
  const pct = Math.round((taken / TOTAL_SEATS) * 100);

  return (
    <div className="page">
      <div className="grain" />

      <header className="masthead">
        <a className="brand" href="/" aria-label="The Modern_dev · home">
          <Logo accent={accent} />
          <span className="mark">The Modern<span style={{ color: accent }}>_</span>dev</span>
        </a>
        <span className="mast-right">a small class</span>
      </header>

      <main className="content">
        <div className="hero-grid">
          <section className="hero">
            <Enter>
              <div className="kicker">FREE · LIVE COHORT · BEGINNERS WELCOME</div>
            </Enter>
            <Enter delay={70}>
              <h1 className="h1">
                Come build{' '}
                <span className="underline-wrap">
                  robots&nbsp;&amp;&nbsp;AI
                  <Marker accent={accent} />
                </span>{' '}
                with me.
              </h1>
            </Enter>
            <Enter delay={140}>
              <p className="lede">
                I teach a small, hands-on class. Code with AI as your pair,
                and we'll bring a little robot along for the ride. No experience needed.
              </p>
            </Enter>
            <Enter delay={210}>
              <div className="cta-row">
                <Magnetic strength={0.25} style={{ display: 'inline-block' }}>
                  <button
                    type="button"
                    className="cta"
                    style={{ background: accent }}
                    onClick={scrollToForm}
                  >
                    Save me a seat <span className="arr">→</span>
                  </button>
                </Magnetic>
                <span className="cta-note">takes 30 seconds</span>
              </div>
            </Enter>
          </section>

          <Reveal as="aside" className="hero-aside" y={12}>
            <img src="/cyber.jpg" alt="Cyber" className="aside-photo"
              width="120" height="120" loading="lazy" />
            <div className="aside-body">
              <div className="aside-name">Hi, I'm Cyber.</div>
              <p className="aside-text">
                I'll be teaching this. Ask me anything. That's the point.
              </p>
            </div>
          </Reveal>
        </div>

        <section className="section">
          <Reveal><div className="sec-label">Here's the plan</div></Reveal>
          {PLAN.map((p, i) => (
            <Reveal key={p.n} delay={i * 70}>
              <div className="plan-row" style={{ borderTop: i === 0 ? 'none' : '1px solid var(--line)' }}>
                <span className="plan-no">{p.n}</span>
                <div>
                  <div className="plan-t">{p.t}</div>
                  <div className="plan-d">{p.d}</div>
                </div>
              </div>
            </Reveal>
          ))}
        </section>

        <Reveal className="section">
          <Seats accent={accent} taken={taken} total={TOTAL_SEATS} pct={pct} left={seatsLeft} />
        </Reveal>

        <div ref={formRef} className="form-card-wrap" style={{ scrollMarginTop: 24 }}>
          <Reveal className="form-card">
            {!done ? (
              <form onSubmit={submit} noValidate>
                <div className="form-title">Grab a seat</div>
                <p className="form-sub">Tell me where to reach you. That's it.</p>

                <input
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  value={form.website}
                  onChange={(e) => update('website', e.target.value)}
                  style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, opacity: 0 }}
                  aria-hidden="true"
                />

                <FloatField label="Your name" name="name" autoComplete="name"
                  value={form.name} error={errors.name} onChange={(v) => update('name', v)} />
                <FloatField label="Email" type="email" name="email" autoComplete="email"
                  value={form.email} error={errors.email} onChange={(v) => update('email', v)} />
                <FloatField label="Telegram" name="telegram" hint="@username"
                  value={form.tg} onChange={(v) => update('tg', v)} />

                <div className="seg-wrap">
                  <div className="seg-head">
                    <span className="seg-label">How much have you coded?</span>
                    {errors.level && <span className="err">{errors.level}</span>}
                  </div>
                  <Segmented accent={accent} value={form.level}
                    options={['Not at all', 'A little', 'I code']} onChange={(v) => update('level', v)} />
                </div>

                {submitError && <div className="submit-error">{submitError}</div>}

                <button type="submit" disabled={submitting} className="cta submit-btn"
                  style={{ background: accent }}>
                  {submitting ? 'saving…' : <span>Save my seat <span className="arr">→</span></span>}
                </button>
                <div className="privacy">It's just me on the other end. No spam, ever.</div>
              </form>
            ) : (
              <div className="success">
                <AnimatedCheck accent={accent} size={58} />
                <div className="success-title">Seat saved.</div>
                <div className="success-sub">you're number {seatNo}</div>
                <p className="success-text">
                  I'll {form.tg ? 'add you to the Telegram group' : 'email you the Telegram invite'} with
                  the date and what to bring (nothing, really), {form.name.split(' ')[0]}. Can't wait to build with you.
                </p>
                <div className="sign">Cyber</div>
              </div>
            )}
          </Reveal>
        </div>
      </main>

      <footer className="footer">
        <div className="foot-mark">The Modern<span style={{ color: accent }}>_</span>dev</div>
        <div className="foot-handle">@the_modern_dev</div>
      </footer>
    </div>
  );
}
