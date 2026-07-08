"""Remove innermotif section from all inner pages."""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent

MOTIF_SECTION = re.compile(
    r"\s*<!--\s*MOTIF\s*-->\s*<div class=\"container-fluid\">\s*<div class=\"innermotif\">.*?</div>\s*</div>\s*",
    re.DOTALL | re.IGNORECASE,
)


def remove_motif(path: Path) -> bool:
    text = path.read_text(encoding="utf-8")
    if "innermotif" not in text:
        return False
    updated = MOTIF_SECTION.sub("\n\n", text)
    if updated == text:
        return False
    path.write_text(updated, encoding="utf-8")
    return True


def main() -> None:
    changed = [p.name for p in sorted(ROOT.glob("*.html")) if remove_motif(p)]
    print(f"Removed motif from {len(changed)} files")


if __name__ == "__main__":
    main()
