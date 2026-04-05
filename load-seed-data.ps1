# Load Seed Data into EduManager Database
# PowerShell Script

Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║          EduManager - Load Seed Data Script               ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Configuration
$dbName = "edumanager_db"
$sqlFile = "backend\src\main\resources\seed-data.sql"

# Check if SQL file exists
if (-not (Test-Path $sqlFile)) {
    Write-Host "❌ Error: Seed data file not found at: $sqlFile" -ForegroundColor Red
    Write-Host "   Make sure you're running this from the project root directory." -ForegroundColor Yellow
    exit 1
}

Write-Host "📁 Found seed data file: $sqlFile" -ForegroundColor Green
Write-Host ""

# Prompt for MySQL password
$password = Read-Host "Enter MySQL root password" -AsSecureString
$BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($password)
$plainPassword = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)

Write-Host ""
Write-Host "🔄 Loading seed data into database '$dbName'..." -ForegroundColor Yellow
Write-Host ""

try {
    # Load the SQL file
    Get-Content $sqlFile | mysql -u root -p$plainPassword $dbName 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "✅ Seed data loaded successfully!" -ForegroundColor Green
        Write-Host ""
        
        # Verify data
        Write-Host "📊 Verifying data..." -ForegroundColor Yellow
        $verifyQuery = @"
SELECT 
    (SELECT COUNT(*) FROM students) as students,
    (SELECT COUNT(*) FROM parents) as parents,
    (SELECT COUNT(*) FROM teachers) as teachers,
    (SELECT COUNT(*) FROM agents) as agents,
    (SELECT COUNT(*) FROM audit_logs) as audit_logs;
"@
        
        $result = $verifyQuery | mysql -u root -p$plainPassword $dbName -s 2>&1
        
        Write-Host ""
        Write-Host "✨ Data loaded:" -ForegroundColor Cyan
        Write-Host $result
        Write-Host ""
        Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Green
        Write-Host "║              ✅ SUCCESS! Database is ready!               ║" -ForegroundColor Green
        Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Green
        Write-Host ""
        Write-Host "🚀 Next step: Start the backend with 'mvn spring-boot:run'" -ForegroundColor Yellow
        Write-Host ""
    }
    else {
        Write-Host "❌ Error loading seed data. Exit code: $LASTEXITCODE" -ForegroundColor Red
    }
}
catch {
    Write-Host ""
    Write-Host "❌ Error: $_" -ForegroundColor Red
    Write-Host ""
    Write-Host "💡 Alternative method:" -ForegroundColor Yellow
    Write-Host "   1. Open MySQL: mysql -u root -p" -ForegroundColor White
    Write-Host "   2. Run: USE edumanager_db;" -ForegroundColor White
    Write-Host "   3. Run: SOURCE $PWD\$sqlFile;" -ForegroundColor White
}
