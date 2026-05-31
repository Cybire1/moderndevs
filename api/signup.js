import prisma from './_prisma.js';

const EXPERIENCES = ['Not at all', 'A little', 'I code'];
const validEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const body = req.body ?? {};
  const name = String(body.name ?? '').trim();
  const email = String(body.email ?? '').trim();
  const telegram = String(body.telegram ?? '').trim() || null;
  const experience = String(body.experience ?? '');

  if (!name) return res.status(400).json({ error: 'name required' });
  if (!email || !validEmail(email)) return res.status(400).json({ error: 'valid email required' });
  if (!EXPERIENCES.includes(experience)) return res.status(400).json({ error: 'invalid experience' });
  if (name.length > 120 || email.length > 200 || (telegram && telegram.length > 64)) {
    return res.status(400).json({ error: 'field too long' });
  }

  try {
    await prisma.signup.create({
      data: { name, email: email.toLowerCase(), telegram, experience },
    });
    return res.status(201).json({ ok: true });
  } catch (err) {
    // P2002 = unique constraint violation (duplicate email)
    if (err?.code === 'P2002') {
      return res.status(409).json({ error: 'already signed up' });
    }
    console.error('signup error:', err);
    return res.status(500).json({ error: 'server error' });
  }
}
