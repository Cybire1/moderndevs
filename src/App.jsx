import { useEffect, useRef, useState } from 'react';
import {
  Enter, Reveal, Magnetic, AnimatedCheck, useInView,
  Preloader, ScrollProgress, CustomCursor, Marquee, MaskLines, DotField,
  HorizontalPin,
} from './fx.jsx';
import PromptDemo from './Demo.jsx';
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

const MARQUEE_ITEMS = [
  'Code with AI',
  'Make a robot wave',
  'Beginners welcome',
  'No experience needed',
  'Ship something real',
  'Pair with Claude',
  'Small cohort',
  'Always free',
];
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

function Nav({ accent, onCta }) {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 32);
      setHidden(y > 280 && y > lastY.current + 4);
      lastY.current = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <header className={'nav' + (scrolled ? ' nav-stuck' : '') + (hidden ? ' nav-hidden' : '')}>
      <div className="nav-inner">
        <a className="brand" href="/" aria-label="The Modern_dev · home">
          <Logo accent={accent} />
          <span className="mark">The Modern<span style={{ color: accent }}>_</span>dev</span>
        </a>
        <nav className="nav-links" aria-label="Section navigation">
          <a href="#mission">Why</a>
          <a href="#schedule">Schedule</a>
          <a href="#curriculum">Curriculum</a>
          <a href="#faq">FAQ</a>
        </nav>
        <button
          type="button"
          className="nav-cta"
          onClick={onCta}
          style={{ background: accent }}
        >
          Save a seat
        </button>
      </div>
    </header>
  );
}

function Footer({ accent }) {
  return (
    <footer className="footer-x">
      <div className="footer-top">
        <div className="footer-brand">
          <a className="brand" href="/" aria-label="The Modern_dev · home">
            <Logo accent={accent} />
            <span className="mark">The Modern<span style={{ color: accent }}>_</span>dev</span>
          </a>
          <p className="footer-tag">A small class. Code with AI, from zero.</p>
        </div>
        <div className="footer-cols">
          <div className="footer-col">
            <div className="footer-h">Class</div>
            <a href="#mission">Why</a>
            <a href="#schedule">Schedule</a>
            <a href="#curriculum">Curriculum</a>
            <a href="#faq">FAQ</a>
          </div>
          <div className="footer-col">
            <div className="footer-h">Reach me</div>
            <a href="mailto:cyber@themodern.dev">cyber@themodern.dev</a>
            <a href="https://t.me/the_modern_dev" target="_blank" rel="noopener noreferrer">@the_modern_dev</a>
          </div>
          <div className="footer-col">
            <div className="footer-h">Legal</div>
            <a href="/privacy">Privacy</a>
            <a href="/terms">Terms</a>
            <a href="/code-of-conduct">Code of conduct</a>
          </div>
        </div>
      </div>
      <div className="footer-bot">
        <span>© {new Date().getUTCFullYear()} The Modern_dev</span>
        <span className="footer-by">
          Made with <span className="footer-heart" style={{ color: accent }}><IconHeart /></span> for beginners.
        </span>
      </div>
    </footer>
  );
}

function Mission({ accent }) {
  return (
    <section className="mission" id="mission">
      <Reveal><div className="sec-label">Why this exists</div></Reveal>
      <Reveal delay={50}>
        <p className="mission-text">
          Coding got gatekept by intimidation for too long. This class is{' '}
          <span className="underline-wrap">
            the opposite
            <Marker accent={accent} />
          </span>.
        </p>
      </Reveal>
      <Reveal delay={110}>
        <p className="mission-sub">
          If you've been told it's not for you, start here.
        </p>
      </Reveal>
    </section>
  );
}

const FAQ_DATA = [
  {
    q: "Do I really need zero coding experience?",
    a: "Yes. The class is built for people who've never written a line of code. We start at \"what is a file\" and go from there. If you can use a browser, you can do this.",
  },
  {
    q: "What gear do I need? Do I need a Reachy Mini?",
    a: "A laptop. That's it. The Reachy is mine — you'll write code that runs on it during the live sessions. You don't need to own one.",
  },
  {
    q: "How much time per week?",
    a: "About 3 hours. One live session (around 90 minutes) plus a bit of async work during the week — whenever you feel like it.",
  },
  {
    q: "What if I miss a live session?",
    a: "Sessions are recorded and shared in the group. You can ask anything async — I'm there during the week, not just on Sundays.",
  },
  {
    q: "What happens after the 4 weeks?",
    a: "You keep the work, the recordings, and the group chat. I run cohorts a few times a year — you're welcome back any time.",
  },
  {
    q: "Why is it free? What's the catch?",
    a: "There isn't one. I have a day job. I think more people should be able to code. So I teach.",
  },
];

