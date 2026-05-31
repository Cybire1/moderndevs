import { useEffect, useState } from 'react';
import { Enter, Reveal, Magnetic, AnimatedCheck, useInView } from './fx.jsx';
import {
  IconCalendar, IconClock, IconUsers, IconSparkle, IconRobot, IconBolt,
  IconChat, IconCode, IconArrowRight, IconChevronDown, IconCheck, IconHeart,
} from './icons.jsx';

const ACCENT = '#C0492B';
const TOTAL_SEATS = 40;
const BASELINE_TAKEN = 15;

// PLACEHOLDER — edit when the real cohort date is set.
const COHORT_DATE = new Date('2026-07-20T19:00:00Z');
const COHORT_WEEKS = 4;
const COHORT_HOURS_PER_WEEK = 3;
const COHORT_CADENCE = 'Sundays 7pm UTC';
// Same-origin /api/* routes, handled by the Vercel functions in /api during
// `vercel dev` and once deployed. `npm run dev` (Vite alone) doesn't serve
// /api, so locally use `vercel dev` to exercise the form end-to-end.

// EDIT to refine — these are the four weeks of the cohort.
const CURRICULUM = [
  {
    n: 1, Icon: IconCode,
    t: 'First lines, first ship',
    s: 'Your first webpage, live on the internet.',
    d: "We set up your tools, you write your first lines with Claude, and we deploy it before the session ends.",
  },
  {
    n: 2, Icon: IconSparkle,
    t: 'AI is your pair',
    s: 'A tiny script that does something useful for you.',
    d: "How to talk to Claude. Ask, edit, debug. Build a small tool that automates a chore you actually have.",
  },
  {
    n: 3, Icon: IconRobot,
    t: 'Make the robot move',
    s: 'Code that makes Reachy wave, react, dance.',
    d: "We bring out the Reachy Mini. You write the code that makes it move. The robot does what you say.",
  },
  {
    n: 4, Icon: IconBolt,
    t: 'Build something yours',
    s: 'A small project of your own, end to end.',
    d: "Pick a thing you wish existed. Pitch it Tuesday, ship it Sunday. We're in your corner all week.",
  },
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

const MONTHS = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];

