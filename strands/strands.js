var height = 8;
var width = 6;

const invalid_strands = {
    "THISISAWORD": [[1, 5], [2, 5], [3, 4], [4, 3], [5, 7], [6, 2], [7, 1], [8, 0], [9, 5], [10, 2], [11, 4]],
    "WORDTWO": [[3, 5], [3, 6], [3, 7], [3, 8], [3, 9], [3, 10], [3, 11], [3, 12]]
};

const example_theme = "Fresh from the market";

const example_strands = {
    "SUMMERHARVEST": [[0,4],[1,4],[1,3],[1,2],[2,2],[2,3],[2,4],[3,4],[4,4],[4,5],[5,5],[5,6],[5,7]],
    "TOMATO": [[0,3],[0,2],[0,1],[0,0],[1,0],[1,1]],
    "CORN": [[3,0],[3,1],[2,0],[2,1]],
    "CARROT": [[3,3],[3,2],[4,1],[5,1],[5,0],[4,0]],
    "MELON": [[4,2],[4,3],[5,2],[5,3],[5,4]],
    "PEPPER": [[0,7],[0,6],[1,7],[1,6],[1,5],[0,5]],
    "ZUCCHINI": [[2,7],[2,6],[2,5],[3,5],[3,6],[3,7],[4,7],[4,6]]
};

let strands;
let num_words = 0;
let words_found = 0;

window.onload = function () {
    initialize();
};

function initialize() {
    strands = example_strands;
    num_words = Object.keys(strands).length;
    words_found = 0;

    const themeDiv = document.getElementById("theme");
    if (themeDiv) {
        themeDiv.innerText = example_theme;
    }

    const valid_strands = check_strands_viability(strands);
    if (!valid_strands) {
        console.log("invalid strands");
        return;
    }

    const board = document.getElementById("board");
    if (!board) {
        console.error("Board element not found");
        return;
    }

    board.innerHTML = "";
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const tile = document.createElement("span");
            tile.id = `${x}-${y}`;
            tile.classList.add("tile");
            tile.innerText = "";
            board.appendChild(tile);
        }
    }

    fillAllStrandTiles(strands);

    document.addEventListener("click", processInput);
}

function check_strands_viability(strands_dict) {
    const allowed_num_letters = height * width;
    let num_letters = 0;
    const seenCoords = new Set();

    for (const word in strands_dict) {
        if (!Object.hasOwn(strands_dict, word)) {
            continue;
        }

        const coords = strands_dict[word];
        const length_word = word.length;

        if (coords.length !== length_word) {
            return false;
        }

        num_letters += length_word;

        for (let i = 0; i < coords.length; i++) {
            const [x, y] = coords[i];
            const coordKey = `${x}:${y}`;

            if (seenCoords.has(coordKey)) {
                return false;
            }
            seenCoords.add(coordKey);

            if (i > 0) {
                const [prevX, prevY] = coords[i - 1];
                const dx = Math.abs(prevX - x);
                const dy = Math.abs(prevY - y);
                const isAdjacent = Math.max(dx, dy) === 1;

                if (!isAdjacent) {
                    return false;
                }
            }
        }
    }

    return allowed_num_letters === num_letters;
}

function fillAllStrandTiles(strandsData) {
    for (const word in strandsData) {
        if (!Object.hasOwn(strandsData, word)) {
            continue;
        }

        const coords = strandsData[word];
        for (let i = 0; i < coords.length; i++) {
            const [x, y] = coords[i];
            const tileId = `${x}-${y}`;
            const tile = document.getElementById(tileId);

            if (tile) {
                tile.innerText = word[i];
            }
        }
    }
}