"""Regenerate story pages responsive block — desktop locked for core trio only."""
from pathlib import Path

DESKTOP_LOCKED_PAGES = [
    "birth-page",
    "education-page",
    "growing-years-page",
]

ALL_STORY_PAGES = [
    "birth-page",
    "education-page",
    "growing-years-page",
    "babaji-mission-page",
    "life-of-babaji-page",
    "devotees-page",
]

# Devotees Experience — desktop unchanged; no shared responsive overrides
RESPONSIVE_PAGES = [p for p in ALL_STORY_PAGES if p != "devotees-page"]

EXCLUDE = "".join(f":not(.{page})" for page in ALL_STORY_PAGES)


def sel(pages: list[str], suffix: str) -> str:
    return ",\n".join(f"  .story-page.{page} {suffix}" for page in pages)


def body_sel(pages: list[str]) -> str:
    return ",\n".join(f"  .story-page.{page}" for page in pages)


def article_padding_sel(pages: list[str]) -> str:
    pairs = []
    for page in pages:
        pairs.append(
            f"  .story-page.{page} .outer-container.inner-page-body.birth-article"
        )
        pairs.append(f"  .story-page.{page} .birth-article")
    return ",\n".join(pairs)


path = Path(__file__).resolve().parent / "birth.css"
text = path.read_text(encoding="utf-8")

marker = "/* ── Babaji story pages — tablet & mobile"
idx = text.index(marker)
before = text[:idx]

# Image nudge — desktop trio only (unchanged desktop)
before = before.replace(
    """/* Nudge story photos slightly right */
.story-page.birth-page .birth-article__media img,
.story-page.education-page .birth-article__media img,
.story-page.growing-years-page .birth-article__media img,
.story-page.babaji-mission-page .birth-article__media img,
.story-page.life-of-babaji-page .birth-article__media img {""",
    """/* Nudge story photos slightly right */
.story-page.birth-page .birth-article__media img,
.story-page.education-page .birth-article__media img,
.story-page.growing-years-page .birth-article__media img {""",
)

