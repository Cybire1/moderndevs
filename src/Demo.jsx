import { useEffect, useRef, useState } from 'react';
import { Magnetic, Reveal, useInView } from './fx.jsx';

// PromptDemo: interactive "describe it, watch it build" centerpiece.
// Three presets (habit tracker, chatbot, landing page). On view it auto-runs
// preset 0: typewriter for the prompt, then a staged element reveal in the
// preview pane. Clicking a chip or Build re-runs.

const PRESETS = [
  { key: 'habit', label: 'a tiny habit tracker', count: 6 },
  { key: 'chat', label: 'an AI chatbot', count: 5 },
  { key: 'landing', label: 'a landing page', count: 6 },
];

function MiniHabit({ revealed }) {
  return (
    <div className="mini" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div className={`mini-el ${0 < revealed ? 'in' : ''} mini-bar`} style={{ width: '55%', height: 14 }} />
      <div className="mini-row" style={{ justifyContent: 'space-between' }}>
        {[0, 1, 2, 3, 4, 5, 6].map((d) => (
          <div key={d} className={`mini-el ${1 < revealed ? 'in' : ''}`} style={{ transitionDelay: d * 40 + 'ms' }}>
            <div className="mini-pill" style={{
              width: 22, height: 22, borderRadius: 7,
              background: d < 4 ? 'var(--accent)' : 'var(--surface-2)',
            }} />
          </div>
        ))}
      </div>
      {[2, 3, 4].map((i) => (
        <div key={i} className={`mini-el ${i < revealed ? 'in' : ''} mini-row`} style={{
          justifyContent: 'space-between', alignItems: 'center', padding: '9px 11px',
          background: 'var(--surface)', borderRadius: 9,
        }}>
          <div className="mini-bar" style={{ width: '52%', height: 9, background: 'var(--surface-2)' }} />
          <div style={{
            width: 18, height: 18, borderRadius: 5,
            border: '2px solid var(--accent)',
            background: i < 4 ? 'var(--accent)' : 'transparent',
          }} />
        </div>
      ))}
      <div className={`mini-el ${5 < revealed ? 'in' : ''} mini-pill mini-accent`} style={{ height: 38, marginTop: 2 }} />
    </div>
  );
}

function MiniChat({ revealed }) {
  return (
    <div className="mini" style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
      <div className={`mini-el ${0 < revealed ? 'in' : ''} mini-bar`} style={{ width: '42%', height: 12 }} />
      <div className={`mini-el ${1 < revealed ? 'in' : ''}`} style={{ alignSelf: 'flex-start', maxWidth: '78%' }}>
        <div style={{
          background: 'var(--surface-2)', borderRadius: '12px 12px 12px 3px',
          padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 6,
        }}>
          <div className="mini-bar" style={{ width: 120, height: 7, background: '#c9bfac' }} />
          <div className="mini-bar" style={{ width: 80, height: 7, background: '#c9bfac' }} />
        </div>
      </div>
      <div className={`mini-el ${2 < revealed ? 'in' : ''}`} style={{ alignSelf: 'flex-end', maxWidth: '78%' }}>
        <div style={{
          background: 'var(--accent)', borderRadius: '12px 12px 3px 12px',
          padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 6,
        }}>
          <div className="mini-bar" style={{ width: 130, height: 7, background: 'rgba(255,255,255,0.7)' }} />
          <div className="mini-bar" style={{ width: 70, height: 7, background: 'rgba(255,255,255,0.7)' }} />
        </div>
      </div>
      <div className={`mini-el ${3 < revealed ? 'in' : ''}`} style={{ alignSelf: 'flex-start', maxWidth: '60%' }}>
        <div style={{
          background: 'var(--surface-2)', borderRadius: '12px 12px 12px 3px',
          padding: '12px 14px',
        }}>
          <div className="mini-bar" style={{ width: 90, height: 7, background: '#c9bfac' }} />
        </div>
      </div>
      <div className={`mini-el ${4 < revealed ? 'in' : ''} mini-row`} style={{ marginTop: 4, gap: 8 }}>
        <div className="mini-bar" style={{ flex: 1, height: 32, borderRadius: 100, background: 'var(--surface)' }} />
        <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--accent)' }} />
      </div>
    </div>
  );
}

