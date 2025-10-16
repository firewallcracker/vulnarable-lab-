# 🚀 Quick Start Guide

## Option 1: Automatic Start
```bash
.\start.bat
```

## Option 2: Manual Start

### Step 1: Install Dependencies
```bash
npm install
cd backend && npm install && cd ..
cd frontend && npm install && cd ..
```

### Step 2: Start Backend (Terminal 1)
```bash
cd backend
npm start
```

### Step 3: Start Frontend (Terminal 2)
```bash
cd frontend
npm start
```

## Access Points
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Challenge**: http://localhost:3001/challenge/index.html

## Demo Flow
1. **Register** at http://localhost:3000 (e.g., username: `demo`, password: `demo123`)
2. **Start Lab** - Click "Start Lab" for SQL Injection challenge
3. **Access Challenge** - Click the lab URL
4. **Exploit** - Enter `admin'--` in username field (any password)
5. **Get Flag** - See `SKILLLAB{sql_1nj3ct10n_m4st3r}`
6. **Submit** - Copy flag back to platform

## Troubleshooting
- Make sure Node.js is installed
- Ports 3000 and 3001 must be free
- If frontend doesn't auto-open, manually go to http://localhost:3000