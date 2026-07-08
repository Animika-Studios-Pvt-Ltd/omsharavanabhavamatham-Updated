"""Move innermotif inside inner-banner so motif stays attached on all viewports."""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent

MOTIF_INNER = """
        <div class="innermotif">
          <img
            src="static/omsharavanabhavamatham-org/banner-motif.webp"
            class="img-fluid"
            alt="motif"
          />
        </div>"""

# Banner img then close inner-banner — motif injected before inner-banner closes.
BANNER_IMG_CLOSE = re.compile(
    r"(<div class=\"inner-banner\">\s*<img\b[^>]*>\s*)</div>",
    re.IGNORECASE | re.DOTALL,
)

# Remove separate MOTIF section (with or without innermotif content).
MOTIF_SECTION = re.compile(
    r"\s*<!--\s*MOTIF\s*-->\s*<div class=\"container-fluid\">.*?</div>\s*",
    re.IGNORECASE | re.DOTALL,
)


def migrate_file(path: Path) -> bool:
    text = path.read_text(encoding="utf-8")
    if "inner-banner" not in text:
        return False
    if '<div class="innermotif">' in text and BANNER_IMG_CLOSE.search(text):
        # Already inside banner?
        inner_banner = re.search(
            r"<div class=\"inner-banner\">.*?</div>\s*</div>",
            text,
            re.IGNORECASE | re.DOTALL,
        )
        if inner_banner and 'class="innermotif"' in inner_banner.group(0):
            return False

    updated = MOTIF_SECTION.sub("\n\n", text)
    if '<div class="innermotif">' not in updated:
        updated, count = BANNER_IMG_CLOSE.subn(
            r"\1" + MOTIF_INNER + "\n      </div>", updated, count=1
        )
        if count == 0:
            return False
    else:
        # Motif existed in removed section — re-inject into banner if missing there.
        if not re.search(
            r"<div class=\"inner-banner\">[\s\S]*?class=\"innermotif\"",
            updated,
            re.IGNORECASE,
        ):
            updated, count = BANNER_IMG_CLOSE.subn(
                r"\1" + MOTIF_INNER + "\n      </div>", updated, count=1
            )
            if count == 0:
                return False

    if updated != text:
        path.write_text(updated, encoding="utf-8")
        return True
    return False


def main() -> None:
    changed = []
    for path in sorted(ROOT.glob("*.html")):
        if migrate_file(path):
            changed.append(path.name)
    print(f"Updated {len(changed)} files:")
    for name in changed:
        print(f"  - {name}")


if __name__ == "__main__":
    main()
