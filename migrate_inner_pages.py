#!/usr/bin/env python3
"""Migrate inner HTML pages to birth-article / birth-seva temple UI."""

from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent

BIRTH_SEVA = """
<div class="outer-container inner-seva birth-seva" aria-label="Serve, support, and experience">
    <div class="container">
        <div class="inner-seva__showcase birth-seva__showcase" role="list">
            <a href="pooja-sevas.html" class="inner-seva__card birth-seva__card" role="listitem" aria-label="Book a Pooja">
                <div class="birth-seva__media-wrap">
                    <img src="static/omsharavanabhavamatham-org/seva-card-pooja.png" class="inner-seva__media"
                        alt="Priest performing aarti at the temple shrine">
                </div>
                <span class="birth-seva__icon" aria-hidden="true"><i class="fa fa-fire"></i></span>
                <span class="inner-seva__label">Book a Pooja</span>
                <span class="birth-seva__desc">Offer prayers and book sacred poojas at the temple.</span>
                <span class="inner-seva__arrow birth-seva__btn">Book now <span aria-hidden="true">&rsaquo;</span></span>
            </a>

            <a href="social-impact.html" class="inner-seva__card birth-seva__card" role="listitem" aria-label="Donate for a Cause">
                <div class="birth-seva__media-wrap">
                    <img src="static/omsharavanabhavamatham-org/seva-card-donate.png" class="inner-seva__media"
                        alt="Serving food to devotees as part of annadanam">
                </div>
                <span class="birth-seva__icon" aria-hidden="true"><i class="fa fa-heart"></i></span>
                <span class="inner-seva__label">Donate for a Cause</span>
                <span class="birth-seva__desc">Support seva and social initiatives with your offering.</span>
                <span class="inner-seva__arrow birth-seva__btn">Donate <span aria-hidden="true">&rsaquo;</span></span>
            </a>

            <a href="devotees-experience.html" class="inner-seva__card birth-seva__card" role="listitem" aria-label="Devotee Experience">
                <div class="birth-seva__media-wrap">
                    <img src="static/omsharavanabhavamatham-org/seva-card-devotion.png" class="inner-seva__media"
                        alt="Devotee in prayer before the illuminated temple gopuram at night">
                </div>
                <span class="birth-seva__icon" aria-hidden="true"><i class="fa fa-users"></i></span>
                <span class="inner-seva__label">Devotee Experience</span>
                <span class="birth-seva__desc">Read heartfelt experiences shared by devotees.</span>
                <span class="inner-seva__arrow birth-seva__btn">Explore <span aria-hidden="true">&rsaquo;</span></span>
            </a>
        </div>
    </div>
</div>"""

DIVIDER = """
                <div class="birth-article__divider" aria-hidden="true">
                    <span class="birth-article__divider-line"></span>
                    <img src="static/omsharavanabhavamatham-org/lotus.png" class="birth-article__divider-lotus" alt="">
                    <span class="birth-article__divider-line"></span>
                </div>"""

TITLE_RULE = """
            <div class="birth-article__title-rule" aria-hidden="true">
                <span class="birth-article__title-line"></span>
                <span class="birth-article__title-gem"></span>
                <span class="birth-article__title-line"></span>
            </div>"""

OLD_INNER_SEVA_RE = re.compile(
    r'<div class="outer-container inner-seva"[^>]*>.*?</div>\s*</div>\s*</div>',
    re.DOTALL,
)

MOTIF_FIX = (
    '<div class="container-fluid"><div class="innermotif">',
    '<div class="container-fluid">\n\n    <div class="innermotif">',
)


def slug_from_file(path: Path) -> str:
    return path.stem.replace("_", "-") + "-page"


def strip_html(html: str) -> str:
    return re.sub(r"\s+", " ", re.sub(r"<[^>]+>", "", html)).strip()


def extract_title(block: str) -> str:
    m = re.search(r'<div class="sidebarleft innerhead[^"]*">\s*<h1>(.*?)</h1>', block, re.DOTALL)
    if not m:
        m = re.search(r"<h1>(.*?)</h1>", block, re.DOTALL)
    return strip_html(m.group(1)) if m else "Page"


def extract_media(block: str) -> str:
    m = re.search(r'<div class="page-content">(.*?)</div>\s*</div>\s*<div class="col-lg-', block, re.DOTALL)
    if not m:
        m = re.search(r'<div class="page-content">(.*?)</div>', block, re.DOTALL)
    if not m:
        return ""
    inner = m.group(1).strip()
    return inner


