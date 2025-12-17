# Script PowerShell untuk test API PPDB
# Test endpoint /api/pendaftar

Write-Host "=== Testing PPDB API Endpoints ===" -ForegroundColor Green

$baseUrl = "http://localhost:3000"

# Test data
$testData = @{
    nama_lengkap = "Test User PowerShell"
    nisn = "9876543210"
    email = "testps@email.com"
    asal_sekolah = "SMP Test PowerShell"
    jalur_pendaftaran = "Zonasi"
}

Write-Host "`n1. Testing POST /api/pendaftar" -ForegroundColor Yellow

try {
    $jsonBody = $testData | ConvertTo-Json
    Write-Host "   Sending data: $jsonBody" -ForegroundColor Gray
    
    $response = Invoke-RestMethod -Uri "$baseUrl/api/pendaftar" -Method POST -Body $jsonBody -ContentType "application/json" -ErrorAction Stop
    
    Write-Host "   ✓ POST berhasil!" -ForegroundColor Green
    Write-Host "   Response: $($response | ConvertTo-Json -Depth 3)" -ForegroundColor Green
    
} catch {
    Write-Host "   ✗ POST gagal: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseText = $reader.ReadToEnd()
        Write-Host "   Error details: $responseText" -ForegroundColor Red
    }
}

Write-Host "`n2. Testing GET /api/pendaftar" -ForegroundColor Yellow

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/pendaftar" -Method GET -ErrorAction Stop
    
    Write-Host "   ✓ GET berhasil!" -ForegroundColor Green
    Write-Host "   Total data: $($response.total)" -ForegroundColor Green
    
    if ($response.data.Count -gt 0) {
        Write-Host "   Sample data:" -ForegroundColor Gray
        $response.data[0] | Format-List
    }
    
} catch {
    Write-Host "   ✗ GET gagal: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n3. Manual Testing URLs:" -ForegroundColor Yellow
Write-Host "   - Homepage: $baseUrl" -ForegroundColor White
Write-Host "   - Form: $baseUrl/pendaftaran" -ForegroundColor White
Write-Host "   - API GET: $baseUrl/api/pendaftar" -ForegroundColor White

Write-Host "`n4. cURL Examples:" -ForegroundColor Yellow
Write-Host @"
   # POST new pendaftar
   curl -X POST http://localhost:3000/api/pendaftar \
     -H "Content-Type: application/json" \
     -d '{
       "nama_lengkap": "Test User cURL",
       "nisn": "5555666677",
       "email": "testcurl@email.com",
       "asal_sekolah": "SMP Test cURL",
       "jalur_pendaftaran": "Prestasi"
     }'
   
   # GET all pendaftar
   curl -X GET http://localhost:3000/api/pendaftar
"@ -ForegroundColor White

Write-Host "`n=== Testing Complete ===" -ForegroundColor Green