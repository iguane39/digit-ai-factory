"""Oracle de format A4 : la page tient-elle sur UNE feuille A4, à l'écran et à l'impression,
quelles que soient les marges du navigateur ? Sort en code 1 si un cas échoue."""
import sys, pathlib
from playwright.sync_api import sync_playwright
import pymupdf
html = pathlib.Path(sys.argv[1]).resolve(); out = pathlib.Path(sys.argv[2]); MM = 96/25.4
NAT = """()=>{const z=document.querySelector('.zone');const f=z.querySelector('footer');const h0=z.style.height;
 z.style.height='auto';f.style.marginTop='0';const n=z.getBoundingClientRect().height;z.style.height=h0;f.style.marginTop='';
 const c=z.getBoundingClientRect().height;return {n,c}}"""
ok = True; rows = []
with sync_playwright() as p:
    b = p.chromium.launch()
    for w in (3840, 1920, 1440, 1024):
        pg = b.new_page(viewport={"width": w, "height": 1080}); pg.goto(html.as_uri()); pg.wait_for_timeout(1200)
        r = pg.evaluate(NAT); good = r["n"] <= r["c"] + 1; ok &= good
        rows.append((f"écran {w}px", f"contenu {r['n']/MM:.1f} mm / zone {r['c']/MM:.0f} mm", good))
    pg = b.new_page(viewport={"width": round((210-2*12.7)*MM), "height": 1123}); pg.goto(html.as_uri()); pg.wait_for_timeout(1200)
    pg.emulate_media(media="print"); r = pg.evaluate(NAT); good = r["n"] <= r["c"] + 1; ok &= good
    rows.append(("média print", f"contenu {r['n']/MM:.1f} mm / zone {r['c']/MM:.0f} mm", good))
    pg.emulate_media(media="print")  # un navigateur imprime en média print
    cas = {"PDF A4, marges CSS (12,7 mm)": dict(prefer_css_page_size=True),
           "PDF A4, marges 10 mm + en-têtes navigateur": dict(format="A4", margin={k: "10mm" for k in ("top","bottom","left","right")}, display_header_footer=True),
           "PDF A4, marges par défaut Chrome (0,4 in)": dict(format="A4", margin={k: "0.4in" for k in ("top","bottom","left","right")}),
           "PDF A4, marges 15 mm": dict(format="A4", margin={k: "15mm" for k in ("top","bottom","left","right")}),
           "PDF Letter, marges 0,4 in": dict(format="Letter", margin={k: "0.4in" for k in ("top","bottom","left","right")})}
    for i, (k, opt) in enumerate(cas.items()):
        f = out / f"a4-cas{i}.pdf"; pg.pdf(path=str(f), print_background=True, **opt)
        n = pymupdf.open(f).page_count; good = n == 1; ok &= good; rows.append((k, f"{n} page(s)", good))
    b.close()
for k, v, g in rows: print(f"{'PASS' if g else 'FAIL'}  {k:44s} {v}")
print("VERDICT", "PASS" if ok else "FAIL"); sys.exit(0 if ok else 1)
