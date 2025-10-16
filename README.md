# 🛡️ SkillLab - Beginner Hacking Practice Platform

A safe, sandboxed web platform where beginners can practice web application security skills through intentionally vulnerable challenges.

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose
- Git

### Setup & Run

1. **Clone and navigate to the project:**
```bash
git clone <repository-url>
cd "Beginner Hacking Practice Platform (SkillLab)"
```

2. **Build challenge images:**
```bash
# On Linux/Mac:
chmod +x build-challenges.sh
./build-challenges.sh

# On Windows:
cd challenges/sql-injection
docker build -t skilllab-sqli .
cd ../..
```

3. **Start the platform:**
```bash
docker-compose up --build
```

4. **Access the platform:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

## 🎯 How to Use

### For Students

1. **Register/Login** at http://localhost:3000
2. **Browse Challenges** - View available security challenges
3. **Start a Lab** - Click "Start Lab" to get your isolated challenge instance
4. **Practice** - Access your unique challenge URL and practice exploitation
5. **Submit Flag** - Enter the flag you discovered to complete the challenge

### Example Walkthrough (SQL Injection)

1. Start the "SQL Injection Basics" challenge
2. Access your unique lab URL (e.g., http://localhost:8123)
3. Try entering `admin'--` in the username field
4. Retrieve the flag: `SKILLLAB{sql_1nj3ct10n_m4st3r}`
5. Submit the flag to mark the challenge as complete

### For Administrators

- Access admin features by creating an admin user in the database
- View active labs and manage user sessions
- Monitor platform usage and submissions

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   Database      │
│   (React)       │◄──►│  (Node.js)      │◄──►│  (PostgreSQL)   │
│   Port 3000     │    │   Port 3001     │    │   Port 5432     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │ Docker Engine   │
                       │ (Challenge      │
                       │  Containers)    │
                       └─────────────────┘
```

## 🔒 Security Features

- **Container Isolation**: Each challenge runs in an isolated Docker container
- **Network Segmentation**: Challenge containers have no external internet access
- **Resource Limits**: Automatic cleanup after 30 minutes of inactivity
- **User Authentication**: JWT-based authentication system
- **Safe Environment**: All vulnerabilities are contained within sandboxes

## 📚 Available Challenges

### SQL Injection Basics
- **Difficulty**: Beginner
- **Objective**: Bypass login authentication using SQL injection
- **Learning Goals**: Understanding SQL injection vulnerabilities
- **Flag**: `SKILLLAB{sql_1nj3ct10n_m4st3r}`

## 🛠️ Development

### Project Structure
```
├── docker-compose.yml          # Main orchestration
├── backend/                    # Node.js API server
│   ├── server.js              # Main server file
│   ├── package.json           # Dependencies
│   └── Dockerfile             # Backend container
├── frontend/                   # React application
│   ├── src/App.js             # Main React component
│   ├── package.json           # Dependencies
│   └── Dockerfile             # Frontend container
├── challenges/                 # Challenge definitions
│   └── sql-injection/         # SQL injection challenge
│       ├── Dockerfile         # Challenge container
│       ├── index.php          # Vulnerable application
│       └── README.md          # Challenge documentation
└── README.md                  # This file
```

### Adding New Challenges

1. Create a new directory in `challenges/`
2. Add a Dockerfile for your vulnerable application
3. Update the database with challenge metadata
4. Build and test your challenge container
5. Document the challenge with hints and solutions

### API Endpoints

- `POST /api/register` - User registration
- `POST /api/login` - User authentication
- `GET /api/challenges` - List available challenges
- `POST /api/labs/start` - Start a challenge instance
- `POST /api/labs/stop` - Stop a challenge instance
- `POST /api/submit` - Submit a flag for validation
- `GET /api/admin/labs` - Admin: View active labs

## 🚨 Responsible Use Policy

**IMPORTANT**: This platform is for educational purposes only.

### Allowed Activities
✅ Practice on provided challenges within the platform  
✅ Learn about web application security vulnerabilities  
✅ Use the platform for educational and training purposes  
✅ Share knowledge and help others learn  

### Prohibited Activities
❌ Attempting to escape from containers or access the host system  
❌ Using techniques learned here against real-world applications without permission  
❌ Sharing or distributing challenge solutions publicly  
❌ Attempting to attack the platform infrastructure itself  
❌ Any illegal activities or unauthorized access attempts  

### Legal Disclaimer
- Users are responsible for complying with all applicable laws
- This platform is provided for educational purposes only
- The creators are not responsible for misuse of the knowledge gained
- By using this platform, you agree to use it responsibly and ethically

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Add your challenge or improvement
4. Test thoroughly in the containerized environment
5. Submit a pull request with documentation

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Troubleshooting

### Common Issues

**Containers won't start:**
- Ensure Docker is running
- Check if ports 3000, 3001 are available
- Run `docker-compose down` and try again

**Challenge containers fail to create:**
- Build challenge images first: `./build-challenges.sh`
- Check Docker daemon is accessible
- Verify sufficient disk space

**Database connection errors:**
- Wait for PostgreSQL to fully initialize (30-60 seconds)
- Check database credentials in docker-compose.yml

### Getting Help

- Check the logs: `docker-compose logs [service-name]`
- Verify all services are running: `docker-compose ps`
- Reset everything: `docker-compose down -v && docker-compose up --build`

---

**Happy Hacking! 🎯**