function FAQItem({ q, a, open, onToggle }) {
  return (
    <div className="faq-item" data-open={open}>
      <button
        type="button"
        className="faq-q"
        onClick={onToggle}
        aria-expanded={open}
      >
        <span>{q}</span>
        <span className="faq-chevron-wrap"><IconChevronDown /></span>
      </button>
      <div className="faq-a">
        <div className="faq-a-inner">{a}</div>
      </div>
    </div>
  );
}

function FAQ() {
  const [openIdx, setOpenIdx] = useState(null);
  return (
    <section className="section faq-section" id="faq">
      <Reveal><div className="sec-label">Common questions</div></Reveal>
      <div className="faq">
        {FAQ_DATA.map((f, i) => (
          <Reveal key={i} delay={i * 35}>
            <FAQItem
              {...f}
              open={openIdx === i}
              onToggle={() => setOpenIdx(openIdx === i ? null : i)}
            />
          </Reveal>
        ))}
      </div>
    </section>
  );
}

const MONTHS = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];

function Curriculum() {
  return (
    <HorizontalPin className="curriculum-pin" id="curriculum">
      <div className="cur-intro">
        <Reveal><div className="sec-label">The curriculum</div></Reveal>
        <Reveal delay={60}>
          <h2 className="h2">What we<br />actually build</h2>
        </Reveal>
        <Reveal delay={120}>
          <p className="cur-intro-lede">
            No filler. Every week ends with something you made and can show
            people. Scroll →
          </p>
        </Reveal>
      </div>
      {CURRICULUM.map((c, i) => {
        const Icon = c.Icon;
        return (
          <article className="cur-card cur-card-pin" key={c.n}>
            <div className="cur-card-head">
              <div className="cur-num">{String(i + 1).padStart(2, '0')} / {String(CURRICULUM.length).padStart(2, '0')}</div>
              <div className="cur-icon"><Icon /></div>
            </div>
            <h3 className="cur-title">{c.t}</h3>
            <div className="cur-ship">
              <span className="cur-ship-label">You'll ship</span>
              <span className="cur-ship-text">{c.s}</span>
            </div>
            <p className="cur-desc">{c.d}</p>
          </article>
        );
      })}
    </HorizontalPin>
  );
}

const HOW_STEPS = [
  {
    n: '01',
    t: 'Save a seat',
    d: "Drop your name below. The list is small and I read every one. You'll know you're in within a day.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    n: '02',
    t: 'Build live, every week',
    d: "We pick something real and make it together — with AI as the pair we're all learning from. Ask anything; there are no dumb questions.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
  },
  {
    n: '03',
    t: 'Ship it and share',
    d: "You'll have something built, online, and yours. Post it, show your friends, put it in your portfolio. Repeat.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
        <path d="M12 12v9" />
        <path d="m8 17 4-4 4 4" />
      </svg>
    ),
  },
];

