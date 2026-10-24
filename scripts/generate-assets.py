from __future__ import annotations

import os
import tempfile
import urllib.request
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont, ImageOps

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "VVStreams.webp"
ASSETS = ROOT / "src" / "assets"
PUBLIC = ROOT / "public"
FONT_DIR = Path(os.environ.get("ASSETS_FONT_DIR", Path(tempfile.gettempdir()) / "vvstreams-assets"))
FONT_DIR.mkdir(parents=True, exist_ok=True)
ASSETS.mkdir(parents=True, exist_ok=True)
PUBLIC.mkdir(parents=True, exist_ok=True)
(PUBLIC / "og").mkdir(parents=True, exist_ok=True)

FONT_URLS = {
    "BarlowCondensed-Bold.ttf": "https://raw.githubusercontent.com/google/fonts/main/ofl/barlowcondensed/BarlowCondensed-Bold.ttf",
    "BarlowCondensed-SemiBold.ttf": "https://raw.githubusercontent.com/google/fonts/main/ofl/barlowcondensed/BarlowCondensed-SemiBold.ttf",
}


def ensure_fonts() -> None:
    for name, url in FONT_URLS.items():
        path = FONT_DIR / name
        if not path.exists():
            print(f"downloading {name}")
            urllib.request.urlretrieve(url, path)


def black_to_alpha(image: Image.Image) -> Image.Image:
    """Key out the logo's black background while preserving the red glow."""
    image = image.convert("RGB")
    red, green, blue = image.split()
    alpha = Image.new("L", image.size)
    alpha.putdata([max(px) for px in zip(red.getdata(), green.getdata(), blue.getdata())])
    result = image.convert("RGBA")
    result.putalpha(alpha)
    return result


def square_logo(logo: Image.Image, size: int, padding_ratio: float = 0.07) -> Image.Image:
    bbox = logo.getbbox()
    if bbox:
        logo = logo.crop(bbox)
    side = int(max(logo.size) * (1 + padding_ratio * 2))
    canvas = Image.new("RGBA", (side, side), (0, 0, 0, 0))
    canvas.alpha_composite(logo, ((side - logo.width) // 2, (side - logo.height) // 2))
    return canvas.resize((size, size), Image.Resampling.LANCZOS)


def rounded_icon(logo: Image.Image, size: int) -> Image.Image:
    scale = 4
    canvas = Image.new("RGBA", (size * scale, size * scale), (0, 0, 0, 0))
    draw = ImageDraw.Draw(canvas)
    radius = int(size * scale * 0.22)
    draw.rounded_rectangle(
        (0, 0, size * scale - 1, size * scale - 1),
        radius=radius,
        fill=(11, 11, 12, 255),
    )
    inner = square_logo(logo, int(size * scale * 0.78), padding_ratio=0.02)
    offset = (size * scale - inner.width) // 2
    canvas.alpha_composite(inner, (offset, offset))
    return canvas.resize((size, size), Image.Resampling.LANCZOS)


def generate_og(logo: Image.Image) -> None:
    width, height = 1200, 630
    canvas = Image.new("RGB", (width, height), (11, 11, 12))
    draw = ImageDraw.Draw(canvas)

    # Subtle printed grid.
    for x in range(0, width, 60):
        draw.line((x, 0, x, height), fill=(20, 20, 21), width=1)
    for y in range(0, height, 60):
        draw.line((0, y, width, y), fill=(20, 20, 21), width=1)

    # Red glow behind the mark.
    glow = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    gdraw = ImageDraw.Draw(glow)
    for radius in range(280, 20, -12):
        alpha = int(10 * (1 - radius / 300))
        gdraw.ellipse((250 - radius, 315 - radius, 250 + radius, 315 + radius), fill=(225, 25, 34, alpha))
    canvas = Image.alpha_composite(canvas.convert("RGBA"), glow).convert("RGB")
    draw = ImageDraw.Draw(canvas)

    # Left mark.
    mark = ImageOps.contain(logo, (280, 280), Image.Resampling.LANCZOS)
    canvas.paste(mark, (70 + (280 - mark.width) // 2, 205 + (280 - mark.height) // 2), mark)

    bold = ImageFont.truetype(FONT_DIR / "BarlowCondensed-Bold.ttf", 108)
    semibold = ImageFont.truetype(FONT_DIR / "BarlowCondensed-SemiBold.ttf", 40)
    small = ImageFont.truetype(FONT_DIR / "BarlowCondensed-SemiBold.ttf", 28)

    draw.text((400, 120), "ANDROID MOBILE & TV", font=small, fill=(201, 194, 180))
    draw.text((398, 164), "VVStreams", font=bold, fill=(244, 240, 231))
    draw.text((398, 262), "Download", font=bold, fill=(225, 25, 34))

    draw.rectangle((400, 398, 1130, 401), fill=(225, 25, 34))
    draw.text((400, 426), "APK 3.3   ·   4.76 MB   ·   ANDROID 7.0+", font=semibold, fill=(201, 194, 180))
    draw.text((400, 500), "vvstreams.site", font=semibold, fill=(244, 240, 231))

    # Corner ticks.
    for x, y, sx, sy in ((48, 48, 1, 1), (1152, 48, -1, 1), (48, 582, 1, -1), (1152, 582, -1, -1)):
        draw.line((x, y, x + sx * 34, y), fill=(225, 25, 34), width=2)
        draw.line((x, y, x, y + sy * 34), fill=(225, 25, 34), width=2)

    canvas.save(PUBLIC / "og" / "vvstreams-app.jpg", "JPEG", quality=88, optimize=True, progressive=True)


def main() -> None:
    ensure_fonts()
    logo = black_to_alpha(Image.open(SRC))
    bbox = logo.getbbox()
    if bbox:
        logo = logo.crop(bbox)

    square_logo(logo, 900).save(ASSETS / "vvstreams-logo.webp", "WEBP", quality=90, method=6)
    square_logo(logo, 640).save(ASSETS / "vvstreams-logo-640.webp", "WEBP", quality=90, method=6)

    sizes = {
        "favicon-32.png": 32,
        "apple-touch-icon.png": 180,
        "icon-192.png": 192,
        "icon-512.png": 512,
    }
    icons = {}
    for name, size in sizes.items():
        icon = rounded_icon(logo, size)
        icon.save(PUBLIC / name, "PNG", optimize=True)
        icons[size] = icon

    icons[32].save(PUBLIC / "favicon.ico", sizes=[(16, 16), (32, 32), (48, 48)])

    generate_og(logo)

    print("generated:")
    for path in [
        ASSETS / "vvstreams-logo.webp",
        ASSETS / "vvstreams-logo-640.webp",
        PUBLIC / "favicon.ico",
        PUBLIC / "favicon-32.png",
        PUBLIC / "apple-touch-icon.png",
        PUBLIC / "icon-192.png",
        PUBLIC / "icon-512.png",
        PUBLIC / "og" / "vvstreams-app.jpg",
    ]:
        print(f"  {path.relative_to(ROOT)}  {path.stat().st_size:,} bytes")


if __name__ == "__main__":
    main()
