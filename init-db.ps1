# Wait for PostgreSQL to be ready
Write-Host "Initializing database schema..."

$maxAttempts = 30
$attempt = 0

while ($attempt -lt $maxAttempts) {
    try {
        $env:PGPASSWORD = "bcvs_password_2024"
        docker exec bcvs-postgres psql -U bcvs_user -d bcvs -c '\q' 2>$null
        if ($LASTEXITCODE -eq 0) {
            break
        }
    } catch {
        Write-Host "Waiting for PostgreSQL to be ready... (Attempt $($attempt + 1)/$maxAttempts)"
        Start-Sleep -Seconds 2
        $attempt++
    }
}

if ($attempt -eq $maxAttempts) {
    Write-Host "❌ Failed to connect to PostgreSQL"
    exit 1
}

Write-Host "PostgreSQL is ready. Executing schema..."

# Execute schema
$env:PGPASSWORD = "bcvs_password_2024"
Get-Content "backend\src\config\schema.sql" | docker exec -i bcvs-postgres psql -U bcvs_user -d bcvs

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Database initialized successfully!"
    Write-Host ""
    Write-Host "Default credentials:"
    Write-Host "  Admin: admin@bcvs.com / Admin@123"
    Write-Host "  Institution: mit@university.edu / Admin@123"
    Write-Host "  Student: john@student.com / Admin@123"
} else {
    Write-Host "❌ Failed to initialize database"
    exit 1
}
