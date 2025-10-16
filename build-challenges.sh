#!/bin/bash

echo "Building SkillLab challenge images..."

# Build SQL Injection Challenge
cd challenges/sql-injection
docker build -t skilllab-sqli .
cd ../..

echo "Challenge images built successfully!"
echo "Available images:"
echo "- skilllab-sqli (SQL Injection Challenge)"