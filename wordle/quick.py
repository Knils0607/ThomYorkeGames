from pathlib import Path

src = Path("word_list.json")
dst = Path("wordle_word_list.js")

words = [line.strip().upper() for line in src.read_text(encoding="utf-8").splitlines() if line.strip()]

with dst.open("w", encoding="utf-8") as f:
    f.write("const validWords = [\n")
    for w in words:
        f.write(f'  "{w}",\n')
    f.write("];\n")