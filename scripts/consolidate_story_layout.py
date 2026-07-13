#!/usr/bin/env python3
"""Add shared layout classes to story pages and consolidate birth.css selectors."""

from __future__ import annotations

import glob
import os
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

BABAJI = {
    "birth.html",
    "education.html",
    "growing-years.html",
    "life-of-babaji.html",
    "babaji-mission.html",
}
FACILITY = {
    "om-sharvanababa-matham.html",
    "history.html",
    "founder.html",
    "sri-saraswathi-matapam.html",
    "sri-lakshami-mantapam.html",
    "satchitanandam-hall.html",
    "guest-houses.html",
    "kitchen-dining-hall.html",
    "admin-block.html",
    "cloak-room.html",
    "parking.html",
    "sri-maha-ganapathi-temple.html",
    "sri-kalyana-subramanya-temple.html",
    "sri-shirdi-sai-baba.html",
    "copper-sri-shiva-linga.html",
    "sri-dakshinamoorthy-temple.html",
    "sri-kala-bhairava-temple.html",
    "sri-naga-kshethra.html",
    "sri-shanishwara-temple.html",
    "sri-siddars.html",
    "vision.html",
}

FACILITY_PAGE_CLASSES = {
    "matham-page",
    "history-page",
    "founder-page",
    "saraswathi-mantapam-page",
    "lakshmi-mantapam-page",
    "satchitanandam-hall-page",
    "guest-houses-page",
    "kitchen-dining-hall-page",
    "admin-block-page",
    "cloak-room-page",
    "parking-page",
    "sri-maha-ganapathi-temple-page",
    "sri-kalyana-subramanya-temple-page",
    "sri-shirdi-sai-baba-temple-page",
    "copper-sri-shiva-linga-page",
    "sri-dakshinamoorthy-temple-page",
    "sri-kala-bhairava-temple-page",
    "sri-naga-kshethra-page",
    "sri-shanishwara-temple-page",
    "sri-siddars-page",
    "vision-page",
}

BABAJI_PAGE_CLASSES = {
    "birth-page",
    "education-page",
    "growing-years-page",
    "life-of-babaji-page",
    "babaji-mission-page",
}


def classify_html(name: str, text: str) -> list[str]:
    has_media = "birth-article-media" in text
    has_copy = "birth-article-copy" in text
    has_social = "social-impact-grid" in text or "social-impact-card" in text
    has_accordion = "devotees-experience-list" in text
    has_contact = "birth-article-grid--contact" in text
    has_map = "birth-article-grid--map" in text
    intro_only = (not has_copy) and "birth-article-header" in text and (not has_media)

    if has_contact or has_map or has_social or has_accordion or intro_only:
        return []
    if not (has_media and has_copy):
        return []

    layout = ["standard-story-layout"]
    if name in BABAJI:
        layout.append("babaji-story-layout")
    if name in FACILITY:
        layout.append("facility-story-layout")
    return layout


def update_html_files() -> int:
    updated = 0
    for path in sorted(ROOT.glob("*.html")):
        text = path.read_text(encoding="utf-8", errors="ignore")
        if "story-page" not in text:
            continue
        classes = classify_html(path.name, text)
        if not classes:
            continue

        match = re.search(r'<body\s+class="([^"]*)"', text)
        if not match:
            continue

        existing = match.group(1).split()
        changed = False
        for cls in classes:
            if cls not in existing:
                existing.append(cls)
                changed = True
        if not changed:
            continue

        new_body = f'<body class="{" ".join(existing)}"'
        text = text[: match.start()] + new_body + text[match.end() :]
        path.write_text(text, encoding="utf-8")
        updated += 1
    return updated


def collapse_selector_list(selector_block: str, target_class: str) -> str | None:
    """Collapse a comma-separated .story-page.*-page selector list if it only uses known pages."""
    selectors = [s.strip() for s in selector_block.split(",") if s.strip()]
    if len(selectors) < 2:
        return None

    suffixes: list[str] = []
    for sel in selectors:
        m = re.match(r"\.story-page\.([a-z0-9-]+-page)(\s+.+)$", sel)
        if not m:
            return None
        page_class, suffix = m.group(1), m.group(2)
        if page_class not in FACILITY_PAGE_CLASSES:
            return None
        suffixes.append(suffix)

    if len(set(suffixes)) != 1:
        return None

    return f".story-page.{target_class}{suffixes[0]}"