def extract_sevainner_blocks(block: str) -> list[str]:
    return [
        m.group(1).strip()
        for m in re.finditer(r'<div class="\s*sevainner[^"]*">(.*?)</div>', block, re.DOTALL)
    ]


def clean_paragraphs(html_chunks: list[str]) -> list[str]:
    paras: list[str] = []
    for chunk in html_chunks:
        chunk = re.sub(r'&nbsp;|&#160;', '', chunk)
        for m in re.finditer(r'<p[^>]*>(.*?)</p>', chunk, re.DOTALL):
            p = m.group(0).strip()
            if strip_html(p):
                paras.append(p)
        if not re.search(r'<p', chunk) and strip_html(chunk):
            if '<iframe' in chunk or '<div class="panel' in chunk or '<ul' in chunk:
                paras.append(chunk)
            else:
                paras.append(f"<p>{chunk}</p>")
    return paras


def has_pooja_grid(block: str) -> bool:
    return 'class="pooja-info"' in block


def build_copy_html(paras: list[str]) -> tuple[str, list[str]]:
    if not paras:
        return "", []
    if len(paras) == 1:
        return f"                {paras[0]}", []
    copy = f"                {paras[0]}\n{DIVIDER}\n                {paras[1]}"
    return copy, paras[2:]


def build_more_html(paras: list[str]) -> str:
    if not paras:
        return ""
    lines = "\n".join(f"            {p}" for p in paras)
    return f"""
        <div class="birth-article__more">
{lines}
        </div>"""


def build_cta(block: str, title: str) -> str:
    if re.search(r'pooja-sevas\.html|book.*pooja|donate online', block, re.I):
        return """
        <div class="birth-article__actions">
            <a href="pooja-sevas.html" class="birth-article__cta">Book a Pooja Online</a>
        </div>"""
    return ""


def build_body_content(block: str, title: str, filename: str) -> str:
    if filename == "contact-us.html":
        return build_contact_layout(block, title)
    if filename == "pooja-sevas.html":
        return build_pooja_layout(block, title)
    if filename == "devotees-experience.html":
        return build_devotees_layout(block, title)

    media = extract_media(block)
    sevainners = extract_sevainner_blocks(block)
    intro_chunk = sevainners[0] if sevainners else ""
    more_chunks = sevainners[1:] if len(sevainners) > 1 else []

  # col-lg-12 full-width block often last
    full_match = re.search(
        r'<div class="col-lg-12[^"]*">\s*<div class="\s*sevainner[^"]*">(.*?)</div>',
        block,
        re.DOTALL,
    )
    if full_match:
        more_chunks.append(full_match.group(1))

    intro_paras = clean_paragraphs([intro_chunk])
    more_paras = clean_paragraphs(more_chunks)

    copy_html, overflow = build_copy_html(intro_paras)
    more_paras = overflow + more_paras

    media_html = ""
    if media:
        media_html = f"""
        <div class="birth-article__grid">
            <div class="birth-article__media">
                {media}
            </div>
            <div class="birth-article__copy">
{copy_html}
            </div>
        </div>"""
    elif copy_html:
        media_html = f"""
        <div class="birth-article__more birth-article__more--lead">
{copy_html}
        </div>"""

    extra = build_more_html(more_paras)
    cta = build_cta(block, title)

    if has_pooja_grid(block):
        grid = re.search(r'(<div class="row">\s*(?:<div class="col-lg-3.*?</div>\s*)+)</div>', block, re.DOTALL)
        grid_html = grid.group(1) if grid else ""
        extra = f"""
        <div class="birth-article__more inner-page-grid">
            {grid_html}
        </div>"""

    return f"""
        <header class="birth-article__header">
            <h1 class="birth-article__title">{title}</h1>{TITLE_RULE}
        </header>
{media_html}{extra}{cta}"""


def build_contact_layout(block: str, title: str) -> str:
    row = re.search(r'<div class="row">(.*?)</div>\s*</div>\s*</div>\s*</div>', block, re.DOTALL)
    row_html = row.group(1).strip() if row else ""
    return f"""
        <header class="birth-article__header">
            <h1 class="birth-article__title">{title}</h1>{TITLE_RULE}
        </header>

        <div class="birth-article__grid birth-article__grid--contact">
            {row_html}
        </div>"""


