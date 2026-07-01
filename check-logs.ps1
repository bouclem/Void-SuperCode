$logDir = Join-Path $env:USERPROFILE ".voidscode\logs"
if (Test-Path $logDir) {
    $files = Get-ChildItem -Path $logDir -File
    foreach ($f in $files) {
        Write-Output ("=== " + $f.Name + " ===")
        Get-Content $f.FullName
    }
} else {
    Write-Output "No logs directory found"
}

$testFolder = "C:\Users\Utilisateur\Documents\Project\IDE\void-supercode-test"
Write-Output "--- Test folder contents ---"
if (Test-Path $testFolder) {
    Get-ChildItem $testFolder -Recurse | ForEach-Object { Write-Output $_.FullName }
} else {
    Write-Output "Test folder does not exist"
}
