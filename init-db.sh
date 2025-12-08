#!/bin/bash

echo "Initializing database schema..."

# Wait for PostgreSQL to be ready
until PGPASSWORD=bcvs_password_2024 psql -h localhost -U bcvs_user -d bcvs -c '\q' 2>/dev/null; do
  echo "Waiting for PostgreSQL to be ready..."
  sleep 2
done

echo "PostgreSQL is ready. Executing schema..."

# Execute schema
PGPASSWORD=bcvs_password_2024 psql -h localhost -U bcvs_user -d bcvs -f backend/src/config/schema.sql

echo "✅ Database initialized successfully!"
