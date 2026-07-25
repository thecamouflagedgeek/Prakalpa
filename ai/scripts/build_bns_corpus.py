import fitz
import re
import json
from pathlib import Path


BASE_DIR = Path(__file__).resolve().parent.parent

BNS_PDF = BASE_DIR / "data" / "raw" / "bns.pdf"
OUTPUT = BASE_DIR / "data" / "bns_sections.json"


def extract_pdf_text(path):
    print(f"Reading {path.name}...")

    doc = fitz.open(path)

    pages = []

    for page in doc:
        pages.append(page.get_text())

    text = "\n".join(pages)

    print(f"Extracted {len(text):,} characters.")

    return text


def clean_text(text):
    # Remove common PDF junk
    text = re.sub(
        r"THE GAZETTE OF INDIA.*?\n",
        "",
        text,
        flags=re.IGNORECASE
    )

    text = re.sub(
        r"\[PART II.*?\]",
        "",
        text,
        flags=re.IGNORECASE
    )

    # Normalize whitespace
    text = text.replace("\r", "\n")

    text = re.sub(r"[ \t]+", " ", text)

    text = re.sub(r"\n{3,}", "\n\n", text)

    return text


def parse_sections(text):
    """
    Detect BNS sections.

    BNS sections generally begin like:

    303. Theft.—
    304. Snatching.—

    We capture everything until the next numbered section.
    """

    pattern = re.compile(
        r"(?m)^(\d{1,3})\.\s+"
        r"([^\n]+?)"
        r"(?=\n)"
    )

    matches = list(pattern.finditer(text))

    print(f"Potential numbered sections found: {len(matches)}")

    sections = []

    for i, match in enumerate(matches):

        number = match.group(1)
        heading = match.group(2).strip()

        start = match.start()

        if i + 1 < len(matches):
            end = matches[i + 1].start()
        else:
            end = len(text)

        body = text[start:end].strip()

        # Basic sanity filtering
        try:
            section_num = int(number)
        except ValueError:
            continue

        # BNS currently ends at section 358.
        if not 1 <= section_num <= 358:
            continue

        # Clean heading punctuation
        heading = re.sub(
            r"[.—–-]+$",
            "",
            heading
        ).strip()

        sections.append({
            "section": number,
            "title": heading,
            "text": body
        })

    return sections


def deduplicate(sections):

    seen = set()
    result = []

    for section in sections:

        number = section["section"]

        if number in seen:
            continue

        seen.add(number)

        result.append(section)

    return result


def main():

    text = extract_pdf_text(BNS_PDF)

    text = clean_text(text)

    sections = parse_sections(text)

    sections = deduplicate(sections)

    sections.sort(
        key=lambda x: int(x["section"])
    )

    print()
    print(f"Final sections extracted: {len(sections)}")

    # Print samples
    print("\n--- SAMPLE ---")

    for section in sections[:5]:
        print(
            section["section"],
            section["title"]
        )

    OUTPUT.parent.mkdir(
        parents=True,
        exist_ok=True
    )

    with open(
        OUTPUT,
        "w",
        encoding="utf-8"
    ) as f:

        json.dump(
            sections,
            f,
            ensure_ascii=False,
            indent=2
        )

    print()
    print(f"Saved corpus → {OUTPUT}")


if __name__ == "__main__":
    main()