def build_pooja_layout(block: str, title: str) -> str:
    row_start = block.find('<div class="row">')
    if row_start == -1:
        row_html = ""
    else:
        row_inner_start = row_start + len('<div class="row">')
        row_end = block.rfind("</div>", row_inner_start)
        container_end = block.rfind("</div>", 0, row_end)
        row_html = block[row_inner_start:container_end].strip()
    return f"""
        <header class="birth-article__header">
            <h1 class="birth-article__title">{title}</h1>{TITLE_RULE}
        </header>

        <div class="birth-article__more pooja-sevas-grid">
            <div class="row">
{row_html}
            </div>
        </div>"""


def build_devotees_layout(block: str, title: str) -> str:
    content_match = re.search(
        r'<div class="row">(.*)<div class="modal fade devotee-story-modal"',
        block,
        re.DOTALL,
    )
    if not content_match:
        content_match = re.search(r'<div class="row">(.*)</div>\s*</div>\s*</div>\s*</div>', block, re.DOTALL)
    content = content_match.group(1).strip() if content_match else ""
    return f"""
        <header class="birth-article__header">
            <h1 class="birth-article__title">{title}</h1>{TITLE_RULE}
        </header>

        <div class="birth-article__more devotees-experience__list">
            <div class="row">
{content}
            </div>
        </div>"""


def migrate_file(path: Path) -> bool:
    text = path.read_text(encoding="utf-8")
    if "sidebarleft innerhead" not in text and "outer-container inner-page-body birth-article" in text:
        return False
    if "sidebarleft innerhead" not in text:
        return False

    start = text.find('<div class="outer-container inner-page-body">')
    if start == -1:
        start = text.find('<div class="outer-container inner-page-body"')
    if start == -1:
        marker = '<div class="outer-container">'
        pos = text.find(marker)
        if pos != -1 and "sidebarleft innerhead" in text[pos : pos + 800]:
            start = pos
    if start == -1:
        return False

    seva_start = text.find('<div class="outer-container inner-seva"', start)
    footer_start = text.find('<footer class="footer-section"', start)
    if seva_start == -1 and footer_start == -1:
        return False

    old_end = seva_start if seva_start != -1 else footer_start
    old_block = text[start:old_end]

    if seva_start != -1:
        seva_match = OLD_INNER_SEVA_RE.match(text[seva_start:])
        if seva_match:
            tail_start = seva_start + seva_match.end()
        else:
            tail_start = footer_start if footer_start != -1 else seva_start
    else:
        tail_start = footer_start

    tail = text[tail_start:]
    include_seva = "birth-seva__showcase" not in text[seva_start:] if seva_start != -1 else True
    title = extract_title(old_block)
    body_inner = build_body_content(old_block, title, path.name)

    seva_block = BIRTH_SEVA if include_seva else ""

    new_block = f"""<div class="outer-container inner-page-body birth-article">
    <div class="container birth-article__wrap">{body_inner}
    </div>
</div>

{seva_block}
"""

    text = text[:start] + new_block + tail

    slug = slug_from_file(path)
    if 'class="story-page' not in text:
        text = text.replace("<body>", f'<body class="story-page {slug}">', 1)
        text = text.replace("<body >", f'<body class="story-page {slug}">', 1)
    elif f"{slug}" not in text:
        text = re.sub(
            r'<body class="([^"]*)"',
            lambda m: f'<body class="{m.group(1)} {slug}"',
            text,
            count=1,
        )

    if 'href="birth.css"' not in text:
        text = text.replace(
            '<link rel="stylesheet" href="inner-seva.css">',
            '<link rel="stylesheet" href="inner-seva.css">\n<link rel="stylesheet" href="birth.css">',
            1,
        )

    text = text.replace(MOTIF_FIX[0], MOTIF_FIX[1])

    path.write_text(text, encoding="utf-8")
    return True


def main() -> None:
    migrated = []
    skipped = []
    for path in sorted(ROOT.glob("*.html")):
        if path.name == "index.html":
            continue
        try:
            if migrate_file(path):
                migrated.append(path.name)
            else:
                skipped.append(path.name)
        except Exception as exc:
            print(f"ERROR {path.name}: {exc}")
    print("Migrated:", len(migrated))
    for name in migrated:
        print(" ", name)
    print("Skipped:", len(skipped))


if __name__ == "__main__":
    main()
