import sys, json, os
from playwright.sync_api import sync_playwright
H = os.path.dirname(os.path.abspath(__file__)); OUT = sys.argv[1]; ts = [float(x) for x in sys.argv[2:]]
os.makedirs(OUT, exist_ok=True)
with sync_playwright() as p:
    b = p.chromium.launch(executable_path="/opt/pw-browsers/chromium", args=["--force-device-scale-factor=1", "--hide-scrollbars"])
    pg = b.new_page(viewport={"width": 1920, "height": 1080})
    pg.on("console", lambda m: print("console:", m.text)); pg.on("pageerror", lambda e: print("PAGEERROR", e))
    pg.goto("file://" + H + "/../src/index.html"); pg.wait_for_function("window.ready===true", timeout=30000)
    pg.evaluate("document.fonts.ready"); pg.wait_for_timeout(800)
    for t in ts:
        pg.evaluate(f"window.render({t})"); pg.wait_for_timeout(120)
        pg.screenshot(path=f"{OUT}/t{t:07.2f}.png")
    b.close()
