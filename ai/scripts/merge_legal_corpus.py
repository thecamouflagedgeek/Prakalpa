import json
import re
from pathlib import Path
from collections import defaultdict

BASE_DIR = Path(__file__).resolve().parent.parent

BNS_FILE = BASE_DIR / "data" / "bns_sections.json"
BNSS_FILE = BASE_DIR / "data" / "bnss_schedule.json"
OUTPUT = BASE_DIR / "data" / "legal_corpus.json"


def base_section(section):
    """
    303(2) -> 303
    103(1) -> 103
    49 -> 49
    """
    match = re.match(r"(\d+)", section)

    return match.group(1) if match else section


def normalize_cognizable(text):

    lower = text.lower()

    has_non_cognizable = "non-cognizable" in lower

    remaining = lower.replace(
        "non-cognizable",
        ""
    )

    has_cognizable = "cognizable" in remaining

    if has_non_cognizable and has_cognizable:
        return "Conditional"

    if has_non_cognizable:
        return "Non-cognizable"

    if has_cognizable:
        return "Cognizable"

    return "Conditional"


def normalize_bailable(text):

    lower = text.lower()

    has_non_bailable = "non-bailable" in lower

    # Remove "non-bailable" before checking for standalone "bailable"
    remaining = lower.replace("non-bailable", "")

    has_bailable = "bailable" in remaining

    if has_non_bailable and has_bailable:
        return "Conditional"

    if has_non_bailable:
        return "Non-bailable"

    if has_bailable:
        return "Bailable"

    return "Conditional"


def main():

    with open(
        BNS_FILE,
        encoding="utf-8"
    ) as f:
        bns_sections = json.load(f)

    with open(
        BNSS_FILE,
        encoding="utf-8"
    ) as f:
        schedule = json.load(f)

    classifications = defaultdict(list)

    for row in schedule:

        section = base_section(row["section"])

        classifications[section].append({
            "schedule_section": row["section"],
            "offence": row["offence"],
            "punishment": row["punishment"],
            "cognizable": normalize_cognizable(
                row["cognizable"]
            ),
            "bailable": normalize_bailable(
                row["bailable"]
            ),
            "cognizable_raw": row["cognizable"],
            "bailable_raw": row["bailable"],
            "triable_by": row["triable_by"],
            "source_page": row["source_page"]
        })

    corpus = []

    for section in bns_sections:

        number = section["section"]

        corpus.append({
            "section": number,
            "title": section["title"],
            "text": section["text"],
            "classifications":
                classifications.get(number, [])
        })

    with open(
        OUTPUT,
        "w",
        encoding="utf-8"
    ) as f:

        json.dump(
            corpus,
            f,
            ensure_ascii=False,
            indent=2
        )

    print(f"BNS sections: {len(bns_sections)}")

    print(
        "Sections with BNSS classification:",
        sum(
            1 for item in corpus
            if item["classifications"]
        )
    )

    print(
        "Sections without classification:",
        sum(
            1 for item in corpus
            if not item["classifications"]
        )
    )

    print(f"\nSaved merged corpus → {OUTPUT}")

    # Sanity check section 303
    print("\n--- SECTION 303 ---")

    item = next(
        (
            x for x in corpus
            if x["section"] == "303"
        ),
        None
    )

    if item:
        print("Title:", item["title"])
        print(
            "Classifications:",
            len(item["classifications"])
        )

        for c in item["classifications"]:
            print("\n", c)


if __name__ == "__main__":
    main()