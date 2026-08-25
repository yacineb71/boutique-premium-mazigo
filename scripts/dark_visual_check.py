import base64
import json
import os
import socket
import subprocess
import time
import urllib.request
import uuid

PREVIEW = os.environ.get("MAZIGHO_PREVIEW", "https://3000-iz4bs98nzqthja3hlkagq-c80963d5.us4.manus.computer")
PORT = 9223
OUT_DIR = "/tmp/mazigho-dark-check"
os.makedirs(OUT_DIR, exist_ok=True)


def ws_frame(payload: str) -> bytes:
    data = payload.encode("utf-8")
    mask = os.urandom(4)
    length = len(data)
    if length < 126:
        header = bytes([0x81, 0x80 | length])
    elif length < 65536:
        header = bytes([0x81, 0x80 | 126]) + length.to_bytes(2, "big")
    else:
        header = bytes([0x81, 0x80 | 127]) + length.to_bytes(8, "big")
    masked = bytes(byte ^ mask[index % 4] for index, byte in enumerate(data))
    return header + mask + masked


def read_frame(sock: socket.socket) -> tuple[int, bytes]:
    first = sock.recv(2)
    if not first:
        raise RuntimeError("WebSocket fermé")
    opcode = first[0] & 0x0F
    length = first[1] & 0x7F
    if length == 126:
        length = int.from_bytes(sock.recv(2), "big")
    elif length == 127:
        length = int.from_bytes(sock.recv(8), "big")
    masked = first[1] & 0x80
    mask = sock.recv(4) if masked else b""
    chunks = []
    remaining = length
    while remaining:
        chunk = sock.recv(remaining)
        chunks.append(chunk)
        remaining -= len(chunk)
    data = b"".join(chunks)
    if masked:
        data = bytes(byte ^ mask[index % 4] for index, byte in enumerate(data))
    return opcode, data


def connect(ws_url: str) -> socket.socket:
    parsed = ws_url.replace("ws://", "", 1)
    host_port, path = parsed.split("/", 1)
    host, port = host_port.split(":")
    sock = socket.create_connection((host, int(port)), timeout=10)
    key = base64.b64encode(os.urandom(16)).decode()
    request = (
        f"GET /{path} HTTP/1.1\r\nHost: {host_port}\r\nUpgrade: websocket\r\n"
        f"Connection: Upgrade\r\nSec-WebSocket-Key: {key}\r\nSec-WebSocket-Version: 13\r\n\r\n"
    )
    sock.sendall(request.encode())
    response = b""
    while b"\r\n\r\n" not in response:
        response += sock.recv(4096)
    if b" 101 " not in response.split(b"\r\n", 1)[0]:
        raise RuntimeError(f"Handshake CDP échoué: {response[:120]!r}")
    return sock


class CDP:
    def __init__(self, sock: socket.socket):
        self.sock = sock
        self.next_id = 0

    def call(self, method: str, params: dict | None = None) -> dict:
        self.next_id += 1
        message_id = self.next_id
        payload = json.dumps({"id": message_id, "method": method, "params": params or {}})
        self.sock.sendall(ws_frame(payload))
        while True:
            opcode, data = read_frame(self.sock)
            if opcode == 8:
                raise RuntimeError("CDP fermé")
            if opcode != 1:
                continue
            message = json.loads(data.decode("utf-8"))
            if message.get("id") == message_id:
                if "error" in message:
                    raise RuntimeError(message["error"])
                return message

    def evaluate(self, expression: str) -> object:
        result = self.call("Runtime.evaluate", {"expression": expression, "returnByValue": True})
        return result.get("result", {}).get("result", {}).get("value")

    def screenshot(self, path: str) -> None:
        result = self.call("Page.captureScreenshot", {"format": "png", "fromSurface": True})
        with open(path, "wb") as output:
            output.write(base64.b64decode(result["result"]["data"]))


def wait_for_preview() -> None:
    for _ in range(40):
        try:
            with urllib.request.urlopen(f"http://127.0.0.1:{PORT}/json/list", timeout=1):
                return
        except Exception:
            time.sleep(0.25)
    raise RuntimeError("Chromium CDP indisponible")


profile = "/tmp/mazigho-chrome-profile"
process = subprocess.Popen([
    "chromium", "--headless=new", "--no-sandbox", "--disable-gpu",
    "--ignore-certificate-errors", f"--remote-debugging-port={PORT}",
    f"--user-data-dir={profile}", "about:blank",
], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

try:
    wait_for_preview()
    pages = json.load(urllib.request.urlopen(f"http://127.0.0.1:{PORT}/json/list"))
    page = next(item for item in pages if item.get("type") == "page")
    cdp = CDP(connect(page["webSocketDebuggerUrl"]))
    cdp.call("Page.enable")
    cdp.call("Runtime.enable")
    results = []
    for route in ["/", "/shop", "/product/1", "/cart", "/checkout", "/admin"]:
        cdp.call("Page.navigate", {"url": PREVIEW + route})
        time.sleep(1.0)
        cdp.evaluate("localStorage.setItem('theme', 'dark'); location.reload(); true")
        time.sleep(1.0)
        dark = cdp.evaluate("document.documentElement.classList.contains('dark')")
        background = cdp.evaluate("getComputedStyle(document.body).backgroundColor")
        slug = route.strip("/").replace("/", "-") or "home"
        screenshot_path = os.path.join(OUT_DIR, f"{slug}.png")
        cdp.screenshot(screenshot_path)
        results.append({"route": route, "darkClass": dark, "bodyBackground": background, "screenshot": screenshot_path})

    cdp.call("Emulation.setDeviceMetricsOverride", {"width": 390, "height": 844, "deviceScaleFactor": 1, "mobile": True})
    cdp.call("Page.navigate", {"url": PREVIEW + "/"})
    time.sleep(1.0)
    cdp.evaluate("localStorage.setItem('theme', 'dark'); location.reload(); true")
    time.sleep(1.0)
    cdp.evaluate("document.querySelector('button[aria-label=\\\"Ouvrir le menu\\\"]')?.click(); true")
    time.sleep(0.3)
    mobile_theme_visible = cdp.evaluate("Array.from(document.querySelectorAll('button')).some((button) => button.getAttribute('aria-label')?.startsWith('Activer le thème'))")
    mobile_path = os.path.join(OUT_DIR, "mobile-menu-dark.png")
    cdp.screenshot(mobile_path)
    results.append({"route": "/", "viewport": "390x844", "mobileMenuThemeVisible": mobile_theme_visible, "screenshot": mobile_path})
    print(json.dumps(results, ensure_ascii=False, indent=2))
finally:
    process.terminate()
    try:
        process.wait(timeout=5)
    except subprocess.TimeoutExpired:
        process.kill()
