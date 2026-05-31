// Lightweight inline SVG icon set. Each component takes size + stroke props.
// Designed for 24×24 viewBox, 1.6 stroke, round caps — matches modern lucide /
// phosphor aesthetic without the dep weight.

const base = { width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none',
  stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round',
  strokeLinejoin: 'round' };

export function IconCalendar(p) {
  return (
    <svg {...base} {...p}>
      <rect x="3" y="5" width="18" height="16" rx="2.5" />
      <path d="M8 3v4M16 3v4M3 10h18" />
    </svg>
  );
}

export function IconClock(p) {
  return (
    <svg {...base} {...p}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

export function IconUsers(p) {
  return (
    <svg {...base} {...p}>
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3 20c.6-3.6 3-5.5 6-5.5s5.4 1.9 6 5.5" />
      <path d="M16 11.3c1.6 0 2.9-1.3 2.9-2.9S17.6 5.5 16 5.5" />
      <path d="M16 14.6c2.8 0 4.6 1.7 5.1 5.4" />
    </svg>
  );
}

export function IconSparkle(p) {
  return (
    <svg {...base} {...p}>
      <path d="M12 3l1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6L12 3z" />
      <path d="M18.5 16l.7 1.8L21 18.5l-1.8.7L18.5 21l-.7-1.8L16 18.5l1.8-.7.7-1.8z" />
    </svg>
  );
}

export function IconRobot(p) {
  return (
    <svg {...base} {...p}>
      <rect x="4" y="7" width="16" height="12" rx="3" />
      <path d="M12 4v3" />
      <circle cx="9" cy="13" r="1.1" />
      <circle cx="15" cy="13" r="1.1" />
      <path d="M9 17h6" />
      <path d="M2 12h2M20 12h2" />
    </svg>
  );
}

export function IconBolt(p) {
  return (
    <svg {...base} {...p}>
      <path d="M13 3L4 14h6l-1 7 9-11h-6l1-7z" />
    </svg>
  );
}

export function IconChat(p) {
  return (
    <svg {...base} {...p}>
      <path d="M21 12c0 4.4-4 8-9 8a10.4 10.4 0 01-3.8-.7L3 21l1.5-4.2A8 8 0 013 12c0-4.4 4-8 9-8s9 3.6 9 8z" />
    </svg>
  );
}

export function IconCode(p) {
  return (
    <svg {...base} {...p}>
      <path d="M8 7L3 12l5 5M16 7l5 5-5 5M14 4l-4 16" />
    </svg>
  );
}

export function IconArrowRight(p) {
  return (
    <svg {...base} {...p}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export function IconChevronDown(p) {
  return (
    <svg {...base} {...p}>
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

export function IconCheck(p) {
  return (
    <svg {...base} {...p}>
      <path d="M5 12.5l4.5 4.5L19 7" />
    </svg>
  );
}

export function IconHeart(p) {
  return (
    <svg {...base} {...p}>
      <path d="M12 20s-7-4.5-7-10a4 4 0 017-2.5A4 4 0 0119 10c0 5.5-7 10-7 10z" />
    </svg>
  );
}