function Curriculum() {
  return (
    <section className="section curriculum-section" id="curriculum">
      <Reveal><div className="sec-label">What you'll learn</div></Reveal>
      <div className="curriculum">
        {CURRICULUM.map((c, i) => {
          const Icon = c.Icon;
          return (
            <Reveal key={c.n} delay={i * 60}>
              <article className="cur-card">
                <div className="cur-side">
                  <div className="cur-num">WEEK {c.n}</div>
                  <div className="cur-icon"><Icon /></div>
                </div>
                <div className="cur-body">
                  <h3 className="cur-title">{c.t}</h3>
                  <div className="cur-ship">
                    <span className="cur-ship-label">You'll ship</span>
                    <span className="cur-ship-text">{c.s}</span>
                  </div>
                  <p className="cur-desc">{c.d}</p>
                </div>
              </article>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}

function Schedule({ accent }) {
  const d = COHORT_DATE;
  const daysAway = Math.max(0, Math.ceil((d.getTime() - Date.now()) / 86400000));
  return (
    <section className="schedule" id="schedule">
      <Reveal><div className="sec-label">Next cohort</div></Reveal>
      <Reveal delay={70}>
        <div className="schedule-grid">
          <div className="cal-tile" role="img"
            aria-label={`Starts ${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`}>
            <span className="cal-strip" style={{ background: accent }} />
            <div className="cal-month">{MONTHS[d.getUTCMonth()]}</div>
            <div className="cal-day">{d.getUTCDate()}</div>
            <div className="cal-year">{d.getUTCFullYear()}</div>
            {daysAway > 0 && (
              <div className="cal-away">in {daysAway} {daysAway === 1 ? 'day' : 'days'}</div>
            )}
          </div>
          <div className="schedule-info">
            <div className="info-card">
              <span className="info-icon"><IconClock /></span>
              <div className="info-body">
                <div className="info-top">{COHORT_WEEKS} weeks</div>
                <div className="info-sub">~{COHORT_HOURS_PER_WEEK} hours per week</div>
              </div>
            </div>
            <div className="info-card">
              <span className="info-icon"><IconCalendar /></span>
              <div className="info-body">
                <div className="info-top">{COHORT_CADENCE}</div>
                <div className="info-sub">live session + async during the week</div>
              </div>
            </div>
            <div className="info-card">
              <span className="info-icon"><IconUsers /></span>
              <div className="info-body">
                <div className="info-top">{TOTAL_SEATS} seats max</div>
                <div className="info-sub">small enough for everyone to ask</div>
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
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
  const [taken, setTaken] = useState(BASELINE_TAKEN);
  const [seatNo, setSeatNo] = useState(null);
  const [submitError, setSubmitError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => { document.documentElement.style.setProperty('--accent', accent); }, [accent]);

  // Modal: body scroll lock, Esc to close, focus first field on open.
  useEffect(() => {
    if (!modalOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => { if (e.key === 'Escape') setModalOpen(false); };
    window.addEventListener('keydown', onKey);
    const focusTimer = setTimeout(() => {
      document.querySelector('.modal-card .fl-input')?.focus();
    }, 60);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
      clearTimeout(focusTimer);
    };
  }, [modalOpen]);

  // Real seat count from /api/signup-count, polled every 30s.
  useEffect(() => {
    let cancelled = false;
    const fetchCount = async () => {
      try {
        const res = await fetch('/api/signup-count');
        if (!res.ok) return;
        const { count } = await res.json();
        if (!cancelled && typeof count === 'number') setTaken(BASELINE_TAKEN + count);
      } catch {}
    };
    fetchCount();
    const id = setInterval(fetchCount, 30000);
    return () => { cancelled = true; clearInterval(id); };
  }, []);

  const update = (f, v) => {
    setForm((s) => ({ ...s, [f]: v }));
    if (errors[f]) setErrors((e) => ({ ...e, [f]: null }));
  };
  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

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
                    onClick={openModal}
                  >
                    Save me a seat <span className="arr">→</span>
                  </button>
                </Magnetic>
                <span className="cta-note">takes 30 seconds</span>
              </div>
            </Enter>
          </section>

          <Reveal as="aside" className="hero-aside" y={12}>
            <div className="aside-photo">
              <img src="/cyber.jpg" alt="Cyber" loading="lazy" />
            </div>
            <div className="aside-body">
              <div className="aside-name">Hi, I'm Cyber.</div>
              <p className="aside-text">
                I'll be teaching this. Ask me anything. That's the point.
              </p>
            </div>
          </Reveal>
        </div>

        <Schedule accent={accent} />

        <Curriculum />

        <Reveal className="section">
          <Seats accent={accent} taken={taken} total={TOTAL_SEATS} pct={pct} left={seatsLeft} />
        </Reveal>

        <Reveal className="cta-bottom">
          <button
            type="button"
            className="cta"
            style={{ background: accent }}
            onClick={openModal}
          >
            Save me a seat <span className="arr">→</span>
          </button>
          <span className="cta-note">takes 30 seconds</span>
        </Reveal>
      </main>

      <footer className="footer">
        <div className="foot-mark">The Modern<span style={{ color: accent }}>_</span>dev</div>
        <div className="foot-handle">@the_modern_dev</div>
      </footer>

      {modalOpen && (
        <div
          className="modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="signup-modal-title"
          onMouseDown={(e) => { if (e.target === e.currentTarget) closeModal(); }}
        >
          <div className="modal-card">
            <button
              type="button"
              className="modal-close"
              aria-label="Close"
              onClick={closeModal}
            >
              ×
            </button>

            {!done ? (
              <form onSubmit={submit} noValidate>
                <div id="signup-modal-title" className="form-title">Grab a seat</div>
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
                <div id="signup-modal-title" className="success-title">Seat saved.</div>
                <div className="success-sub">you're number {seatNo}</div>
                <p className="success-text">
                  I'll {form.tg ? 'add you to the Telegram group' : 'email you the Telegram invite'} with
                  the date and what to bring (nothing, really), {form.name.split(' ')[0]}. Can't wait to build with you.
                </p>
                <div className="sign">Cyber</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
