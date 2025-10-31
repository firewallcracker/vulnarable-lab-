const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const app = express();

console.log('Initializing server...');

// Initialize the database
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

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Serve challenge files - make sure this comes before the frontend static files
app.use('/challenge', (req, res, next) => {
  console.log('Challenge file requested:', req.path);
  next();
}, express.static(path.join(__dirname, '../challenges/sql-injection')));

// In production, use /lab path for challenge files
app.use('/lab', (req, res, next) => {
  console.log('Lab file requested:', req.path);
  next();
}, express.static(path.join(__dirname, '../challenges/sql-injection')));

// Serve static files from frontend build
app.use(express.static(path.join(__dirname, '../frontend/build')));

const JWT_SECRET = 'demo-secret-key';

const auth = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    console.log('Auth - Token:', token);
    if (!token) return res.status(401).json({ error: 'No token' });
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('Auth - Decoded:', decoded);
    req.user = decoded;
    next();
  } catch (error) { 
    console.error('Auth error:', error);
    res.status(401).json({ error: 'Invalid token' }); 
  }
};

// Auth routes
app.post('/api/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log('Register attempt:', { username });
    if (db.users.find(u => u.username === username)) {
      return res.status(400).json({ error: 'Username exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = { id: nextUserId++, username, password: hashedPassword, isAdmin: false };
    db.users.push(user);
    const token = jwt.sign({ userId: user.id, username }, JWT_SECRET);
    console.log('User registered:', { username, userId: user.id });
    res.json({ token, username });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log('Login attempt:', { username });
    const user = db.users.find(u => u.username === username);
    if (user && await bcrypt.compare(password, user.password)) {
      const token = jwt.sign({ userId: user.id, username, isAdmin: user.isAdmin }, JWT_SECRET);
      console.log('Login successful:', { username, userId: user.id });
      res.json({ token, username, isAdmin: user.isAdmin });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Challenge routes
app.get('/api/challenges', auth, (req, res) => {
  try {
    console.log('GET /api/challenges - User:', req.user);
    console.log('Current challenges:', db.challenges.length);
    const challenges = db.challenges.map(c => ({ 
      id: c.id, 
      name: c.name, 
      description: c.description, 
      difficulty: c.difficulty,
      owasp: c.owasp
    }));
    console.log('Sending challenges:', challenges);
    res.json(challenges);
  } catch (error) {
    console.error('Challenges error:', error);
    res.status(500).json({ error: 'Failed to fetch challenges' });
  }
});

// Lab routes
app.post('/api/labs/start', auth, (req, res) => {
  try {
    const { challengeId } = req.body;
    console.log('Starting lab:', { challengeId, user: req.user });
    
    const challenge = db.challenges.find(c => c.id === challengeId);
    if (!challenge) {
      return res.status(404).json({ error: 'Challenge not found' });
    }

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
    
    // Generate lab URL with the correct domain and file name
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? 'https://vulnarable-lab.onrender.com'
      : 'http://localhost:3001';

    // Map challenge IDs to their corresponding paths in challenges/sql-injection directory
    const challengeFiles = {
      1: 'access-control.html',
      2: 'crypto-failures.html',
      3: 'sql-injection.html',
      4: 'insecure-design.html',
      5: 'misconfiguration.html',
      6: 'vulnerable-components.html',
      7: 'auth-failures.html',
      8: 'integrity-failures.html',
      9: 'logging-failures.html',
      10: 'ssrf.html'
    };

    const htmlFile = challengeFiles[challengeId];
    if (!htmlFile) {
      throw new Error(`No HTML file mapped for challenge ID ${challengeId}`);
    }

    // For production, use a separate URL path to distinguish lab pages
    const labUrl = process.env.NODE_ENV === 'production'
      ? `${baseUrl}/lab/${htmlFile}?lab=${labId}`
      : `${baseUrl}/challenge/${htmlFile}?lab=${labId}`;
    
    console.log('Lab started:', { labId, labUrl });
    res.json({ labUrl, labId });
  } catch (error) {
    console.error('Lab start error:', error);
    res.status(500).json({ error: 'Failed to start lab' });
  }
});

app.post('/api/labs/stop', auth, (req, res) => {
  try {
    const { challengeId } = req.body;
    console.log('Stopping lab:', { challengeId, user: req.user });
    
    const lab = db.labs.find(l => 
      l.userId === req.user.userId && 
      l.challengeId === challengeId && 
      l.active
    );
    
    if (lab) {
      lab.active = false;
      console.log('Lab stopped:', { labId: lab.labId });
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error('Lab stop error:', error);
    res.status(500).json({ error: 'Failed to stop lab' });
  }
});

// Progress tracking
app.get('/api/progress', auth, (req, res) => {
  try {
    const userSubmissions = db.submissions.filter(s => s.userId === req.user.userId);
    const completedChallenges = [...new Set(userSubmissions.map(s => s.challengeId))];
    const totalChallenges = db.challenges.length;
    const completedCount = completedChallenges.length;
    const progressPercentage = Math.round((completedCount / totalChallenges) * 100);

    res.json({
      completedChallenges,
      completedCount,
      totalChallenges,
      progressPercentage
    });
  } catch (error) {
    console.error('Progress error:', error);
    res.status(500).json({ error: 'Failed to fetch progress' });
  }
});

// Submission endpoint
app.post('/api/submit', auth, async (req, res) => {
  try {
    const { challengeId, flag } = req.body;
    const challenge = db.challenges.find(c => c.id === challengeId);
    
    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }

    const correct = flag === challenge.flag;
    if (correct) {
      db.submissions.push({
        userId: req.user.userId,
        challengeId,
        timestamp: new Date(),
        correct
      });
    }

    res.json({ 
      message: correct ? 'Congratulations! Flag is correct!' : 'Incorrect flag, try again!',
      correct
    });
  } catch (error) {
    console.error('Submission error:', error);
    res.status(500).json({ error: 'Submission failed' });
  }
});

// Handle React routing, return all requests to React app
app.get('*', (req, res, next) => {
  console.log('Catch-all route hit:', req.path);
  
  // Skip API routes
  if (req.path.startsWith('/api')) {
    return next();
  }
  
  // Skip challenge files
  if (req.path.startsWith('/challenge/')) {
    return next();
  }
  
  // Serve React app for all other routes
  res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

app.listen(3001, () => {
  console.log('Server running on port 3001');
  console.log('Database initialized with:', {
    usersCount: db.users.length,
    challengesCount: db.challenges.length,
    challenges: db.challenges.map(c => c.name)
  });
});