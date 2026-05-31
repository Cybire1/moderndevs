import prisma from './_prisma.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const count = await prisma.signup.count();
    res.setHeader('Cache-Control', 's-maxage=30, stale-while-revalidate=60');
    return res.status(200).json({ count });
  } catch (err) {
    console.error('count error:', err);
    return res.status(500).json({ error: 'server error' });
  }
}
