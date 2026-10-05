"""Render frames [a,b) with headless Chromium, piping JPEGs straight into x264. usage: render_seg.py OUT.mp4 START END"""
import sys, os, subprocess
from playwright.sync_api import sync_playwright
H = os.path.dirname(os.path.abspath(__file__)); OUT, a, b = sys.argv[1], int(sys.argv[2]), int(sys.argv[3])
ff = subprocess.Popen(["ffmpeg", "-v", "error", "-y", "-f", "image2pipe", "-framerate", "30", "-c:v", "mjpeg", "-i", "-",
                       "-c:v", "libx264", "-preset", "medium", "-crf", os.environ.get("CRF", "20"), "-x264-params", "aq-mode=3:keyint=60:min-keyint=30",
                       "-pix_fmt", "yuv420p", "-r", "30", "-threads", "2", OUT], stdin=subprocess.PIPE)
with sync_playwright() as p:
    br = p.chromium.launch(executable_path="/opt/pw-browsers/chromium", args=["--force-device-scale-factor=1", "--hide-scrollbars"])
    pg = br.new_page(viewport={"width": 1080, "height": 1920})
    pg.on("pageerror", lambda e: print("PAGEERROR", e, flush=True))
    pg.goto("file://" + H + "/../src/index.html"); pg.wait_for_function("window.ready===true", timeout=60000)
    pg.evaluate("document.fonts.ready"); pg.wait_for_timeout(1000)
    for f in range(a, b):
        pg.evaluate(f"window.render({f}/30)")
        ff.stdin.write(pg.screenshot(type="jpeg", quality=95))
        if (f - a) % 300 == 0: print(os.path.basename(OUT), f, "/", b, flush=True)
    br.close()
ff.stdin.close(); ff.wait(); print("done", OUT, flush=True)
