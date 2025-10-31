const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const app = express();

// In-memory database for demo - OWASP Top 10 2021
const db = {
  users: [],
  challenges: [
    {
      id: 1,
      name: 'A01: Broken Access Control',
      description: 'Bypass access controls to access unauthorized functionality',
      difficulty: 'Beginner',
      flag: 'SKILLLAB{br0k3n_4cc3ss_c0ntr0l}',
      owasp: 'A01:2021'
    },
    {
      id: 2,
      name: 'A02: Cryptographic Failures',
      description: 'Exploit weak cryptographic implementations',
      difficulty: 'Intermediate',
      flag: 'SKILLLAB{cr7pt0_f41lur3s_pwn3d}',
      owasp: 'A02:2021'
    },
    {
      id: 3,
      name: 'A03: Injection (SQL)',
      description: 'Learn to exploit SQL injection vulnerabilities',
      difficulty: 'Beginner',
      flag: 'SKILLLAB{sql_1nj3ct10n_m4st3r}',
      owasp: 'A03:2021'
    },
    {
      id: 4,
      name: 'A04: Insecure Design',
      description: 'Exploit flaws in application design and architecture',
      difficulty: 'Advanced',
      flag: 'SKILLLAB{1ns3cur3_d3s1gn_fl4w}',
      owasp: 'A04:2021'
    },
    {
      id: 5,
      name: 'A05: Security Misconfiguration',
      description: 'Find and exploit security misconfigurations',
      difficulty: 'Intermediate',
      flag: 'SKILLLAB{m1sc0nf1gur4t10n_3xp0s3d}',
      owasp: 'A05:2021'
    },
    {
      id: 6,
      name: 'A06: Vulnerable Components',
      description: 'Exploit known vulnerabilities in third-party components',
      difficulty: 'Advanced',
      flag: 'SKILLLAB{vuln3r4bl3_c0mp0n3nts}',
      owasp: 'A06:2021'
    },
    {
      id: 7,
      name: 'A07: Authentication Failures',
      description: 'Bypass authentication mechanisms',
      difficulty: 'Beginner',
      flag: 'SKILLLAB{4uth3nt1c4t10n_byp4ss}',
      owasp: 'A07:2021'
    },
    {
      id: 8,
      name: 'A08: Software Integrity Failures',
      description: 'Exploit software and data integrity failures',
      difficulty: 'Advanced',
      flag: 'SKILLLAB{1nt3gr1ty_f41lur3_pwn}',
      owasp: 'A08:2021'
    },
    {
      id: 9,
      name: 'A09: Logging Failures',
      description: 'Exploit insufficient logging and monitoring',
      difficulty: 'Intermediate',
      flag: 'SKILLLAB{l0gg1ng_f41lur3s_h1dd3n}',
      owasp: 'A09:2021'
    },
    {
      id: 10,
      name: 'A10: Server-Side Request Forgery',
      description: 'Perform SSRF attacks against internal services',
      difficulty: 'Advanced',
      flag: 'SKILLLAB{ssrf_1nt3rn4l_4cc3ss}',
      owasp: 'A10:2021'
    }
  ],
  labs: [],
  submissions: []
};

let nextUserId = 1;
let nextLabId = 1;

app.use(cors());
app.use(express.json());

// Serve challenge files
app.use('/challenge', express.static(path.join(__dirname, '../challenges/sql-injection')));

// Serve static files from frontend build
app.use(express.static(path.join(__dirname, '../frontend/build')));

// Handle React routing, return all requests to React app
app.get('*', function(req, res) {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
  }
});

const JWT_SECRET = 'demo-secret-key';

const auth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  console.log('Auth middleware - Token:', token);
  if (!token) return res.status(401).json({ error: 'No token' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    console.log('Auth middleware - Verified user:', req.user);
    next();
  } catch (error) { 
    console.error('Auth middleware - Token verification failed:', error.message);
    res.status(401).json({ error: 'Invalid token' }); 
  }
};

// Auth routes
app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;
  if (db.users.find(u => u.username === username)) {
    return res.status(400).json({ error: 'Username exists' });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = { id: nextUserId++, username, password: hashedPassword, isAdmin: false };
  db.users.push(user);
  const token = jwt.sign({ userId: user.id, username }, JWT_SECRET);
  res.json({ token, username });
});

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const user = db.users.find(u => u.username === username);
  if (user && await bcrypt.compare(password, user.password)) {
    const token = jwt.sign({ userId: user.id, username, isAdmin: user.isAdmin }, JWT_SECRET);
    res.json({ token, username, isAdmin: user.isAdmin });
  } else res.status(401).json({ error: 'Invalid credentials' });
});