function HowItWorks() {
  return (
    <section className="section how-section" id="how">
      <div className="section-head">
        <Reveal><div className="sec-label">How it works</div></Reveal>
        <Reveal delay={60}>
          <h2 className="h2">Three steps. No platform tax.</h2>
        </Reveal>
        <Reveal delay={120}>
          <p className="how-lede">
            No course platform, no login. Just a focused group, a clear plan,
            and AI as the senior dev next to every one of us.
          </p>
        </Reveal>
      </div>
      <div className="how-steps">
        {HOW_STEPS.map((s, i) => (
          <Reveal key={s.n} delay={i * 80} className="how-step">
            <div className="how-step-no">STEP {s.n}</div>
            <div className="how-step-ic">{s.icon}</div>
            <h3 className="how-step-t">{s.t}</h3>
            <p className="how-step-d">{s.d}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

const PROJECTS = [
  { id: 'p1', col: 'col-7', tag: 'Week 1', t: 'A live webpage about a thing I love', by: 'shipped by Ada — her first webpage, ever' },
  { id: 'p2', col: 'col-5', tag: 'Week 2', t: 'A script that summarises my week from notes', by: 'shipped by Tunde' },
  { id: 'p3', col: 'col-5', tag: 'Week 3', t: 'Reachy waves when I say hi', by: 'shipped by Mariam' },
  { id: 'p4', col: 'col-7', tag: 'Week 4', t: 'A tiny calendar that summarises my day in one line', by: 'shipped by Sam — went from zero in 4 weeks' },
];

function Showcase() {
  return (
    <section className="section showcase-section" id="projects">
      <div className="section-head">
        <Reveal><div className="sec-label">Stuff that gets made</div></Reveal>
        <Reveal delay={60}>
          <h2 className="h2">Real things, by real beginners.</h2>
        </Reveal>
        <Reveal delay={120}>
          <p className="how-lede">
            Every one of these was made by someone in a cohort — most of them
            had never shipped anything before. Yours sits here next.
          </p>
        </Reveal>
      </div>
      <div className="showcase-grid">
        {PROJECTS.map((p, i) => (
          <Reveal key={p.id} className={'project ' + p.col} delay={(i % 2) * 80}>
            <div className="project-thumb" aria-hidden="true" />
            <div className="project-body">
              <div className="project-tag">{p.tag}</div>
              <div className="project-title">{p.t}</div>
              <div className="project-by">{p.by}</div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function About() {
  return (
    <section className="section about-section" id="about">
      <div className="about-grid">
        <Reveal className="about-portrait">
          <div className="about-photo">
            <img src="/cyber.jpg" alt="Cyber" loading="lazy" />
          </div>
        </Reveal>
        <Reveal delay={90} className="about-body">
          <div className="sec-label">Why I do this</div>
          <p className="about-first">
            When I started, everything felt locked behind a paywall, a degree,
            or a wall of jargon. AI changed that overnight. Almost nobody is
            teaching people how to actually use it to build.
          </p>
          <p>
            So I'm doing it, for free. The Modern_dev exists to bring the bar
            <em> down</em> for people learning to code, not up. If you can send
            a message, you can build something. I'll show you how.
          </p>
          <div className="about-sign">
            Cyber<small>Founder, The Modern_dev</small>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function StatsBand() {
  return (
    <section className="band">
      <div className="band-inner">
        <Reveal className="band-stat">
          <div className="band-n">{COHORT_WEEKS}<span className="band-suffix"> wks</span></div>
          <div className="band-l">start to ship something yours</div>
        </Reveal>
        <Reveal className="band-stat" delay={70}>
          <div className="band-n">{TOTAL_SEATS}</div>
          <div className="band-l">seats — small on purpose</div>
        </Reveal>
        <Reveal className="band-stat" delay={140}>
          <div className="band-n">100<span className="band-suffix">%</span></div>
          <div className="band-l">free, no catch, ever</div>
        </Reveal>
        <Reveal className="band-stat" delay={210}>
          <div className="band-n">0<span className="band-suffix">→1</span></div>
          <div className="band-l">where most builders here start</div>
        </Reveal>
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
  // Preloader: show on first load only. sessionStorage means a page refresh
  // during a single tab session skips it, so devs and back-button users don't
  // wait 1.5s twice.
  const [showPreloader, setShowPreloader] = useState(() => {
    if (typeof window === 'undefined') return false;
    return !sessionStorage.getItem('themodern_preloaded');
  });

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
    <>
      {showPreloader && (
        <Preloader
          accent={accent}
          onDone={() => {
            sessionStorage.setItem('themodern_preloaded', '1');
            setShowPreloader(false);
          }}
        />
      )}
      <ScrollProgress accent={accent} />
      <CustomCursor accent={accent} />
      <Nav accent={accent} onCta={openModal} />
      <div className="page">
        <div className="grain" />

        <main className="content">
        <section className="hero-wrap" id="top">
          <DotField accent={accent} />
          <div className="hero-grid">
            <section className="hero">
              <Enter>
                <div className="kicker">FREE · LIVE COHORT · BEGINNERS WELCOME</div>
              </Enter>
              <h1 className="h1">
                <MaskLines
                  lines={[
                    'Come build',
                    <span key="rl" className="underline-wrap">
                      robots&nbsp;&amp;&nbsp;AI
                      <Marker accent={accent} />
                    </span>,
                    'with me.',
                  ]}
                  delay={120}
                  stagger={120}
                />
              </h1>
              <Enter delay={460}>
                <p className="lede">
                  I teach a small, hands-on class. Code with AI as your pair,
                  and we'll bring a little robot along for the ride. No experience needed.
                </p>
              </Enter>
              <Enter delay={540}>
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
          <Reveal delay={120} className="hero-stats">
            <div className="hstat">
              <div className="hstat-n">{COHORT_WEEKS}<span className="hstat-suffix"> wks</span></div>
              <div className="hstat-l">start to ship</div>
            </div>
            <div className="hstat">
              <div className="hstat-n">100<span className="hstat-suffix">%</span></div>
              <div className="hstat-l">free, always</div>
            </div>
            <div className="hstat">
              <div className="hstat-n">0</div>
              <div className="hstat-l">experience needed</div>
            </div>
            <div className="hstat">
              <div className="hstat-n">{TOTAL_SEATS}</div>
              <div className="hstat-l">seats per cohort</div>
            </div>
          </Reveal>
        </section>

        <Mission accent={accent} />

        <Marquee items={MARQUEE_ITEMS} speed={42} />

        <PromptDemo accent={accent} />

        <Schedule accent={accent} />

        <HowItWorks />

        <Curriculum />

        <StatsBand />

        <Showcase />

        <About />

        <Reveal className="section">
          <Seats accent={accent} taken={taken} total={TOTAL_SEATS} pct={pct} left={seatsLeft} />
        </Reveal>

        <FAQ />

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

        <Footer accent={accent} />
      </div>

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
    </>
  );
}
