var height = 8;
var width = 6;

const invalid_strands = {
    "THISISAWORD": [[1, 5], [2, 5], [3, 4], [4, 3], [5, 7], [6, 2], [7, 1], [8, 0], [9, 5], [10, 2], [11, 4]],
    "WORDTWO": [[3, 5], [3, 6], [3, 7], [3, 8], [3, 9], [3, 10], [3, 11], [3, 12]]
};

// const example_theme = "Fresh from the market";
const example_theme = "_maschine";

// first word is the spangram
const example_strands = {
    "VOICENOTE": [[0,3],[1,2,],[1,3],[2,2],[2,3],[3,2],[4,2],[5,1],[5,0]],
    "FRESS": [[0,2],[0,1],[0,0],[1,0],[1,1]],
    "KICHER": [[4,0],[4,1],[3,0],[3,1],[2,0],[2,1]],
    "SCHLAF": [[3,4],[3,3],[4,4],[4,3],[5,3],[5,2]],
    "YAPPING": [[1,4],[0,4],[0,5],[0,6],[0,7],[1,7],[2,7]],
    "BITMACH": [[2,4],[1,5],[1,6],[2,6],[3,7],[3,6],[4,7]],
    "PISS": [[2,5],[3,5],[4,6],[5,7]],
    "TANZ": [[5,4],[4,5],[5,6],[5,5]]
};

// first word is the spangram
// const example_strands = {
//     "SUMMERHARVEST": [[0,4],[1,4],[1,3],[1,2],[2,2],[2,3],[2,4],[3,4],[4,4],[4,5],[5,5],[5,6],[5,7]],
//     "TOMATO": [[0,3],[0,2],[0,1],[0,0],[1,0],[1,1]],
//     "CORN": [[3,0],[3,1],[2,0],[2,1]],
//     "CARROT": [[3,3],[3,2],[4,1],[5,1],[5,0],[4,0]],
//     "MELON": [[4,2],[4,3],[5,2],[5,3],[5,4]],
//     "PEPPER": [[0,7],[0,6],[1,7],[1,6],[1,5],[0,5]],
//     "ZUCCHINI": [[2,7],[2,6],[2,5],[3,5],[3,6],[3,7],[4,7],[4,6]]
// };

let strands;
let num_words = 0;
let words_found = 0;
let selected_positions = [];
var gameOver = false; // Game over flag

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

    updateWordCount();

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

    //  build the board
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

    // fill the board/tiles with the letters in strands
    fillAllStrandTiles(strands);

    document.addEventListener("click", processInput);
}

function processInput(event) {
    if (gameOver) return;
    if (!event) return;

    // The clicked element may be the tile itself or a child; find the nearest .tile
    const clickedEl = event.target;
    const tile = (clickedEl && clickedEl.closest) ? clickedEl.closest('.tile') : (clickedEl.classList && clickedEl.classList.contains('tile') ? clickedEl : null);

     // click was not on a tile
    if (!tile) return;
    // click was on already correctly guessed strand
    if (tile.classList.contains('correct') || tile.classList.contains('spangram')) {
        return; 
    }

    // Tile id is in the form "x-y"
    const key = tile.id || '';
    const clicked_position = idToXY(key);

    // if no position selected yet, add position and be ready for next input
    if (selected_positions.length == 0) {
        selected_positions = [clicked_position];
        tile.classList.add('selected');
        updateInputText();
        return; // Might be jumping the gun here, but removes a level of depth if ok
    }
    // if >=1 position already selected, evaluate last position
    const last_position = selected_positions.at(-1);

    // clicking the same tile again submits the current selection instead of treating it as a bad adjacency
    if (coordEquals(clicked_position, last_position)) {
        if (!isStrand()) {
            deleteSelection();
            return;
        }

        const isSpan = isSpangram();
        for (let i = 0; i < selected_positions.length; i++) {
            const id = XYToid(selected_positions[i]);
            const el = document.getElementById(id);
            if (!el) continue;
            el.classList.remove('selected');
            if (isSpan) el.classList.add('spangram');
            else el.classList.add('correct');
        }
        selected_positions = [];
        updateInputText();

        words_found++;
        updateWordCount();
        if (words_found == num_words){
            gameOver = true;
            setInputMessage("You won! YIIIPPPIEEE!");
        }


        return;
    }

    // if selected position not adjacent to last, delete selection
    if (!isAdjacentPosition(clicked_position, last_position)) {
        deleteSelection();
        return;
    }

    // not clicking the same position adds the new tile
    selected_positions.push(clicked_position);
    tile.classList.add('selected');
    updateInputText();
    console.log('Tile added to selection at', clicked_position);
    return;
}