def collapse_mixed_facility_list(selector_block: str, target_class: str) -> str | None:
    """Collapse lists that mix facility pages with life-of-babaji or social-impact."""
    selectors = [s.strip() for s in selector_block.split(",") if s.strip()]
    if len(selectors) < 2:
        return None

    allowed_extra = {"life-of-babaji-page", "social-impact-page", "devotees-page", "anna-dhaanam-page"}
    suffixes: list[str] = []
    facility_count = 0

    for sel in selectors:
        m = re.match(r"\.story-page\.([a-z0-9-]+-page)(\s+.+)$", sel)
        if not m:
            return None
        page_class, suffix = m.group(1), m.group(2)
        suffixes.append(suffix)
        if page_class in FACILITY_PAGE_CLASSES:
            facility_count += 1
        elif page_class not in allowed_extra:
            return None

    if facility_count == 0 or len(set(suffixes)) != 1:
        return None

    return f".story-page.{target_class}{suffixes[0]}"


def replace_babaji_blocks(css: str) -> str:
  patterns = [
      (
          r"\.story-page\.birth-page ",
          ".story-page.babaji-story-layout ",
      ),
      (
          r"\.story-page\.education-page ",
          ".story-page.babaji-story-layout ",
      ),
      (
          r"\.story-page\.growing-years-page ",
          ".story-page.babaji-story-layout ",
      ),
      (
          r"\.story-page\.babaji-mission-page ",
          ".story-page.babaji-story-layout ",
      ),
  ]

  # Only replace in the babaji-specific section (lines ~412-506) by targeting grouped selectors
  babaji_block = re.search(
      r"/\* ── Babaji story pages — extra spacing ── \*/.*?(?=\n\.story-page\.devotees-page)",
      css,
      flags=re.S,
  )
  if not babaji_block:
      return css

  block = babaji_block.group(0)
  new_block = block
  for page in ("birth-page", "education-page", "growing-years-page", "babaji-mission-page"):
      new_block = re.sub(
          rf"\.story-page\.{re.escape(page)}",
          ".story-page.babaji-story-layout",
          new_block,
      )

  # Deduplicate repeated .story-page.babaji-story-layout lines in comma lists
  def dedupe_commas(match: re.Match[str]) -> str:
      items = [i.strip() for i in match.group(0).split(",")]
      seen = []
      for item in items:
          if item not in seen:
              seen.append(item)
      return ",\n".join(seen)

  new_block = re.sub(
      r"(?:\.story-page\.babaji-story-layout[^\n,]+,?\n?)+",
      dedupe_commas,
      new_block,
  )
  return css[: babaji_block.start()] + new_block + css[babaji_block.end() :]


