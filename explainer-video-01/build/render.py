"""Render frames [a,b) with a headless Chromium. usage: render.py OUTDIR START END"""
import sys, os
from playwright.sync_api import sync_playwright
H = os.path.dirname(os.path.abspath(__file__)); OUT, a, b = sys.argv[1], int(sys.argv[2]), int(sys.argv[3])
os.makedirs(OUT, exist_ok=True)
with sync_playwright() as p:
    br = p.chromium.launch(executable_path="/opt/pw-browsers/chromium", args=["--force-device-scale-factor=1", "--hide-scrollbars", "--disable-gpu-vsync"])
    pg = br.new_page(viewport={"width": 1920, "height": 1080})
    pg.on("pageerror", lambda e: print("PAGEERROR", e, flush=True))
    pg.goto("file://" + H + "/../src/index.html"); pg.wait_for_function("window.ready===true", timeout=60000)
    pg.evaluate("document.fonts.ready"); pg.wait_for_timeout(1000)
    for f in range(a, b):
        pg.evaluate(f"window.render({f}/30)")
        pg.screenshot(path=f"{OUT}/f{f:05d}.jpg", type="jpeg", quality=94)
        if (f - a) % 300 == 0: print(a, f, flush=True)
    br.close()
