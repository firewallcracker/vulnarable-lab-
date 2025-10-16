# 🎬 SkillLab Demo Guide

## Quick Demo Flow (2 minutes)

### Step 1: Start the Platform (30 seconds)
```bash
# Build challenges first
./build-challenges.sh  # or build-challenges.bat on Windows

# Start all services
docker-compose up --build
```

Wait for all services to start (you'll see "Server running on port 3001").

### Step 2: User Registration (20 seconds)
1. Open http://localhost:3000
2. Click "Register"
3. Create account: username `demo`, password `demo123`
4. You'll be automatically logged in

### Step 3: Start SQL Injection Challenge (30 seconds)
1. See the "SQL Injection Basics" challenge card
2. Click "Start Lab" button
3. Wait for lab to spin up (5-10 seconds)
4. Note the unique lab URL (e.g., http://localhost:8123)

### Step 4: Exploit the Vulnerability (40 seconds)
1. Click on your lab URL to open the vulnerable application
2. See the login form with hints provided
3. In the username field, enter: `admin'--`
4. Enter any password (it will be ignored)
5. Click "Login"
6. See the flag displayed: `SKILLLAB{sql_1nj3ct10n_m4st3r}`

### Step 5: Submit Flag (20 seconds)
1. Copy the flag from the vulnerable app
2. Return to the SkillLab platform tab
3. Paste the flag in the "Submit Flag" field
4. Click "Submit Flag"
5. See success message: "Correct! Well done!"

## Demo Script for Presentation

**"Let me show you SkillLab in action..."**

1. **"First, I'll start the platform with Docker Compose"** - Show terminal with `docker-compose up`

2. **"The platform provides a clean interface for beginners"** - Show registration/login

3. **"Students can browse available challenges"** - Show challenge catalog

4. **"Each lab creates an isolated container"** - Click "Start Lab", show unique URL

5. **"The vulnerable application includes helpful hints"** - Show the SQL injection challenge

6. **"Students practice real exploitation techniques"** - Demonstrate the SQL injection

7. **"The platform validates learning with flag submission"** - Submit flag and show success

8. **"Everything is contained and safe for learning"** - Emphasize isolation and educational purpose

## Key Demo Points to Highlight

✅ **Easy Setup**: Single command starts everything  
✅ **Isolation**: Each student gets their own container  
✅ **Progressive Hints**: Beginners get the help they need  
✅ **Real Vulnerabilities**: Authentic learning experience  
✅ **Safe Environment**: No risk to production systems  
✅ **Immediate Feedback**: Flag validation confirms learning  

## Technical Demo Details

### Container Isolation
- Show `docker ps` to demonstrate isolated containers
- Each lab gets a unique port mapping
- Containers have no external network access

### Admin Features
- Create admin user in database to show admin panel
- View active labs and user submissions
- Demonstrate lab management capabilities

### Scalability
- Start multiple labs simultaneously
- Show that each gets unique resources
- Demonstrate automatic cleanup after inactivity

## Troubleshooting Demo Issues

**If containers don't start:**
- Ensure Docker is running
- Check ports 3000, 3001 are free
- Run `docker-compose down` first

**If challenge image missing:**
- Run build script first: `./build-challenges.sh`
- Check Docker build output for errors

**If database connection fails:**
- Wait 30-60 seconds for PostgreSQL to initialize
- Check `docker-compose logs db` for issues

---

**Demo Duration: ~2 minutes for basic flow, 5-10 minutes for detailed technical demo**