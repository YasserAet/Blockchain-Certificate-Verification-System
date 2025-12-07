# ⚠️ Docker Issues - Use Local Setup Instead

## Problem
Docker Desktop is experiencing a "read-only file system" error, preventing services from starting.

## Solution
**Use local setup instead of Docker** - It's actually faster for development!

Follow this guide: **[START_LOCAL.md](START_LOCAL.md)**

---

## Quick Local Setup (5 commands)

```powershell
# 1. Setup environment files
copy .env.example .env.local
copy backend\.env.example backend\.env
copy ml-service\.env.example ml-service\.env

# 2. Install PostgreSQL (if not installed)
# Download: https://www.postgresql.org/download/windows/

# 3. Create database (in psql or pgAdmin)
# CREATE DATABASE credential_chain;

# 4. Start services (in separate terminals):
cd blockchain; npm install; npx hardhat node
cd ml-service; .\setup_ml_env.ps1; .\venv\Scripts\Activate.ps1; uvicorn app.main:app --reload
cd backend; npm install; npm run dev
npm install; npm run dev  # Frontend
```

---

## Why Local Setup is Better

✅ **Faster startup** - No Docker image building (saves 10-15 minutes)  
✅ **Hot reload works better** - Changes reflect instantly  
✅ **Easier debugging** - Direct access to logs and processes  
✅ **No Docker issues** - No network/volume/permission problems  

---

## Fixing Docker (Optional)

If you want to fix Docker later:

1. **Restart Docker Desktop**
   ```powershell
   # Close Docker Desktop completely
   # Open Task Manager → Find Docker processes → End Task
   # Restart Docker Desktop
   ```

2. **Reset Docker**
   - Docker Desktop → Settings → Troubleshoot → Reset to factory defaults
   - ⚠️ This deletes all containers and images

3. **Check WSL 2** (if on Windows 11)
   ```powershell
   wsl --update
   wsl --shutdown
   # Restart Docker Desktop
   ```

---

**Current Status**: ✅ All configuration files created  
**Recommended Action**: Use local setup (START_LOCAL.md)  
**Docker Status**: ⚠️ Not required for development
