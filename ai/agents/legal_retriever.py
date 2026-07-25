import json
from pathlib import Path

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


BASE_DIR = Path(__file__).resolve().parent.parent
CORPUS_FILE = BASE_DIR / "data" / "legal_corpus.json"


with open(CORPUS_FILE, encoding="utf-8") as f:
    CORPUS = json.load(f)


def build_search_text(section):
    """
    Combine useful legal information into one searchable document.
    """

    classification_text = " ".join(
        c.get("offence", "")
        for c in section.get("classifications", [])
    )

    return " ".join([
        section.get("title", ""),
        section.get("title", ""),  # give title slightly more weight
        classification_text,
        section.get("text", "")
    ])


DOCUMENTS = [
    build_search_text(section)
    for section in CORPUS
]


VECTORIZER = TfidfVectorizer(
    stop_words="english",
    ngram_range=(1, 2),
    sublinear_tf=True,
    max_df=0.95
)


DOCUMENT_MATRIX = VECTORIZER.fit_transform(
    DOCUMENTS
)


def retrieve_sections(
    incident_description: str,
    top_k: int = 10
):

    query_vector = VECTORIZER.transform(
        [incident_description]
    )

    similarities = cosine_similarity(
        query_vector,
        DOCUMENT_MATRIX
    ).flatten()

    ranked_indices = similarities.argsort()[::-1]

    results = []

    for index in ranked_indices[:top_k]:

        section = CORPUS[index].copy()

        section["retrieval_score"] = round(
            float(similarities[index]),
            4
        )

        results.append(section)

    return results