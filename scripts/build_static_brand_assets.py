"""Convert the CareNest SVG logo to multiple PNG sizes + favicon.ico + palette poster."""
from pathlib import Path
import cairosvg
from PIL import Image, ImageDraw, ImageFont

ROOT = Path("/app")
KIT = ROOT / "brand-kit"
LOGO_DIR = KIT / "logo"
FAV_DIR = KIT / "favicon"
LOGO_DIR.mkdir(parents=True, exist_ok=True)
FAV_DIR.mkdir(parents=True, exist_ok=True)

SVG_ICON = ROOT / "frontend/public/logo.svg"
SVG_WORDMARK = ROOT / "frontend/public/logo-wordmark.svg"

# --- 1. Icon-only logo (rounded royal-blue square with nest + medical cross) ---
for size in (48, 96, 192, 256, 512, 1024, 2048):
    out = LOGO_DIR / f"logo-icon-{size}.png"
    cairosvg.svg2png(url=str(SVG_ICON), write_to=str(out), output_width=size, output_height=size)
    print(f"  ✓ {out}")

# --- 2. Wordmark (icon + "CareNest / HOME HEALTH · INDIA") for headers and email ---
for width in (640, 1200, 2400):
    height = int(width * (200 / 640))
    out = LOGO_DIR / f"logo-wordmark-{width}.png"
    cairosvg.svg2png(url=str(SVG_WORDMARK), write_to=str(out), output_width=width, output_height=height)
    print(f"  ✓ {out}")

# --- 3. Transparent-background icon (already transparent SVG) — but we also produce a
#        version WITHOUT the royal-blue background rectangle, for placement on hero banners ---
transparent_svg = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="1024" height="1024">
  <defs>
    <linearGradient id="tealG" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#20B2AA"/><stop offset="100%" stop-color="#0F766E"/>
    </linearGradient>
    <linearGradient id="royalG" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0D3B66"/><stop offset="100%" stop-color="#0A2E4F"/>
    </linearGradient>
    <linearGradient id="goldG" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#E5C158"/><stop offset="100%" stop-color="#B8892B"/>
    </linearGradient>
  </defs>
  <path d="M 18 70 Q 50 30 82 70" fill="none" stroke="url(#tealG)" stroke-width="7" stroke-linecap="round"/>
  <path d="M 26 74 Q 50 44 74 74" fill="none" stroke="url(#royalG)" stroke-width="5" stroke-linecap="round"/>
  <path d="M 34 78 Q 50 58 66 78" fill="none" stroke="url(#goldG)" stroke-width="4" stroke-linecap="round"/>
  <g transform="translate(50 62)">
    <rect x="-3" y="-11" width="6" height="22" rx="1.5" fill="url(#royalG)"/>
    <rect x="-11" y="-3" width="22" height="6" rx="1.5" fill="url(#royalG)"/>
    <rect x="-2" y="-10" width="4" height="20" rx="1" fill="url(#goldG)"/>
    <rect x="-10" y="-2" width="20" height="4" rx="1" fill="url(#goldG)"/>
  </g>
</svg>"""
(LOGO_DIR / "logo-icon-transparent.svg").write_text(transparent_svg)
for size in (512, 1024, 2048):
    out = LOGO_DIR / f"logo-icon-transparent-{size}.png"
    cairosvg.svg2png(bytestring=transparent_svg.encode(), write_to=str(out), output_width=size, output_height=size)
    print(f"  ✓ {out}")

# --- 4. Favicon (16, 32, 48 → .ico) ---
imgs = []
for size in (16, 32, 48, 64):
    png = FAV_DIR / f"favicon-{size}.png"
    cairosvg.svg2png(url=str(SVG_ICON), write_to=str(png), output_width=size, output_height=size)
    imgs.append(Image.open(png))
ico_path = FAV_DIR / "favicon.ico"
imgs[0].save(ico_path, format="ICO", sizes=[(16,16),(32,32),(48,48),(64,64)])
print(f"  ✓ {ico_path}")

# apple-touch-icon
cairosvg.svg2png(url=str(SVG_ICON), write_to=str(FAV_DIR / "apple-touch-icon.png"),
                 output_width=180, output_height=180)
print(f"  ✓ {FAV_DIR}/apple-touch-icon.png")

# --- 5. Colour palette poster ---
W, H = 1600, 900
palette = [
    ("Royal Blue", "#0D3B66", "Primary · text on gold"),
    ("Deep Teal",  "#0F766E", "Secondary · accents"),
    ("Soft Teal",  "#20B2AA", "Secondary · highlights"),
    ("Gold",       "#D4AF37", "Accent · CTAs, dividers"),
    ("Cream",      "#FAFAFA", "Background · warm neutral"),
    ("Slate",      "#64748B", "Body text · muted"),
]
poster = Image.new("RGB", (W, H), "#FAFAFA")
draw = ImageDraw.Draw(poster)

try:
    font_big = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf", 64)
    font_h = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSerif.ttf", 26)
    font_body = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 15)
    font_hex = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf", 18)
    font_label = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 12)
except Exception:
    font_big = ImageFont.load_default()
    font_h = font_body = font_hex = font_label = font_big

# header
draw.text((80, 60), "CareNest Home Health", fill="#0D3B66", font=font_big)
draw.text((84, 150), "BRAND COLOUR SYSTEM", fill="#64748B", font=font_label)
draw.text((80, 190), "Six-tone palette · WCAG-friendly · print + web ready", fill="#0F766E", font=font_h)

# swatches
cols = 3
sw_w, sw_h = 460, 280
margin_x, margin_y = 80, 320
gap_x, gap_y = 20, 20
for i, (name, hexv, note) in enumerate(palette):
    row, col = i // cols, i % cols
    x = margin_x + col * (sw_w + gap_x)
    y = margin_y + row * (sw_h + gap_y)
    draw.rectangle([x, y, x + sw_w, y + sw_h], fill=hexv, outline="#E2E8F0", width=1)
    # text overlay (choose contrast)
    r, g, b = int(hexv[1:3], 16), int(hexv[3:5], 16), int(hexv[5:7], 16)
    lum = (0.299*r + 0.587*g + 0.114*b) / 255
    text_col = "#0D3B66" if lum > 0.6 else "#FFFFFF"
    draw.text((x + 22, y + 22), name, fill=text_col, font=font_h)
    draw.text((x + 22, y + sw_h - 84), hexv.upper(), fill=text_col, font=font_hex)
    draw.text((x + 22, y + sw_h - 46), note, fill=text_col, font=font_body)

poster.save(KIT / "colour-palette.png", "PNG")
print(f"  ✓ {KIT}/colour-palette.png")

print("\nBrand kit complete.")
