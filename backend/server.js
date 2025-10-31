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

// Serve challenge files
app.use('/challenge', express.static(path.join(__dirname, '../challenges/sql-injection')));

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

// Handle React routing, return all requests to React app
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
  }
});

app.listen(3001, () => {
  console.log('Server running on port 3001');
  console.log('Database initialized with:', {
    usersCount: db.users.length,
    challengesCount: db.challenges.length,
    challenges: db.challenges.map(c => c.name)
  });
});