// Challenge routes
app.get('/api/challenges', auth, (req, res) => {
  console.log('GET /api/challenges - User:', req.user);
  const challenges = db.challenges.map(c => ({ 
    id: c.id, 
    name: c.name, 
    description: c.description, 
    difficulty: c.difficulty,
    owasp: c.owasp
  }));
  console.log('Sending challenges:', challenges);
  res.json(challenges);
});

app.post('/api/labs/start', auth, (req, res) => {
  const { challengeId } = req.body;
  const labId = uuidv4();
  
  const lab = {
    id: nextLabId++,
    userId: req.user.userId,
    challengeId,
    labId,
    active: true,
    createdAt: new Date()
  };
  
  db.labs.push(lab);
  
  // OWASP Top 10 challenge URLs
  let labUrl;
  switch(challengeId) {
    case 1: // A01: Broken Access Control
      labUrl = `http://localhost:3001/challenge/access-control.html?lab=${labId}`;
      break;
    case 2: // A02: Cryptographic Failures
      labUrl = `http://localhost:3001/challenge/crypto-failures.html?lab=${labId}`;
      break;
    case 3: // A03: Injection (SQL)
      labUrl = `http://localhost:3001/challenge/sql-injection.html?lab=${labId}`;
      break;
    case 4: // A04: Insecure Design
      labUrl = `http://localhost:3001/challenge/insecure-design.html?lab=${labId}`;
      break;
    case 5: // A05: Security Misconfiguration
      labUrl = `http://localhost:3001/challenge/misconfiguration.html?lab=${labId}`;
      break;
    case 6: // A06: Vulnerable Components
      labUrl = `http://localhost:3001/challenge/vulnerable-components.html?lab=${labId}`;
      break;
    case 7: // A07: Authentication Failures
      labUrl = `http://localhost:3001/challenge/auth-failures.html?lab=${labId}`;
      break;
    case 8: // A08: Software Integrity Failures
      labUrl = `http://localhost:3001/challenge/integrity-failures.html?lab=${labId}`;
      break;
    case 9: // A09: Logging Failures
      labUrl = `http://localhost:3001/challenge/logging-failures.html?lab=${labId}`;
      break;
    case 10: // A10: SSRF
      labUrl = `http://localhost:3001/challenge/ssrf.html?lab=${labId}`;
      break;
    default:
      labUrl = `http://localhost:3001/challenge/sql-injection.html?lab=${labId}`;
  }
  
  res.json({ labUrl, labId });
});

app.post('/api/labs/stop', auth, (req, res) => {
  const { challengeId } = req.body;
  const lab = db.labs.find(l => l.userId === req.user.userId && l.challengeId === challengeId && l.active);
  if (lab) {
    lab.active = false;
  }
  res.json({ success: true });
});

app.post('/api/submit', auth, (req, res) => {
  const { challengeId, flag } = req.body;
  const challenge = db.challenges.find(c => c.id === challengeId);
  const correct = challenge?.flag === flag;
  
  db.submissions.push({
    userId: req.user.userId,
    challengeId,
    flag,
    correct,
    submittedAt: new Date()
  });
  
  res.json({ correct, message: correct ? 'Correct! Well done!' : 'Incorrect flag. Try again!' });
});

// Progress tracking
app.get('/api/progress', auth, (req, res) => {
  const userSubmissions = db.submissions.filter(s => s.userId === req.user.userId && s.correct);
  const completedChallenges = userSubmissions.map(s => s.challengeId);
  const totalChallenges = db.challenges.length;
  const completedCount = completedChallenges.length;
  const progressPercentage = Math.round((completedCount / totalChallenges) * 100);
  
  res.json({
    completedChallenges,
    completedCount,
    totalChallenges,
    progressPercentage,
    submissions: userSubmissions.map(s => ({
      challengeId: s.challengeId,
      submittedAt: s.submittedAt,
      challengeName: db.challenges.find(c => c.id === s.challengeId)?.name
    }))
  });
});

// Admin routes
app.get('/api/admin/labs', auth, (req, res) => {
  if (!req.user.isAdmin) return res.status(403).json({ error: 'Admin only' });
  const activeLabs = db.labs.filter(l => l.active).map(lab => {
    const user = db.users.find(u => u.id === lab.userId);
    const challenge = db.challenges.find(c => c.id === lab.challengeId);
    return { ...lab, username: user?.username, challengeName: challenge?.name };
  });
  res.json(activeLabs);
});

app.listen(3001, () => console.log('Server running on port 3001'));