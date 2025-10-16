@echo off
echo Building SkillLab challenge images...

cd challenges\sql-injection
docker build -t skilllab-sqli .
cd ..\..

echo Challenge images built successfully!
echo Available images:
echo - skilllab-sqli (SQL Injection Challenge)