function MiniLanding({ revealed }) {
  return (
    <div className="mini" style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
      <div className={`mini-el ${0 < revealed ? 'in' : ''} mini-row`} style={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="mini-bar" style={{ width: 46, height: 10 }} />
        <div className="mini-row" style={{ gap: 6 }}>
          {[0, 1, 2].map((k) => (
            <div key={k} className="mini-bar" style={{ width: 22, height: 6, background: 'var(--surface-2)' }} />
          ))}
        </div>
      </div>
      <div className={`mini-el ${1 < revealed ? 'in' : ''} mini-bar`} style={{ width: '85%', height: 18, marginTop: 8 }} />
      <div className={`mini-el ${2 < revealed ? 'in' : ''} mini-bar`} style={{ width: '60%', height: 18 }} />
      <div className={`mini-el ${3 < revealed ? 'in' : ''} mini-pill mini-accent`} style={{ width: 110, height: 32, marginTop: 4 }} />
      <div className="mini-row" style={{ gap: 8, marginTop: 8 }}>
        {[0, 1, 2].map((idx) => (
          <div key={idx} className={`mini-el ${4 < revealed ? 'in' : ''}`} style={{ flex: 1, transitionDelay: idx * 70 + 'ms' }}>
            <div style={{
              background: 'var(--surface)', borderRadius: 9, padding: 10,
              display: 'flex', flexDirection: 'column', gap: 6,
            }}>
              <div style={{ width: 18, height: 18, borderRadius: 6, background: 'var(--accent)' }} />
              <div className="mini-bar" style={{ width: '90%', height: 6, background: 'var(--surface-2)' }} />
              <div className="mini-bar" style={{ width: '60%', height: 6, background: 'var(--surface-2)' }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const MINIS = { habit: MiniHabit, chat: MiniChat, landing: MiniLanding };

export default function PromptDemo({ accent }) {
  const [ref, inView] = useInView({ threshold: 0.3 });
  const [idx, setIdx] = useState(0);
  const [typed, setTyped] = useState('');
  const [typing, setTyping] = useState(false);
  const [revealed, setRevealed] = useState(0);
  const [status, setStatus] = useState('idle');
  const timers = useRef([]);
  const started = useRef(false);

  const clearTimers = () => {
    timers.current.forEach((t) => clearTimeout(t));
    timers.current = [];
  };
  const push = (fn, ms) => {
    const t = setTimeout(fn, ms);
    timers.current.push(t);
  };

  function run(i) {
    clearTimers();
    const preset = PRESETS[i];
    setIdx(i);
    setTyped('');
    setTyping(true);
    setRevealed(0);
    setStatus('idle');
    const full = preset.label;
    for (let c = 1; c <= full.length; c++) push(() => setTyped(full.slice(0, c)), c * 42);
    const afterType = full.length * 42 + 350;
    push(() => { setTyping(false); build(i); }, afterType);
  }

  function build(i) {
    const preset = PRESETS[i];
    setStatus('building');
    setRevealed(0);
    for (let s = 1; s <= preset.count; s++) push(() => setRevealed(s), s * 230);
    push(() => setStatus('live'), preset.count * 230 + 250);
  }

  useEffect(() => {
    if (inView && !started.current) {
      started.current = true;
      push(() => run(0), 400);
    }
    return clearTimers;
  }, [inView]);

  const Mini = MINIS[PRESETS[idx].key];

  return (
    <section className="section demo-section" id="demo" ref={ref}>
      <div className="section-head">
        <Reveal><div className="sec-label">See it happen</div></Reveal>
        <Reveal delay={60}>
          <h2 className="h2">Describe it.<br />Watch it build.</h2>
        </Reveal>
        <Reveal delay={120}>
          <p className="how-lede">
            This is the whole idea. You say what you want, AI helps you build
            it, and you ship. Tap a chip and watch. By week two, this is you.
          </p>
        </Reveal>
      </div>

      <Reveal className="demo-shell" delay={60}>
        <div className="demo-bar">
          <span className="demo-dot" style={{ background: '#E5705B' }} />
          <span className="demo-dot" style={{ background: '#E0B23C' }} />
          <span className="demo-dot" style={{ background: '#5FCF80' }} />
          <span className="demo-lbl">modern_dev — build session</span>
        </div>
        <div className="demo-grid">
          <div className="demo-left">
            <div className="demo-prompt-label">Your prompt</div>
            <div className="demo-input">
              Build me {typed}
              {typing && <span className="demo-caret" />}
            </div>
            <div className="demo-chips">
              {PRESETS.map((p, i) => (
                <button
                  key={p.key}
                  type="button"
                  className={'demo-chip' + (i === idx ? ' active' : '')}
                  style={i === idx ? { background: accent, borderColor: accent } : null}
                  onClick={() => run(i)}
                >
                  {p.label}
                </button>
              ))}
            </div>
            <div className="demo-build">
              <Magnetic strength={0.2}>
                <button
                  type="button"
                  className="cta demo-build-btn"
                  style={{ background: accent }}
                  onClick={() => { setTyping(false); build(idx); }}
                >
                  Build it <span className="arr">→</span>
                </button>
              </Magnetic>
            </div>
          </div>
          <div className="demo-right">
            <div className={'demo-status' + (status === 'live' ? ' live' : '')}>
              <span className="demo-sd" />
              {status === 'idle' ? 'ready' : status === 'building' ? 'building…' : 'shipped ✓'}
            </div>
            <div className="demo-stage">
              <Mini revealed={revealed} />
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
