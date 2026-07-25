from agents.legal_retriever import retrieve_sections


incident = """
The complainant returned home at approximately 9 PM
and discovered that someone had entered the house
without permission and stolen a laptop, jewellery
and cash.
"""


results = retrieve_sections(
    incident,
    top_k=10
)


print("\nTOP RETRIEVED BNS SECTIONS\n")

for result in results:

    print(
        f"§{result['section']} "
        f"{result['title']}"
    )

    print(
        f"Score: "
        f"{result['retrieval_score']}"
    )

    print("-" * 60)