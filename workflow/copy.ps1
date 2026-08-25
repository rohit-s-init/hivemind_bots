npm run build

$source = ".\dist"
$destination = "..\backend\public"

New-Item -ItemType Directory -Path $destination -Force | Out-Null
Copy-Item -Path "$source\*" -Destination $destination -Recurse -Force

echo "done building and copying"