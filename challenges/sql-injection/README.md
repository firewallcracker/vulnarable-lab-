# SQL Injection Challenge

## Learning Objectives
- Understand SQL injection vulnerabilities
- Learn to identify and exploit basic SQL injection flaws
- Practice bypassing authentication using SQL injection

## Challenge Description
This challenge presents a vulnerable login form that is susceptible to SQL injection attacks. Your goal is to bypass the authentication and login as an admin user to retrieve the flag.

## Hints (Progressive)

### Level 1 - Discovery
Try entering a single quote (') in the username field. What happens?

### Level 2 - Understanding
The application uses this vulnerable query:
```sql
SELECT * FROM users WHERE username = '$username' AND password = '$password'
```

### Level 3 - Exploitation
- The admin username is 'admin'
- You need to bypass the password check
- SQL comments can be used with `--` or `#`

## Solution Walkthrough

### Step 1: Identify the Vulnerability
Enter a single quote in the username field to see if the application is vulnerable to SQL injection.

### Step 2: Craft the Payload
Use the following payload in the username field:
```
admin'--
```

This works because:
- `admin'` closes the username string
- `--` comments out the rest of the query (including the password check)

### Step 3: Retrieve the Flag
Once logged in as admin, the application will display the flag: `SKILLLAB{sql_1nj3ct10n_m4st3r}`

## Alternative Payloads
- `admin' OR '1'='1'--`
- `admin' OR 1=1--`
- `' OR '1'='1'--` (works for any username)

## Security Lessons
- Always use prepared statements/parameterized queries
- Never concatenate user input directly into SQL queries
- Implement proper input validation and sanitization
- Use least privilege principle for database accounts