Add-Type -AssemblyName System.Drawing

$bmp = New-Object System.Drawing.Bitmap(256, 256)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic

# Background gradient
$bgBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
  (New-Object System.Drawing.Point(0, 0)),
  (New-Object System.Drawing.Point(256, 256)),
  [System.Drawing.Color]::FromArgb(13, 17, 23),
  [System.Drawing.Color]::FromArgb(26, 16, 64)
)

# Rounded rect path
$path = New-Object System.Drawing.Drawing2D.GraphicsPath
$r = 56
$rect = New-Object System.Drawing.Rectangle(0, 0, 256, 256)
$path.AddArc($rect.X, $rect.Y, $r, $r, 180, 90)
$path.AddArc($rect.Right - $r, $rect.Y, $r, $r, 270, 90)
$path.AddArc($rect.Right - $r, $rect.Bottom - $r, $r, $r, 0, 90)
$path.AddArc($rect.X, $rect.Bottom - $r, $r, $r, 90, 90)
$path.CloseFigure()
$g.FillPath($bgBrush, $path)

# Orbit circles
$glowPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(64, 108, 166, 244), 3)
$g.DrawEllipse($glowPen, 48, 48, 160, 160)

$glowPen2 = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(38, 108, 166, 244), 2)
$g.DrawEllipse($glowPen2, 72, 72, 112, 112)

# Brackets
$bracketPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 108, 166, 244), 7)
$bracketPen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
$bracketPen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
$g.DrawLine($bracketPen, 88, 80, 56, 128)
$g.DrawLine($bracketPen, 88, 176, 56, 128)
$g.DrawLine($bracketPen, 168, 80, 200, 128)
$g.DrawLine($bracketPen, 168, 176, 200, 128)

# Center slash
$slashPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(153, 108, 166, 244), 5)
$slashPen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
$slashPen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
$g.DrawLine($slashPen, 144, 72, 112, 184)

# Stars
$starBrush1 = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(204, 167, 139, 250))
$g.FillEllipse($starBrush1, 192, 64, 6, 6)

$starBrush2 = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(153, 108, 166, 244))
$g.FillEllipse($starBrush2, 64, 192, 4, 4)

$starBrush3 = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(128, 167, 139, 250))
$g.FillEllipse($starBrush3, 200, 184, 3, 3)

# INSIDER text
$insiderFont = New-Object System.Drawing.Font("Segoe UI", 9, [System.Drawing.FontStyle]::Bold)
$insiderBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 245, 158, 11))
$insiderFormat = New-Object System.Drawing.StringFormat
$insiderFormat.Alignment = [System.Drawing.StringAlignment]::Center
$insiderFormat.LineAlignment = [System.Drawing.StringAlignment]::Center
$insiderRect = New-Object System.Drawing.RectangleF(0, 220, 256, 24)
$g.DrawString("INSIDER", $insiderFont, $insiderBrush, $insiderRect, $insiderFormat)

$outPath = "c:\Users\Utilisateur\Documents\Project\IDE\Void-SuperCode\icon.png"
$bmp.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)
$g.Dispose()
$bmp.Dispose()
Write-Output "icon.png created at $outPath"