def consolidate_css(css: str) -> str:
    # Top-level :not() chains → layout classes
    css = css.replace(
        ".story-page:not(.birth-page):not(.education-page):not(.growing-years-page):not(.babaji-mission-page):not(.life-of-babaji-page):not(.devotees-page)",
        ".story-page.standard-story-layout:not(.babaji-story-layout)",
    )
    css = css.replace(
        ".story-page.birth-page .birth-article-media img,\n.story-page.education-page .birth-article-media img,\n.story-page.growing-years-page .birth-article-media img",
        ".story-page.babaji-story-layout .birth-article-media img",
    )

    # Remove fully redundant background block (already set via --birth-bg at top)
    css = re.sub(
        r"\n\.story-page\.devotees-page \.outer-container:not\(\.inner-seva\),.*?background: #f0e6d8 !important;\n\}\n",
        "\n",
        css,
        flags=re.S,
        count=1,
    )

    # Replace duplicate padding/header blocks with comments noting base rules cover them
    css = re.sub(
        r"\n\.story-page\.matham-page \.outer-container\.inner-page-body\.birth-article,.*?\.story-page\.anna-dhaanam-page \.birth-article-header \{\n  margin-top: clamp\(1rem, 2\.5vw, 1\.75rem\);\n\}\n",
        "\n",
        css,
        flags=re.S,
        count=1,
    )

    facility_media = """.story-page.facility-story-layout .birth-article-media {
  margin-left: 118px;
}

.story-page.facility-story-layout .birth-article-media img {
  width: 100%;
  max-width: 100%;
}

.story-page.facility-story-layout .birth-article-more > p {
  max-width: 70rem;
  margin-left: auto;
  margin-right: auto;
  transform: translateX(1.25rem);
  text-align: center;
  letter-spacing: 0.04em;
}

.story-page.standard-story-layout .birth-seva {
  margin-bottom: clamp(1.5rem, 3vw, 2.5rem);
  padding-top: clamp(1.25rem, 2.5vw, 2rem) !important;
  padding-bottom: clamp(2rem, 4vw, 3rem) !important;
}

.story-page.standard-story-layout .birth-seva-showcase {
  gap: clamp(1.25rem, 2.5vw, 1.75rem);
  padding-top: clamp(0.5rem, 1.5vw, 1rem);
  padding-bottom: clamp(0.5rem, 1.5vw, 1rem);
}

"""

    css = re.sub(
        r"\n\.story-page\.matham-page \.birth-article-media,.*?\.story-page\.standard-story-layout \.birth-seva-showcase \{\n  gap: clamp\(1\.25rem, 2\.5vw, 1\.75rem\);\n  padding-top: clamp\(0\.5rem, 1\.5vw, 1rem\);\n  padding-bottom: clamp\(0\.5rem, 1\.5vw, 1rem\);\n\}\n",
        "\n" + facility_media,
        css,
        flags=re.S,
        count=1,
    )

    # 991px grid gap — babaji + facility
    css = re.sub(
        r"@media \(max-width: 991px\) \{\n  \.story-page\.birth-page \.birth-article-grid,.*?\.story-page\.vision-page \.birth-article-grid \{\n    gap: 2rem;\n  \}\n\n  \.story-page\.matham-page \.birth-article-media,.*?\.story-page\.sri-siddars-page \.birth-article-more > p \{\n    transform: none;\n  \}\n\}",
        """@media (max-width: 991px) {
  .story-page.babaji-story-layout .birth-article-grid,
  .story-page.facility-story-layout .birth-article-grid {
    gap: 2rem;
  }

  .story-page.facility-story-layout .birth-article-media {
    margin-left: 0;
  }

  .story-page.facility-story-layout .birth-article-more > p {
    transform: none;
  }
}""",
        css,
        flags=re.S,
        count=1,
    )

    # Facility shared responsive layout (unguarded rules ~1173)
    css = re.sub(
        r"/\* Inner Matham & temple pages — shared responsive layout \*/\n(?:  \.story-page\.matham-page[^\n]+\n)+.*?\.story-page\.sri-shanishwara-temple-page \.birth-article-copy p \{\n  padding-left: 1rem;\n\}\n",
        """/* Facility & temple pages — shared responsive layout */
.story-page.facility-story-layout .birth-article-grid {
  width: 100%;
  margin-top: 0.5rem;
}

.story-page.facility-story-layout .birth-article-media {
  margin-left: 0;
}

.story-page.facility-story-layout .birth-article-media img {
  width: 100%;
  max-width: 100%;
  margin-left: auto;
  margin-right: auto;
}

.story-page.facility-story-layout .birth-article-copy p {
  padding-left: 1rem;
}

""",
        css,
        flags=re.S,
        count=1,
    )

    # Tablet/mobile facility block
    css = re.sub(
        r"/\* Tablet & mobile only \(desktop 992px\+ unchanged\) \*/\n@media \(max-width: 991px\) \{\n  \.story-page\.matham-page,.*?\.story-page\.sri-shanishwara-temple-page \.birth-seva-card \.inner-seva-media \{\n    height: clamp\(90px, 14vw, 125px\);\n  \}\n\}",
        """/* Tablet & mobile — facility / standard story pages */
@media (max-width: 991px) {
  .story-page.facility-story-layout {
    overflow-x: hidden;
  }

  .story-page.facility-story-layout .birth-article-wrap {
    width: min(100%, 94vw);
    max-width: 100%;
    padding-left: clamp(1rem, 4vw, 1.5rem);
    padding-right: clamp(1rem, 4vw, 1.5rem);
  }

  .story-page.facility-story-layout .birth-article-header {
    margin-top: clamp(0.75rem, 2.5vw, 1.25rem);
    margin-bottom: clamp(1.5rem, 4vw, 2rem);
  }

  .story-page.facility-story-layout .birth-article-title {
    font-size: clamp(1.25rem, 3.5vw, 1.65rem) !important;
  }

  .story-page.facility-story-layout .inner-banner {
    overflow: hidden;
    max-height: clamp(140px, 32vw, 220px);
    line-height: 0;
  }

  .story-page.facility-story-layout .inner-banner img {
    display: block;
    width: 100%;
    height: 100%;
    min-height: clamp(140px, 32vw, 220px);
    object-fit: cover;
    object-position: center;
  }

  .story-page.facility-story-layout .birth-seva {
    padding-inline: clamp(0.65rem, 3vw, 1rem);
  }

  .story-page.facility-story-layout .birth-seva-showcase {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    width: 100%;
    max-width: none;
    margin-inline: auto;
    gap: clamp(0.45rem, 1.2vw, 0.75rem);
    padding-inline: clamp(0.35rem, 2vw, 0.85rem);
  }

  .story-page.facility-story-layout .birth-seva-showcase .birth-seva-card:last-child {
    grid-column: auto;
    width: auto;
    justify-self: stretch;
  }

  .story-page.facility-story-layout .birth-seva-card .inner-seva-media {
    height: clamp(90px, 14vw, 125px);
  }
}""",
        css,
        flags=re.S,
        count=1,
    )

    css = re.sub(
        r"@media \(max-width: 899px\) \{\n  \.story-page\.matham-page \.birth-article-grid,.*?\.story-page\.sri-shanishwara-temple-page \.birth-article-media img \{\n    width: min\(100%, clamp\(240px, 58vw, 420px\)\);\n    max-width: min\(88vw, 420px\);\n  \}\n\}",
        """@media (max-width: 899px) {
  .story-page.facility-story-layout .birth-article-grid {
    grid-template-columns: 1fr;
    gap: clamp(1rem, 3vw, 1.5rem);
  }

  .story-page.facility-story-layout .birth-article-media {
    display: flex;
    justify-content: center;
  }

  .story-page.facility-story-layout .birth-article-media img {
    width: min(100%, clamp(240px, 58vw, 420px));
    max-width: min(88vw, 420px);
  }
}""",
        css,
        flags=re.S,
        count=1,
    )

    css = re.sub(
        r"@media \(max-width: 575px\) \{\n  \.story-page\.matham-page \.birth-article-grid,.*?\.story-page\.sri-shanishwara-temple-page \.birth-article-copy p \{\n    padding-left: 0\.7rem;\n    font-size: 0\.9rem !important;\n    line-height: 1\.65 !important;\n  \}\n\n  \.story-page\.vision-page \.birth-article-point",
        """@media (max-width: 575px) {
  .story-page.facility-story-layout .birth-article-grid {
    gap: clamp(0.85rem, 2.5vw, 1.1rem);
  }

  .story-page.facility-story-layout .birth-article-media img {
    width: min(100%, clamp(200px, 76vw, 300px));
    max-width: min(84vw, 300px);
    border-radius: 12px;
  }

  .story-page.facility-story-layout .birth-article-copy p {
    padding-left: 0.7rem;
    font-size: 0.9rem !important;
    line-height: 1.65 !important;
  }

  .story-page.vision-page .birth-article-point""",
        css,
        flags=re.S,
        count=1,
    )

    css = re.sub(
        r"@media \(max-width: 499px\) \{\n  \.story-page\.matham-page \.birth-seva-showcase,.*?\.story-page\.sri-shanishwara-temple-page \.birth-seva-card \.inner-seva-media \{\n    height: 120px;\n  \}\n\}\n\n/\* Social Impact",
        """@media (max-width: 499px) {
  .story-page.facility-story-layout .birth-seva-showcase {
    grid-template-columns: 1fr;
    max-width: min(100%, 360px);
    gap: 0.85rem;
  }

  .story-page.facility-story-layout .birth-seva-showcase .birth-seva-card:last-child {
    width: 100%;
  }

  .story-page.facility-story-layout .birth-seva-card .inner-seva-media {
    height: 120px;
  }
}

/* Social Impact""",
        css,
        flags=re.S,
        count=1,
    )

    css = replace_babaji_blocks(css)

    # Devotees + life-of-babaji seva rules kept page-specific; remove from standard if duplicated
    css = re.sub(
        r"\.story-page\.devotees-page \.birth-seva,\n\.story-page\.life-of-babaji-page \.birth-seva,\n\.story-page\.matham-page \.birth-seva,.*?\.story-page\.sri-siddars-page \.birth-seva \{\n  margin-bottom:",
        ".story-page.devotees-page .birth-seva,\n.story-page.life-of-babaji-page .birth-seva,\n.story-page.social-impact-page .birth-seva {\n  margin-bottom:",
        css,
        flags=re.S,
        count=1,
    )

    return css


def main() -> None:
    html_count = update_html_files()
    css_path = ROOT / "birth.css"
    original = css_path.read_text(encoding="utf-8")
    updated = consolidate_css(original)
    css_path.write_text(updated, encoding="utf-8")
    print(f"Updated {html_count} HTML files with layout classes")
    print(f"birth.css: {len(original.splitlines())} -> {len(updated.splitlines())} lines")


if __name__ == "__main__":
    main()
