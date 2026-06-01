import { Enter } from './fx.jsx';
import { IconArrowRight } from './icons.jsx';

const ACCENT = '#C0492B';

function LegalShell({ title, kicker, children }) {
  return (
    <div className="legal-page">
      <div className="grain" />
      <a className="legal-back" href="/" aria-label="Back to home">
        <span className="legal-back-arrow"><IconArrowRight /></span>
        <span>The Modern<span style={{ color: ACCENT }}>_</span>dev</span>
      </a>
      <main className="legal-body">
        <Enter>
          <div className="kicker">{kicker}</div>
        </Enter>
        <Enter delay={70}>
          <h1 className="legal-h1">{title}</h1>
        </Enter>
        <Enter delay={140}>
          <div className="legal-prose">{children}</div>
        </Enter>
      </main>
    </div>
  );
}

export function Privacy() {
  return (
    <LegalShell title="Privacy" kicker="LEGAL · LAST UPDATED MAY 2026">
      <p>
        The Modern_dev is a small class run by one person. This page tells you
        what data the site stores and what happens to it. Plain language.
      </p>
      <h2>What we collect</h2>
      <p>When you submit the signup form we store, in our database:</p>
      <ul>
        <li>Your name</li>
        <li>Your email address</li>
        <li>Your Telegram handle (if you give it)</li>
        <li>Your self-rated coding experience</li>
        <li>The time you signed up</li>
      </ul>
      <p>That's it. No cookies are set. No analytics scripts are loaded.</p>
      <h2>What we use it for</h2>
      <p>
        Only to invite you to the cohort, share the schedule, and reach you
        about the class. Nothing else.
      </p>
      <h2>Who sees it</h2>
      <p>
        Only Cyber. The data lives in a Postgres database hosted on Neon. It is
        not sold, shared, or used for advertising.
      </p>
      <h2>How long we keep it</h2>
      <p>
        Until you ask us to delete it, or until you've finished the cohort and
        opted out of future cohort invites.
      </p>
      <h2>Your rights</h2>
      <p>
        Email <a href="mailto:cyber@themodern.dev">cyber@themodern.dev</a> and
        we'll delete your record, export your record, or correct any field.
        No forms, no friction.
      </p>
      <h2>Contact</h2>
      <p>
        Anything about privacy goes to{' '}
        <a href="mailto:cyber@themodern.dev">cyber@themodern.dev</a>.
      </p>
    </LegalShell>
  );
}

export function Terms() {
  return (
    <LegalShell title="Terms" kicker="LEGAL · LAST UPDATED MAY 2026">
      <p>
        Using this site or joining the class means you agree to a few simple
        things. Read them.
      </p>
      <h2>The class is free</h2>
      <p>
        There's no payment, no upsell, no surprise tier. If a future cohort
        ever changes that, it will be obvious before you sign up.
      </p>
      <h2>What we promise</h2>
      <p>
        Cyber will run the cohort, answer questions during the week, and
        record live sessions. We make the class as good as we can. We can't
        guarantee specific outcomes — coding takes practice.
      </p>
      <h2>What we ask</h2>
      <ul>
        <li>Show up curious. Mock no one.</li>
        <li>Don't share session recordings or class materials publicly without asking.</li>
        <li>Don't use the group chat to spam others or sell things.</li>
      </ul>
      <p>
        See the <a href="/code-of-conduct">code of conduct</a> for the full
        community standards.
      </p>
      <h2>If something goes wrong</h2>
      <p>
        The site and class are provided "as is." If you lose work because of
        a bug in something you built — that's on you and Claude. If you lose
        access to the cohort because we cancel a session, we'll reschedule.
      </p>
      <h2>Changes</h2>
      <p>
        If we update these terms, we'll change the "last updated" date and
        post a note in the group chat. Nothing changes retroactively for
        existing cohorts.
      </p>
      <h2>Contact</h2>
      <p>
        Questions go to <a href="mailto:cyber@themodern.dev">cyber@themodern.dev</a>.
      </p>
    </LegalShell>
  );
}

export function CodeOfConduct() {
  return (
    <LegalShell title="Code of conduct" kicker="THE COHORT · OUR VALUES">
      <p className="legal-lead">
        Small groups only work when everyone in them is safe. Here's what we
        ask of each other.
      </p>
      <h2>Be kind</h2>
      <p>
        Nobody in this room knew this stuff once. Treat questions like the
        gifts they are. No condescension. No "you don't know that yet?"
      </p>
      <h2>Be curious</h2>
      <p>
        Ask. Read other people's code. Look up what you don't understand and
        share what you find. Curiosity is contagious — feed it.
      </p>
      <h2>Be honest</h2>
      <p>
        Say when you're stuck. Say when something doesn't make sense. Don't
        pretend you got it. That's where the real learning happens, and the
        group can only help you if you let them.
      </p>
      <h2>Mock no one</h2>
      <p>
        Inside or outside the cohort. We don't punch down at people who don't
        code yet, who use a different stack, who paid for a course, who use
        AI a lot, or who don't. That's not who we are.
      </p>
      <h2>If something feels off</h2>
      <p>
        DM Cyber on Telegram or email{' '}
        <a href="mailto:cyber@themodern.dev">cyber@themodern.dev</a>. We take
        the small things seriously so the big things don't happen.
      </p>
      <h2>What gets you removed</h2>
      <p>
        Harassment, doxxing, threats, or behaviour that makes the group feel
        unsafe. One warning if it's borderline, none if it isn't.
      </p>
    </LegalShell>
  );
}