const idToXY = k => k.split('-').map(Number);
const XYToid = ([x, y]) => `${x}-${y}`;
const coordEquals = (a, b) => a[0] === b[0] && a[1] === b[1];

function updateInputText() {
    const inputEl = document.getElementById('input');
    if (!inputEl) return;
    if (gameOver) return;
    if (!selected_positions || selected_positions.length === 0) {
        inputEl.innerText = '';
        return;
    }
    let text = '';
    for (let i = 0; i < selected_positions.length; i++) {
        const id = XYToid(selected_positions[i]);
        const el = document.getElementById(id);
        if (!el) continue;
        text += el.innerText;
    }
    inputEl.innerText = text;
}

function setInputMessage(message) {
    const inputEl = document.getElementById('input');
    if (!inputEl) return;
    inputEl.innerText = message;
}

function updateWordCount() {
    const wordCountEl = document.getElementById('wordcount');
    if (!wordCountEl) return;
    wordCountEl.innerText = `${words_found} / ${num_words}`;
}

function isStrand(){
    // compare coordinates by value and ensure all selected positions belong to the same strand
    // and that the selection matches the full strand, not just a subset of it.
    if (selected_positions.length === 0) return false;

    let firstPosKey = null;
    for (let i = 0; i < selected_positions.length; i++) {
        const pos = selected_positions[i];
        let thisPosKey = null;
        for (const [word, coords] of Object.entries(strands)) {
            for (let k = 0; k < coords.length; k++) {
                if (coordEquals(coords[k], pos)) {
                    thisPosKey = word;
                    break;
                }
            }
            if (thisPosKey !== null) break;
        }
        if (i > 0 && thisPosKey !== firstPosKey) return false; // different strand found
        if (i === 0) firstPosKey = thisPosKey;
    }

    const fullCoords = strands[firstPosKey];
    if (!fullCoords || selected_positions.length !== fullCoords.length) {
        return false;
    }

    const letters = selected_positions
        .map(([x, y]) => {
            const el = document.getElementById(`${x}-${y}`);
            return el ? el.innerText : "";
        })
        .join("");

    return letters === firstPosKey;
}

function isSpangram(){
    if (!isStrand()) return false;

    const firstKey = Object.keys(strands)[0];
    if (!firstKey) return false;
    const firstCoords = strands[firstKey];
    for (let i = 0; i < firstCoords.length; i++) {
        if (coordEquals(firstCoords[i], selected_positions[0])) return true;
    }
    return false;
}

function isAdjacentPosition(pos1, pos2){
    const dx = Math.abs(pos1[0] - pos2[0]);
    const dy = Math.abs(pos1[1] - pos2[1]);
    // adjacent if max distance is exactly 1 (includes diagonals), not the same cell
    return Math.max(dx, dy) === 1;
}

function deleteSelection(){
    if (selected_positions.length == 0) {
        return
    }
    // Remove 'selected' class from all currently selected tiles and clear the list
    for (let i = 0; i < selected_positions.length; i++) {
        const id = XYToid(selected_positions[i]);
        const el = document.getElementById(id);
        if (el) el.classList.remove('selected');
    }
    selected_positions = [];
    updateInputText();
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
                const prev = coords[i - 1];

                if (!isAdjacentPosition(prev,coords[i])) {
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