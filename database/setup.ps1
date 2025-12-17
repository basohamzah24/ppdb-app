# Script PowerShell untuk test koneksi database PostgreSQL
# Setup database PPDB Online

Write-Host "=== PPDB Online Database Setup ===" -ForegroundColor Green

# Database connection details
$connectionString = "postgresql://neondb_owner:npg_znVT4IQZy8SA@ep-dawn-shape-a1ndtq31-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

Write-Host "`n1. Testing database connection..." -ForegroundColor Yellow

try {
    # Test connection dengan psql (jika sudah terinstall)
    if (Get-Command psql -ErrorAction SilentlyContinue) {
        Write-Host "   ✓ psql ditemukan" -ForegroundColor Green
        
        # Execute setup script
        Write-Host "`n2. Running database setup script..." -ForegroundColor Yellow
        $setupScript = Join-Path $PSScriptRoot "setup.sql"
        
        if (Test-Path $setupScript) {
            psql $connectionString -f $setupScript
            Write-Host "   ✓ Setup database berhasil" -ForegroundColor Green
        } else {
            Write-Host "   ✗ File setup.sql tidak ditemukan" -ForegroundColor Red
        }
        
    } else {
        Write-Host "   ! psql tidak terinstall" -ForegroundColor Yellow
        Write-Host "   Install PostgreSQL client atau gunakan pgAdmin/DBeaver" -ForegroundColor Yellow
    }
    
} catch {
    Write-Host "   ✗ Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n3. Manual Setup Instructions:" -ForegroundColor Yellow
Write-Host "   - Buka pgAdmin, DBeaver, atau psql client" -ForegroundColor White
Write-Host "   - Connect ke: $connectionString" -ForegroundColor White
Write-Host "   - Jalankan script: database/setup.sql" -ForegroundColor White

Write-Host "`n4. Testing API Endpoint:" -ForegroundColor Yellow
Write-Host "   - Start aplikasi: npm run dev" -ForegroundColor White
Write-Host "   - Buka: http://localhost:3000" -ForegroundColor White
Write-Host "   - Test form: http://localhost:3000/pendaftaran" -ForegroundColor White

Write-Host "`n=== Setup Complete ===" -ForegroundColor Green