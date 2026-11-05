"""Generates app icon, adaptive icon layers, splash, notification icon and favicon.

Logo: an open book in study blue with a graduation cap above it and an amber tick
("passed") on the right page - on white.  Run:  python scripts/make-icons.py
"""
from pathlib import Path
from PIL import Image, ImageDraw

OUT = Path(__file__).resolve().parent.parent / "assets"
BLUE, NAVY, AMBER, LIGHT, WHITE = (29, 78, 216), (11, 31, 92), (245, 158, 11), (191, 211, 254), (255, 255, 255)
SS = 4


def glyph(size, scale=1.0, mono=None):
    big = size * SS
    im = Image.new("RGBA", (big, big), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    s = big * scale
    ox, oy = (big - s) / 2, (big - s) / 2

    def P(x, y):
        return (ox + x * s, oy + y * s)

    def col(c):
        return mono or c

    # open book: two pages meeting at the spine
    d.polygon([P(0.08, 0.50), P(0.48, 0.58), P(0.48, 0.92), P(0.08, 0.84)], fill=col(BLUE))
    d.polygon([P(0.52, 0.58), P(0.92, 0.50), P(0.92, 0.84), P(0.52, 0.92)], fill=col(BLUE))
    if not mono:
        # page lines on the left page, parallel to its top edge
        for i in range(3):
            y = 0.62 + i * 0.075
            d.line([P(0.14, y), P(0.42, y + 0.056)], fill=LIGHT, width=int(s * 0.02))
        # amber tick on the right page
        d.line([P(0.61, 0.73), P(0.69, 0.81), P(0.84, 0.63)], fill=AMBER, width=int(s * 0.05), joint="curve")
    # graduation cap: board (diamond) + crown + tassel
    d.polygon([P(0.50, 0.08), P(0.86, 0.24), P(0.50, 0.40), P(0.14, 0.24)], fill=col(NAVY))
    d.polygon([P(0.30, 0.31), P(0.70, 0.31), P(0.70, 0.43), P(0.50, 0.50), P(0.30, 0.43)], fill=col(NAVY))
    d.line([P(0.80, 0.27), P(0.80, 0.43)], fill=col(AMBER), width=int(s * 0.022))
    r = s * 0.03
    cx, cy = P(0.80, 0.45)
    d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=col(AMBER))
    return im.resize((size, size), Image.LANCZOS)


def on_white(size, scale):
    img = Image.new("RGBA", (size, size), WHITE + (255,))
    img.alpha_composite(glyph(size, scale))
    return img


def main():
    OUT.mkdir(exist_ok=True)
    on_white(1024, 0.78).convert("RGB").save(OUT / "icon.png")
    on_white(48, 0.86).save(OUT / "favicon.png")
    # adaptive foreground (safe zone ~66%); background colour (#FFFFFF) comes from app.json
    glyph(1024, scale=0.58).save(OUT / "android-icon-foreground.png")
    glyph(1024, scale=0.58, mono=WHITE).save(OUT / "android-icon-monochrome.png")
    glyph(600, scale=0.9).save(OUT / "splash-icon.png")
    glyph(96, scale=1.0, mono=WHITE).save(OUT / "notification-icon.png")
    print("icons written to", OUT)


main()
