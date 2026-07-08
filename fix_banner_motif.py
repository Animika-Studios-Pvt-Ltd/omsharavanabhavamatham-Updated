"""Normalize inner-banner + innermotif markup after migration."""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent

STANDARD_BANNER = """    <!-- INNER BANNER -->
    <div class="container-fluid p-0">
      <div class="inner-banner">
        <img
          src="static/omsharavanabhavamatham-org/inner-page-banner.webp"
          alt="babaji-birth"
          class="img-fluid"
        />
        <div class="innermotif">
          <img
            src="static/omsharavanabhavamatham-org/banner-motif.webp"
            class="img-fluid"
            alt="motif"
          />
        </div>
      </div>
    </div>

"""

BANNER_SECTION = re.compile(
    r"<!--\s*INNER BANNER\s*-->.*?(?=\n\s*<!--\s*MAIN CONTENT -->|\n\s*<div class=\"outer-container)",
    re.DOTALL | re.IGNORECASE,
)


def fix_file(path: Path) -> bool:
    text = path.read_text(encoding="utf-8")
    if "inner-banner" not in text:
        return False
    if not BANNER_SECTION.search(text):
        return False
    updated = BANNER_SECTION.sub(STANDARD_BANNER, text, count=1)
    if updated == text:
        return False
    path.write_text(updated, encoding="utf-8")
    return True


def main() -> None:
    changed = [p.name for p in sorted(ROOT.glob("*.html")) if fix_file(p)]
    print(f"Normalized {len(changed)} files")


if __name__ == "__main__":
    main()
