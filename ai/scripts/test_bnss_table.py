import fitz
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
BNSS_PDF = BASE_DIR / "data" / "raw" / "bnss.pdf"

doc = fitz.open(BNSS_PDF)

# Schedule begins on PDF page 173
page = doc[172]

words = page.get_text("words")

# Each word:
# x0, y0, x1, y1, text, block_no, line_no, word_no

print(f"Words found: {len(words)}")
print("\n--- WORD POSITIONS ---\n")

for word in words:
    x0, y0, x1, y1, text, *_ = word

    # Only print lower part where actual schedule table starts
    if y0 > 180:
        print(
            f"x={x0:7.1f}  "
            f"y={y0:7.1f}  "
            f"{text}"
        )