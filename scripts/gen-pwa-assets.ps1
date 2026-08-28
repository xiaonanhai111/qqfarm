Add-Type -AssemblyName System.Drawing

$ErrorActionPreference = 'Stop'

$root = 'd:\trae_work\6a8fddcec3acd3b019788959\qq-farm-app'
$iconsDir = Join-Path $root 'public\icons'
$shotsDir = Join-Path $root 'public\screenshots'
New-Item -ItemType Directory -Force -Path $iconsDir | Out-Null
New-Item -ItemType Directory -Force -Path $shotsDir | Out-Null

function New-Icon {
    param(
        [string]$Path,
        [int]$Size,
        [double]$SafeZone = 0.0
    )
    $bmp = New-Object System.Drawing.Bitmap($Size, $Size)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit

    $bg = [System.Drawing.ColorTranslator]::FromHtml('#5BA84A')
    $g.Clear($bg)

    $pad = [int]($Size * $SafeZone)
    $inner = $Size - ($pad * 2)

    $cream = [System.Drawing.ColorTranslator]::FromHtml('#F6F5EC')
    $creamBrush = New-Object System.Drawing.SolidBrush($cream)
    $g.FillEllipse($creamBrush, $pad, $pad, $inner, $inner)

    $dark = [System.Drawing.ColorTranslator]::FromHtml('#3E8E37')
    $darkBrush = New-Object System.Drawing.SolidBrush($dark)
    $leafPad = [int]($Size * 0.22) + $pad
    $leafSize = $Size - ($leafPad * 2)
    $g.FillEllipse($darkBrush, $leafPad, $leafPad, $leafSize, $leafSize)

    $font = New-Object System.Drawing.Font('Arial', [float]($Size * 0.30), [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
    $textBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
    $fmt = New-Object System.Drawing.StringFormat
    $fmt.Alignment = [System.Drawing.StringAlignment]::Center
    $fmt.LineAlignment = [System.Drawing.StringAlignment]::Center
    $rect = New-Object System.Drawing.RectangleF(0, 0, [float]$Size, [float]$Size)
    $g.DrawString('QQ', $font, $textBrush, $rect, $fmt)

    $bmp.Save($Path, [System.Drawing.Imaging.ImageFormat]::Png)
    $g.Dispose()
    $bmp.Dispose()
    Write-Host "OK: $Path"
}

function New-Screenshot {
    param(
        [string]$Path,
        [int]$Width,
        [int]$Height,
        [string]$Label
    )
    $bmp = New-Object System.Drawing.Bitmap($Width, $Height)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit

    $rectFull = New-Object System.Drawing.Rectangle(0, 0, $Width, $Height)
    $c1 = [System.Drawing.ColorTranslator]::FromHtml('#A7D28C')
    $c2 = [System.Drawing.ColorTranslator]::FromHtml('#5BA84A')
    $lg = New-Object System.Drawing.Drawing2D.LinearGradientBrush($rectFull, $c1, $c2, [System.Drawing.Drawing2D.LinearGradientMode]::Vertical)
    $g.FillRectangle($lg, $rectFull)

    $topBrush = New-Object System.Drawing.SolidBrush([System.Drawing.ColorTranslator]::FromHtml('#3E8E37'))
    $g.FillRectangle($topBrush, 0, 0, $Width, [int]($Height * 0.08))

    $fontTop = New-Object System.Drawing.Font('Segoe UI', [float]([Math]::Max(18, $Width * 0.018)), [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
    $whiteBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
    $g.DrawString('QQ Farm', $fontTop, $whiteBrush, [float]($Width * 0.03), [float]($Height * 0.025))

    $cardX = [int]($Width * 0.06)
    $cardY = [int]($Height * 0.16)
    $cardW = $Width - ($cardX * 2)
    $cardH = [int]($Height * 0.55)
    $cardBrush = New-Object System.Drawing.SolidBrush([System.Drawing.ColorTranslator]::FromHtml('#F6F5EC'))
    $g.FillRectangle($cardBrush, $cardX, $cardY, $cardW, $cardH)

    $cols = 4
    $rows = 3
    $gap = [int]([Math]::Max(8, $Width * 0.01))
    $tileW = [int](($cardW - ($gap * ($cols + 1))) / $cols)
    $tileH = [int](($cardH - ($gap * ($rows + 1))) / $rows)
    $soil = [System.Drawing.ColorTranslator]::FromHtml('#8B5A2B')
    $sprout = [System.Drawing.ColorTranslator]::FromHtml('#5BA84A')
    $ripe = [System.Drawing.ColorTranslator]::FromHtml('#E1A500')
    $tileColors = @($soil, $sprout, $ripe, $sprout, $ripe, $soil, $sprout, $ripe, $soil, $ripe, $sprout, $soil)
    for ($r = 0; $r -lt $rows; $r++) {
        for ($c = 0; $c -lt $cols; $c++) {
            $x = $cardX + $gap + $c * ($tileW + $gap)
            $y = $cardY + $gap + $r * ($tileH + $gap)
            $idx = ($r * $cols + $c) % $tileColors.Length
            $tb = New-Object System.Drawing.SolidBrush($tileColors[$idx])
            $g.FillRectangle($tb, $x, $y, $tileW, $tileH)
            $tb.Dispose()
        }
    }

    $barH = [int]($Height * 0.10)
    $barY = $Height - $barH
    $barBrush = New-Object System.Drawing.SolidBrush([System.Drawing.ColorTranslator]::FromHtml('#FFFFFF'))
    $g.FillRectangle($barBrush, 0, $barY, $Width, $barH)
    $tabs = @('Farm', 'Warehouse', 'Shop', 'Friends', 'Me')
    $fontTab = New-Object System.Drawing.Font('Segoe UI', [float]([Math]::Max(14, $Width * 0.012)), [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
    $tabBrush = New-Object System.Drawing.SolidBrush([System.Drawing.ColorTranslator]::FromHtml('#3E8E37'))
    $tabW = [double]$Width / $tabs.Length
    $fmt = New-Object System.Drawing.StringFormat
    $fmt.Alignment = [System.Drawing.StringAlignment]::Center
    $fmt.LineAlignment = [System.Drawing.StringAlignment]::Center
    for ($i = 0; $i -lt $tabs.Length; $i++) {
        $rectTab = New-Object System.Drawing.RectangleF([float]($i * $tabW), [float]$barY, [float]$tabW, [float]$barH)
        $g.DrawString($tabs[$i], $fontTab, $tabBrush, $rectTab, $fmt)
    }

    $fontLabel = New-Object System.Drawing.Font('Segoe UI', [float]([Math]::Max(14, $Width * 0.012)), [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
    $labelBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(220, 255, 255, 255))
    $g.DrawString($Label, $fontLabel, $labelBrush, [float]($Width * 0.03), [float]($Height * 0.09))

    $bmp.Save($Path, [System.Drawing.Imaging.ImageFormat]::Png)
    $g.Dispose()
    $bmp.Dispose()
    Write-Host "OK: $Path"
}

New-Icon -Path (Join-Path $iconsDir 'icon-192.png') -Size 192 -SafeZone 0.0
New-Icon -Path (Join-Path $iconsDir 'icon-512.png') -Size 512 -SafeZone 0.0
New-Icon -Path (Join-Path $iconsDir 'icon-512-maskable.png') -Size 512 -SafeZone 0.12

New-Screenshot -Path (Join-Path $shotsDir 'desktop.png') -Width 1280 -Height 800 -Label 'Desktop preview 1280x800'
New-Screenshot -Path (Join-Path $shotsDir 'mobile.png') -Width 720 -Height 1280 -Label 'Mobile preview 720x1280'

Write-Host 'DONE'
