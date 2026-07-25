import fitz
import json
import re
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

BNSS_PDF = BASE_DIR / "data" / "raw" / "bnss.pdf"
OUTPUT = BASE_DIR / "data" / "bnss_schedule.json"

COLS = {
    "section": (60, 100),
    "offence": (100, 220),
    "punishment": (220, 290),
    "cognizable": (290, 368),
    "bailable": (368, 456),
    "triable_by": (456, 570),
}


def get_column(x):
    for name, (start, end) in COLS.items():
        if start <= x < end:
            return name
    return None


def clean(text):
    return re.sub(r"\s+", " ", text).strip()


def valid_section(text):
    return bool(
        re.fullmatch(
            r"\d{1,3}(?:\(\d+\))?",
            text
        )
    )


def get_words(page):

    words = []

    for word in page.get_text("words"):

        x0, y0, x1, y1, text, *_ = word

        column = get_column(x0)

        if column:

            words.append({
                "x": x0,
                "y": y0,
                "text": text,
                "column": column
            })

    return words


def find_section_starts(words):
    """
    Find actual schedule row starts from section numbers
    in first column.
    """

    starts = []

    for word in words:

        if (
            word["column"] == "section"
            and valid_section(word["text"])
            and word["text"] not in {"1", "2", "3", "4", "5", "6"}
        ):

            starts.append({
                "section": word["text"],
                "y": word["y"]
            })

    starts.sort(key=lambda x: x["y"])

    return starts


def collect_cell(words, column, start_y, end_y):

    cell_words = [
        w for w in words
        if (
            w["column"] == column
            and w["y"] >= start_y - 1
            and w["y"] < end_y - 1
        )
    ]

    cell_words.sort(
        key=lambda w: (
            round(w["y"], 1),
            w["x"]
        )
    )

    return clean(
        " ".join(w["text"] for w in cell_words)
    )


def parse_page(page, page_number):

    words = get_words(page)

    starts = find_section_starts(words)

    rows = []

    if not starts:
        return rows

    for i, start in enumerate(starts):

        start_y = start["y"]

        if i + 1 < len(starts):
            end_y = starts[i + 1]["y"]
        else:
            # Bottom of page
            end_y = page.rect.height - 20

        row = {
            "section": start["section"],
            "offence": collect_cell(
                words, "offence", start_y, end_y
            ),
            "punishment": collect_cell(
                words, "punishment", start_y, end_y
            ),
            "cognizable": collect_cell(
                words, "cognizable", start_y, end_y
            ),
            "bailable": collect_cell(
                words, "bailable", start_y, end_y
            ),
            "triable_by": collect_cell(
                words, "triable_by", start_y, end_y
            ),
            "source_page": page_number,
        }

        rows.append(row)

    return rows


def main():

    print("Reading BNSS First Schedule...")

    doc = fitz.open(BNSS_PDF)

    all_rows = []

    # Start PDF page 173
    for page_index in range(172, len(doc)):

        page = doc[page_index]
        page_number = page_index + 1
        page_text = page.get_text()

        normalized = re.sub(
            r"\s+",
            " ",
            page_text.upper()
        )

        if (
            "CLASSIFICATION OF OFFENCES AGAINST OTHER LAWS" in normalized
            or
            "OFFENCES AGAINST OTHER LAWS" in normalized
        ):
            print(
                f"Reached end of BNS schedule "
                f"at PDF page {page_number}"
            )
            break

        rows = parse_page(
            page,
            page_number
        )

        all_rows.extend(rows)

    print(
        f"Raw schedule rows extracted: "
        f"{len(all_rows)}"
    )

    with open(
        OUTPUT,
        "w",
        encoding="utf-8"
    ) as f:

        json.dump(
            all_rows,
            f,
            ensure_ascii=False,
            indent=2
        )

    print(f"Saved → {OUTPUT}")

    print("\n--- FIRST 5 ROWS ---")

    for row in all_rows[:5]:

        print("\nSECTION:", row["section"])
        print("OFFENCE:", row["offence"])
        print("PUNISHMENT:", row["punishment"])
        print("COGNIZABLE:", row["cognizable"])
        print("BAILABLE:", row["bailable"])
        print("COURT:", row["triable_by"])


if __name__ == "__main__":
    main()