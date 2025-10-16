# 🛡️ SkillLab - Native Setup (No Docker Required)

## 🚀 Quick Start (Native Mode)

### Prerequisites
- Node.js (v16 or higher) - Download from https://nodejs.org
- No Docker required!

### Setup & Run

1. **Install Node.js** if not already installed
2. **Run the startup script:**
```bash
start-native.bat
```

Or manually:
```bash
# Install dependencies
npm install
npm run install-all

# Start both frontend and backend
npm start
```

3. **Access the platform:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- Challenge: http://localhost:3001/challenge/index.php

## 🎯 How It Works (Native Mode)

### Key Differences from Docker Version:
- ✅ **No Docker required** - Runs directly on your system
- ✅ **In-memory database** - No PostgreSQL setup needed
- ✅ **Simulated challenges** - PHP challenge runs via Node.js static serving
- ✅ **Instant startup** - No container building or orchestration

### Demo Flow:
1. **Register** at http://localhost:3000 (username: `demo`, password: `demo123`)
2. **Start Lab** - Click "Start Lab" for SQL Injection challenge
3. **Access Challenge** - Click the lab URL to open the vulnerable app
4. **Exploit** - Enter `admin'--` in username field
5. **Get Flag** - See `SKILLLAB{sql_1nj3ct10n_m4st3r}`
6. **Submit** - Paste flag back in platform to complete

## 🔧 Technical Details

### Architecture (Native):
```
┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │
│   (React)       │◄──►│  (Node.js)      │
│   Port 3000     │    │   Port 3001     │
└─────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │ Static Files    │
                       │ (PHP Challenge) │
                       └─────────────────┘
```

### Data Storage:
- **Users, challenges, labs** - Stored in memory (resets on restart)
- **No database setup** - Perfect for quick demos and learning
- **Session persistence** - JWT tokens work across browser sessions

### Challenge Simulation:
- **SQL Injection** - Simulated vulnerable login without actual database
- **Same learning experience** - Students practice real injection techniques
- **Safe environment** - No actual SQL database to compromise

## 🎓 Educational Value

This native version provides the **same learning experience** as the Docker version:
- Students learn SQL injection techniques
- Practice with realistic vulnerable applications
- Understand security concepts through hands-on experience
- Safe, contained environment for experimentation

Perfect for:
- ✅ **Quick demos** and presentations
- ✅ **Classroom environments** without Docker setup
- ✅ **Individual learning** on any system
- ✅ **Development and testing** of new challenges

---

**Ready to hack safely! 🎯**