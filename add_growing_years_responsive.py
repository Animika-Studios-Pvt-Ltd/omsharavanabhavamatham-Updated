"""Add growing-years-page to birth/education responsive rules."""
from pathlib import Path

path = Path(__file__).resolve().parent / "birth.css"
text = path.read_text(encoding="utf-8")

text = text.replace(
    ".story-page:not(.birth-page):not(.education-page) .birth-article__grid",
    ".story-page:not(.birth-page):not(.education-page):not(.growing-years-page) .birth-article__grid",
)
text = text.replace(
    ".story-page:not(.birth-page):not(.education-page) .birth-article__media img",
    ".story-page:not(.birth-page):not(.education-page):not(.growing-years-page) .birth-article__media img",
)

text = text.replace(
    """.story-page.birth-page .birth-article__media img,
.story-page.education-page .birth-article__media img,
.story-page.mission-page .birth-article__media img""",
    """.story-page.birth-page .birth-article__media img,
.story-page.education-page .birth-article__media img,
.story-page.growing-years-page .birth-article__media img,
.story-page.mission-page .birth-article__media img""",
)

marker = "/* ── Babaji's Birth & Education"
idx = text.index(marker)
before, responsive = text[:idx], text[idx:]

out = []
for line in responsive.splitlines():
    out.append(line)
    if ".story-page.education-page" in line and ".story-page.growing-years-page" not in line:
        gy = line.replace(".story-page.education-page", ".story-page.growing-years-page")
        if gy != line:
            out.append(gy)

responsive = "\n".join(out)
responsive = responsive.replace(
    "/* ── Babaji's Birth & Education — tablet & mobile (desktop locked at 992px+) ── */",
    "/* ── Babaji's Birth, Education & Growing Years — tablet & mobile (desktop locked at 992px+) ── */",
)

path.write_text(before + responsive, encoding="utf-8")
print("Updated birth.css for growing-years-page")
