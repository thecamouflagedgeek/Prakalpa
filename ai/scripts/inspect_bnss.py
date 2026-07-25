import fitz
import re
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
BNSS_PDF = BASE_DIR / "data" / "raw" / "bnss.pdf"


def main():
    doc = fitz.open(BNSS_PDF)

    print(f"Total pages: {len(doc)}")

    found = False

    for page_number, page in enumerate(doc):
        text = page.get_text()

        if re.search(
            r"THE FIRST SCHEDULE|FIRST SCHEDULE",
            text,
            re.IGNORECASE
        ):
            print("\n" + "=" * 70)
            print(f"FOUND FIRST SCHEDULE ON PDF PAGE {page_number + 1}")
            print("=" * 70)

            print(text[:5000])

            found = True

    if not found:
        print("Could not find FIRST SCHEDULE automatically.")


if __name__ == "__main__":
    main()