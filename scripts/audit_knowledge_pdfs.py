from pathlib import Path
import json

import fitz


DEFAULT_SOURCE = Path("/Users/good/Downloads/buildai_premium_orange_white/public")


def audit_pdf(path: Path) -> dict:
    doc = fitz.open(path)
    page_count = len(doc)
    sample_pages = min(page_count, 10)
    chars = 0
    sample = ""
    for index in range(sample_pages):
        text = doc[index].get_text("text")
        chars += len(text)
        if not sample and text.strip():
            sample = " ".join(text.split())[:300]
    if chars > 1000:
        status = "text"
    elif chars > 100:
        status = "partial_text"
    else:
        status = "needs_ocr"
    return {
        "file": path.name,
        "pages": page_count,
        "first_10_pages_chars": chars,
        "status": status,
        "sample": sample,
    }


def main() -> None:
    source = DEFAULT_SOURCE
    results = [audit_pdf(path) for path in sorted(source.glob("*.pdf"))]
    print(json.dumps(results, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