block = f"""/* ── Babaji story pages — tablet & mobile (desktop locked at 992px+) ── */
@media (min-width: 900px) {{
{sel(DESKTOP_LOCKED_PAGES, ".birth-article__grid")} {{
    grid-template-columns: minmax(0, 0.95fr) minmax(0, 1.05fr);
    align-items: center;
  }}

{sel(DESKTOP_LOCKED_PAGES, ".birth-article__media")} {{
    display: block;
  }}

{sel(DESKTOP_LOCKED_PAGES, ".birth-article__media img")} {{
    width: 77%;
    margin-left: 12%;
    margin-right: auto;
  }}
}}

@media (min-width: 992px) {{
{sel(DESKTOP_LOCKED_PAGES, ".birth-seva__showcase")} {{
    grid-template-columns: repeat(3, minmax(0, 1fr));
    width: min(1100px, 100%);
    max-width: none;
    margin-inline: auto;
    padding-inline: 0;
  }}

{sel(DESKTOP_LOCKED_PAGES, ".birth-seva__showcase .birth-seva__card:last-child")} {{
    grid-column: auto;
    width: auto;
    justify-self: stretch;
  }}

{sel(DESKTOP_LOCKED_PAGES, ".birth-seva__card .inner-seva__media")} {{
    height: 148px;
  }}

{sel(DESKTOP_LOCKED_PAGES, ".inner-banner")} {{
    max-height: none;
    overflow: visible;
    line-height: normal;
  }}

{sel(DESKTOP_LOCKED_PAGES, ".inner-banner img")} {{
    width: 100%;
    height: auto;
    min-height: 0;
    object-fit: unset;
    object-position: center;
  }}
}}

@media (max-width: 991px) {{
{body_sel(RESPONSIVE_PAGES)} {{
    overflow-x: hidden;
  }}

{sel(RESPONSIVE_PAGES, ".birth-article__wrap")} {{
    width: min(100%, 94vw);
    max-width: 100%;
    padding-left: clamp(1rem, 4vw, 1.5rem);
    padding-right: clamp(1rem, 4vw, 1.5rem);
  }}

{sel(RESPONSIVE_PAGES, ".birth-article__header")} {{
    margin-top: clamp(0.75rem, 2.5vw, 1.25rem);
    margin-bottom: clamp(1.5rem, 4vw, 2rem);
  }}

{sel(RESPONSIVE_PAGES, ".birth-article__title")} {{
    font-size: clamp(1.25rem, 3.5vw, 1.65rem) !important;
    letter-spacing: 0.1em;
  }}

{sel(RESPONSIVE_PAGES, ".birth-article__title-rule")} {{
    width: min(12rem, 78%);
    margin-top: 0.65rem;
  }}

{sel(RESPONSIVE_PAGES, ".birth-article__copy p")} {{
    max-width: 100%;
    padding-left: 0.85rem;
  }}

{sel(RESPONSIVE_PAGES, ".birth-article__divider")} {{
    margin: 1rem 0 1rem 0.65rem;
  }}
}}

@media (max-width: 899px) {{
{sel(RESPONSIVE_PAGES, ".birth-article__grid")} {{
    grid-template-columns: 1fr;
    gap: clamp(1rem, 3vw, 1.5rem);
    margin-bottom: 0.75rem;
  }}

{sel(RESPONSIVE_PAGES, ".birth-article__media")} {{
    display: flex;
    justify-content: center;
  }}

{sel(RESPONSIVE_PAGES, ".birth-article__media img")} {{
    width: min(100%, clamp(240px, 58vw, 420px));
    max-width: min(88vw, 420px);
    margin-left: auto;
    margin-right: auto;
  }}
}}

@media (min-width: 500px) and (max-width: 991px) {{
{sel(RESPONSIVE_PAGES, ".birth-seva__showcase")} {{
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    width: 100%;
    max-width: none;
    margin-inline: auto;
    gap: clamp(0.45rem, 1.2vw, 0.75rem);
    padding-inline: clamp(0.35rem, 2vw, 0.85rem);
  }}

{sel(RESPONSIVE_PAGES, ".birth-seva__showcase .birth-seva__card:last-child")} {{
    grid-column: auto;
    width: auto;
    justify-self: stretch;
  }}

{sel(RESPONSIVE_PAGES, ".birth-seva__card .inner-seva__media")} {{
    height: clamp(90px, 14vw, 125px);
  }}

{sel(RESPONSIVE_PAGES, ".birth-seva__desc")} {{
    font-size: clamp(0.62rem, 1.8vw, 0.72rem);
    padding-inline: 0.35rem;
  }}

{sel(RESPONSIVE_PAGES, ".birth-seva__card .inner-seva__label")} {{
    font-size: clamp(0.55rem, 1.6vw, 0.64rem);
    padding: 0.35rem 0.4rem 0.3rem;
  }}
}}

@media (max-width: 499px) {{
{sel(RESPONSIVE_PAGES, ".birth-seva__showcase")} {{
    display: grid;
    grid-template-columns: 1fr;
    width: 100%;
    max-width: min(100%, 360px);
    margin-inline: auto;
    gap: 0.85rem;
    padding-inline: clamp(0.5rem, 2vw, 1rem);
  }}

{sel(RESPONSIVE_PAGES, ".birth-seva__showcase .birth-seva__card:last-child")} {{
    grid-column: auto;
    width: 100%;
    justify-self: stretch;
  }}

{sel(RESPONSIVE_PAGES, ".birth-seva__card .inner-seva__media")} {{
    height: 120px;
  }}

{sel(RESPONSIVE_PAGES, ".birth-seva__desc")} {{
    font-size: 0.74rem;
    max-width: 100%;
    padding-inline: 0.65rem;
  }}

{sel(RESPONSIVE_PAGES, ".birth-seva__card .inner-seva__label")} {{
    font-size: 0.68rem;
    padding: 0.4rem 0.65rem 0.35rem;
  }}
}}

@media (max-width: 767px) {{
{sel(RESPONSIVE_PAGES, ".inner-banner")} {{
    overflow: hidden;
    max-height: clamp(140px, 32vw, 220px);
    line-height: 0;
  }}

{sel(RESPONSIVE_PAGES, ".inner-banner img")} {{
    display: block;
    width: 100%;
    height: 100%;
    min-height: clamp(140px, 32vw, 220px);
    object-fit: cover;
    object-position: center;
  }}

{sel(RESPONSIVE_PAGES, ".birth-seva")} {{
    padding-inline: clamp(0.65rem, 3vw, 1rem);
  }}

{sel(RESPONSIVE_PAGES, ".birth-article__media img")} {{
    width: min(100%, clamp(220px, 68vw, 360px));
    max-width: min(86vw, 360px);
  }}
}}

@media (max-width: 575px) {{
{article_padding_sel(RESPONSIVE_PAGES)} {{
    padding-top: clamp(1rem, 4vw, 1.35rem) !important;
    padding-bottom: clamp(1.75rem, 5vw, 2.35rem) !important;
  }}

{sel(RESPONSIVE_PAGES, ".birth-article__wrap")} {{
    padding-left: clamp(0.85rem, 4vw, 1.15rem);
    padding-right: clamp(0.85rem, 4vw, 1.15rem);
  }}

{sel(RESPONSIVE_PAGES, ".birth-article__header")} {{
    margin-bottom: 1.25rem;
  }}

{sel(RESPONSIVE_PAGES, ".birth-article__title")} {{
    font-size: clamp(1.05rem, 5.2vw, 1.35rem) !important;
    letter-spacing: 0.07em;
    line-height: 1.25;
  }}

{sel(RESPONSIVE_PAGES, ".birth-article__title-rule")} {{
    width: min(10rem, 85%);
  }}

{sel(RESPONSIVE_PAGES, ".birth-article__grid")} {{
    gap: clamp(0.85rem, 2.5vw, 1.1rem);
  }}

{sel(RESPONSIVE_PAGES, ".birth-article__media img")} {{
    width: min(100%, clamp(200px, 76vw, 300px));
    max-width: min(84vw, 300px);
    border-radius: 12px;
  }}

{sel(RESPONSIVE_PAGES, ".birth-article__copy p")} {{
    padding-left: 0.7rem;
    font-size: 0.9rem !important;
    line-height: 1.65 !important;
  }}

{sel(RESPONSIVE_PAGES, ".birth-article__divider")} {{
    margin: 0.85rem 0 0.85rem 0.45rem;
    gap: 0.5rem;
  }}

{sel(RESPONSIVE_PAGES, ".birth-article__divider-lotus")} {{
    width: 18px;
  }}
}}

@media (max-width: 360px) {{
{sel(RESPONSIVE_PAGES, ".inner-banner")} {{
    max-height: 130px;
  }}

{sel(RESPONSIVE_PAGES, ".inner-banner img")} {{
    min-height: 130px;
  }}

{sel(RESPONSIVE_PAGES, ".birth-article__title")} {{
    font-size: 1rem !important;
  }}

{sel(RESPONSIVE_PAGES, ".birth-article__media img")} {{
    width: min(100%, clamp(180px, 82vw, 260px));
    max-width: min(82vw, 260px);
  }}

{sel(RESPONSIVE_PAGES, ".birth-article__copy p")} {{
    padding-left: 0.55rem;
    font-size: 0.86rem !important;
  }}
}}
"""

path.write_text(before + block, encoding="utf-8")
print("Desktop locked for:", ", ".join(DESKTOP_LOCKED_PAGES))
print("Responsive below 992px for:", ", ".join(RESPONSIVE_PAGES))
print("Desktop unchanged (no responsive overrides): devotees-page")
