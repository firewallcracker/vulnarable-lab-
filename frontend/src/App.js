import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

function App() {
  const [user, setUser] = useState(null);
  const [challenges, setChallenges] = useState([]);
  const [activeLab, setActiveLab] = useState(null);
  const [flag, setFlag] = useState('');
  const [message, setMessage] = useState('');
  const [progress, setProgress] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const userData = JSON.parse(atob(token.split('.')[1]));
        setUser(userData);
        loadChallenges();
      } catch (error) {
        console.error('Invalid token, clearing storage');
        localStorage.removeItem('token');
      }
    }
  }, []);

  const loadChallenges = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Loading challenges with token:', token);
      const response = await axios.get(`${API_URL}/api/challenges`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Challenges response:', response.data);
      setChallenges(response.data);
      await loadProgress();
    } catch (error) {
      console.error('Failed to load challenges:', error.response?.data || error.message);
      if (error.response?.status === 401) {
        console.log('Auth token might be invalid, clearing...');
        localStorage.removeItem('token');
        setUser(null);
      }
    }
  };

  const loadProgress = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/progress`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setProgress(response.data);
    } catch (error) {
      console.error('Failed to load progress');
    }
  };

  const login = async (username, password) => {
    try {
      const response = await axios.post(`${API_URL}/api/login`, { username, password });
      localStorage.setItem('token', response.data.token);
      setUser({ username: response.data.username, isAdmin: response.data.isAdmin });
      loadChallenges();
    } catch (error) {
      setMessage('Login failed');
    }
  };

  const register = async (username, password) => {
    try {
      console.log('Attempting registration...');
      const response = await axios.post(`${API_URL}/api/register`, { username, password });
      console.log('Registration successful:', response.data);
      localStorage.setItem('token', response.data.token);
      setUser({ username: response.data.username });
      console.log('Loading challenges...');
      await loadChallenges();
      console.log('Challenges loaded');
    } catch (error) {
      console.error('Registration error:', error.response?.data || error.message);
      setMessage('Registration failed: ' + (error.response?.data?.error || error.message));
    }
  };

  const startLab = async (challengeId) => {
    try {
      const response = await axios.post(`${API_URL}/api/labs/start`, { challengeId }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setActiveLab({ challengeId, ...response.data });
      setMessage('Lab started! Access your challenge at the URL below.');
    } catch (error) {
      setMessage('Failed to start lab');
    }
  };

  const submitFlag = async () => {
    try {
      const response = await axios.post(`${API_URL}/api/submit`, 
        { challengeId: activeLab.challengeId, flag }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setMessage(response.data.message);
      if (response.data.correct) {
        setActiveLab(null);
        setFlag('');
        loadProgress(); // Refresh progress after successful submission
      }
    } catch (error) {
      setMessage('Submission failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setChallenges([]);
    setActiveLab(null);
  };

  if (!user) {
    return <LoginForm onLogin={login} onRegister={register} message={message} />;
  }

  return (
    <div className="app">
      <header>
        <h1>🛡️ SkillLab</h1>
        <div>
          Welcome, {user.username}! 
          <button onClick={logout}>Logout</button>
        </div>
      </header>

      {progress && (
        <div className="progress-section">
          <h2>📊 Your Progress</h2>
          <div className="progress-stats">
            <div className="stat">
              <span className="stat-number">{progress.completedCount}</span>
              <span className="stat-label">Completed</span>
            </div>
            <div className="stat">
              <span className="stat-number">{progress.totalChallenges}</span>
              <span className="stat-label">Total</span>
            </div>
            <div className="stat">
              <span className="stat-number">{progress.progressPercentage}%</span>
              <span className="stat-label">Progress</span>
            </div>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{width: `${progress.progressPercentage}%`}}></div>
          </div>
        </div>
      )}

      {message && <div className="message">{message}</div>}

      {activeLab ? (
        <div className="active-lab">
          <div className="lab-header">
            <h2>Active Lab</h2>
            <button className="back-button" onClick={() => setActiveLab(null)}>← Back to Challenges</button>
          </div>
          <p>Challenge URL: <a href={activeLab.labUrl} target="_blank" rel="noopener noreferrer">{activeLab.labUrl}</a></p>
          <div className="flag-submission">
            <input 
              type="text" 
              placeholder="Enter flag here..." 
              value={flag}
              onChange={(e) => setFlag(e.target.value)}
            />
            <button onClick={submitFlag}>Submit Flag</button>
          </div>
        </div>
      ) : (
        <div className="challenges">
          <h2>Available Challenges</h2>
          {challenges.map(challenge => {
            const isCompleted = progress?.completedChallenges.includes(challenge.id);
            return (
              <div key={challenge.id} className={`challenge-card ${isCompleted ? 'completed' : ''}`}>
                <div className="challenge-header">
                  <h3>{challenge.name} {isCompleted && '✅'}</h3>
                  {isCompleted && <span className="completed-badge">Completed</span>}
                </div>
                <p>{challenge.description}</p>
                <div className="challenge-meta">
                  <span className="difficulty">{challenge.difficulty}</span>
                  {challenge.owasp && <span className="owasp-tag">OWASP {challenge.owasp}</span>}
                </div>
                <button onClick={() => startLab(challenge.id)}>
                  {isCompleted ? 'Retry Lab' : 'Start Lab'}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function LoginForm({ onLogin, onRegister, message }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLogin) {
      onLogin(username, password);
    } else {
      onRegister(username, password);
    }
  };

  return (
    <div className="login-form">
      <h1>🛡️ SkillLab</h1>
      <h2>Beginner Hacking Practice Platform</h2>
      {message && <div className="message error">{message}</div>}
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          placeholder="Username" 
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">{isLogin ? 'Login' : 'Register'}</button>
      </form>
      <p>
        {isLogin ? "Don't have an account? " : "Already have an account? "}
        <button type="button" onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? 'Register' : 'Login'}
        </button>
      </p>
    </div>
  );
}

export default App;