// Vercel serverless function for challenges
const challenges = [
  {
    id: 1,
    name: 'A01: Broken Access Control',
    description: 'Bypass access controls to access unauthorized functionality',
    difficulty: 'Beginner',
    flag: 'SKILLLAB{br0k3n_4cc3ss_c0ntr0l}',
    owasp: 'A01:2021'
  },
  {
    id: 3,
    name: 'A03: Injection (SQL)',
    description: 'Learn to exploit SQL injection vulnerabilities',
    difficulty: 'Beginner',
    flag: 'SKILLLAB{sql_1nj3ct10n_m4st3r}',
    owasp: 'A03:2021'
  }
];

export default function handler(req, res) {
  if (req.method === 'GET') {
    res.status(200).json(challenges.map(c => ({
      id: c.id,
      name: c.name,
      description: c.description,
      difficulty: c.difficulty,
      owasp: c.owasp
    })));
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}