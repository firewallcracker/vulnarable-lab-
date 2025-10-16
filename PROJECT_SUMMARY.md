# 🛡️ SkillLab - Complete OWASP Top 10 Vulnerable Practice Platform

## 📋 Project Overview

**SkillLab** is a comprehensive, beginner-friendly cybersecurity training platform featuring all **OWASP Top 10 2021** vulnerabilities in a safe, containerized environment.

## 🎯 Key Features

### ✅ Complete OWASP Top 10 Coverage
1. **A01: Broken Access Control** - Bypass authorization controls
2. **A02: Cryptographic Failures** - Exploit weak encryption (Base64)
3. **A03: Injection (SQL)** - Classic SQL injection attacks
4. **A04: Insecure Design** - Predictable security questions
5. **A05: Security Misconfiguration** - Debug information exposure
6. **A06: Vulnerable Components** - Exploit outdated libraries
7. **A07: Authentication Failures** - Weak password policies
8. **A08: Software Integrity Failures** - Malicious update packages
9. **A09: Logging Failures** - Insufficient security monitoring
10. **A10: SSRF** - Server-side request forgery attacks

### 🚀 Platform Features
- **User Management** - Registration, login, JWT authentication
- **Progress Tracking** - Visual progress bars and completion statistics
- **Challenge Isolation** - Each lab runs in isolated environment
- **Progressive Hints** - Beginner → Intermediate → Advanced guidance
- **Flag Validation** - Automated scoring and completion tracking
- **Responsive UI** - Clean, educational interface

### 🏗️ Architecture
- **Frontend**: React.js with modern UI/UX
- **Backend**: Node.js/Express with RESTful API
- **Database**: In-memory storage (no setup required)
- **Challenges**: HTML/JavaScript simulated vulnerabilities
- **Deployment**: Docker support + Native Node.js execution

## 🚀 Quick Start

### Option 1: Native Setup (Recommended)
```bash
# Install dependencies
npm install
cd backend && npm install && cd ..
cd frontend && npm install && cd ..

# Start platform
npm start
```

### Option 2: Docker Setup
```bash
# Build challenges
./build-challenges.sh

# Start all services
docker-compose up --build
```

## 🎓 Educational Value

### For Students
- **Hands-on Learning** - Practice real exploitation techniques
- **Safe Environment** - No risk to production systems
- **Progressive Difficulty** - Beginner-friendly with advanced options
- **Immediate Feedback** - Flag validation confirms understanding

### For Instructors
- **Complete Curriculum** - Full OWASP Top 10 coverage
- **Easy Deployment** - Single command setup
- **Progress Monitoring** - Track student completion
- **Extensible** - Easy to add new challenges

## 📊 Challenge Statistics

- **Total Challenges**: 10 (Complete OWASP Top 10)
- **Difficulty Levels**: Beginner, Intermediate, Advanced
- **Unique Flags**: Each challenge has distinct flag
- **Hint System**: 3-tier progressive hint system
- **Completion Tracking**: Visual progress indicators

## 🔒 Security & Compliance

### Responsible Use Policy
- ✅ Educational purposes only
- ✅ Contained sandbox environment
- ✅ No external network access for challenges
- ✅ Clear usage guidelines and legal disclaimers

### Safety Features
- **Container Isolation** - Challenges run in isolated environments
- **Network Segmentation** - No external internet access
- **Resource Limits** - Automatic cleanup and resource management
- **Safe Vulnerabilities** - Simulated flaws, not real exploits

## 📁 Project Structure

```
├── backend/                 # Node.js API server
├── frontend/               # React application
├── challenges/             # OWASP Top 10 challenges
│   └── sql-injection/     # Challenge files (HTML/JS)
├── docker-compose.yml     # Container orchestration
├── README.md             # Main documentation
├── RESPONSIBLE_USE_POLICY.md
└── QUICK_START.md        # Setup guide
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/new-challenge`)
3. Add your challenge with documentation
4. Test thoroughly in isolated environment
5. Submit pull request with detailed description

## 📄 License

MIT License - See LICENSE file for details

## 🆘 Support

- **Documentation**: Check README.md and QUICK_START.md
- **Issues**: Report bugs via GitHub Issues
- **Discussions**: Use GitHub Discussions for questions

---

**Built for cybersecurity education and ethical hacking practice! 🎯**

**Repository**: https://github.com/firewallcracker/vulnarable-lab-