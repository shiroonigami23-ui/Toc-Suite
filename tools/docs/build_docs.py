"""Builds docs/*.md into styled PDFs (pandoc → HTML → Chromium print). Run: python3 tools/docs/build_docs.py [name ...]
Each book is docs/<dir>/<NAME>.md with a YAML header (title, subtitle, author, date, cover)."""
import subprocess, sys, pathlib, re, tempfile
from playwright.sync_api import sync_playwright

ROOT = pathlib.Path(__file__).resolve().parents[2]
CSS = (ROOT / 'tools' / 'docs' / 'book.css').read_text()
BOOKS = {
    'journey': ROOT / 'docs' / 'journey' / 'JOURNEY.md',
    'study-guide': ROOT / 'docs' / 'study-guide' / 'STUDY-GUIDE.md',
    'technical-guide': ROOT / 'docs' / 'technical-guide' / 'TECHNICAL-GUIDE.md',
}

def callouts(html):
    # ::: {.callout .try title="Try it"} … ::: (pandoc fenced divs) → add a title line
    return re.sub(r'<div class="callout([^"]*)" data-title="([^"]+)">', lambda m: f'<div class="callout{m.group(1)}"><div class="callout-title">{m.group(2)}</div>', html)

def assemble(md):
    # A book may be written as docs/<dir>/src/NN-*.md; join them into the single published .md.
    src = md.parent / 'src'
    if src.is_dir():
        parts = sorted(src.glob('*.md'))
        md.write_text('\n\n'.join(p.read_text().strip() for p in parts) + '\n')

def build(name, md):
    assemble(md)
    html = subprocess.check_output(['pandoc', str(md), '--from', 'markdown+fenced_divs+pipe_tables+smart+tex_math_dollars', '--to', 'html5', '--mathml', '--standalone', '--toc', '--toc-depth=2',
                                    '--resource-path', str(md.parent), '--metadata', 'pagetitle=' + name, '--template', str(ROOT / 'tools' / 'docs' / 'template.html')], text=True)
    html = callouts(html.replace('/*CSS*/', CSS))
    with tempfile.NamedTemporaryFile('w', suffix='.html', dir=md.parent, delete=False) as f:
        f.write(html); tmp = pathlib.Path(f.name)
    pdf = md.with_suffix('.pdf')
    with sync_playwright() as p:
        b = p.chromium.launch(); pg = b.new_page()
        pg.goto(tmp.as_uri()); pg.wait_for_load_state('networkidle')
        title = pg.evaluate("() => document.querySelector('meta[name=book-title]')?.content || document.title")
        pg.pdf(path=str(pdf), format='A4', print_background=True, display_header_footer=True,
               header_template='<div></div>',
               footer_template=f'<div style="font-family:Inter,sans-serif;font-size:7.5pt;color:#94a3b8;width:100%;padding:0 20mm;display:flex;justify-content:space-between;"><span>{title}</span><span class="pageNumber"></span></div>',
               margin={'top': '20mm', 'bottom': '20mm', 'left': '20mm', 'right': '20mm'})
        b.close()
    tmp.unlink()
    pages = int(subprocess.check_output(['python3', '-c', f'import pypdf;print(len(pypdf.PdfReader("{pdf}").pages))'], text=True))
    print(f'{name}: {pdf.relative_to(ROOT)} — {pages} pages')

for n in (sys.argv[1:] or BOOKS):
    if BOOKS[n].exists() or (BOOKS[n].parent / 'src').is_dir(): build(n, BOOKS[n])
