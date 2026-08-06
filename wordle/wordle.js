
var height = 6; // Number of guesses
var width = 5; // Length of the word

var row = 0; // Current guess row
var col = 0; // Current letter column

var gameOver = false; // Game over flag
var word = "TWINS"; // The word to guess

window.onload = function () {
    initialize();
};

function initialize() {
    // word = pickRandomWord();

    // Create the grid for guesses
    for (let r = 0; r < height; r++) {
        for (let c = 0; c < width; c++) {
            let tile = document.createElement("span");
            tile.id = r.toString() + "-" + c.toString();
            tile.classList.add("tile");
            tile.innerText = "";
            document.getElementById("board").appendChild(tile);
        }
    }

    // Create the key board
    let keyboard = [
        ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
        ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
        ["Enter", "Z", "X", "C", "V", "B", "N", "M", "⌫"]
    ]

    for (let i = 0; i < keyboard.length; i++) {
        let currRow = keyboard[i];
        let keyboardRow = document.createElement("div");
        keyboardRow.classList.add("keyboard-row");

        for (let j = 0; j < currRow.length; j++) {
            let keyTile = document.createElement("div");

            let key = currRow[j];
            keyTile.innerText = key;
            if (key == "Enter") {
                keyTile.id = "Enter";
            }
            else if (key == "⌫") {
                keyTile.id = "Backspace";
            }
            else if ("A" <= key && key <= "Z") {
                keyTile.id = key;
            }

            keyTile.addEventListener("click", processKey);

            if (key == "Enter") {
                keyTile.classList.add("enter-key-tile");
            } else {
                keyTile.classList.add("key-tile");
            }
            keyboardRow.appendChild(keyTile);
        }
       document.getElementById("keyboard").appendChild(keyboardRow)
    }

    document.addEventListener("keyup", (e) => {
        processInput(e);
    });
}

function processKey() {
    let key = this.id;
    if (key === "Backspace") key = "Backspace";
    if (key === "Enter") key = "Enter";

    let e = { key: key, code: this.id };
    processInput(e);
}

function processInput(e) {
    if (gameOver) return;
    const key = e.key.toUpperCase();

    if (key.length === 1 && key >= "A" && key <= "Z") {
        if (col < width) {
            let currentTile = document.getElementById(row.toString() + "-" + col.toString());
            if (currentTile.innerText == "") {
                currentTile.innerText = key;
                col += 1;
            }
        }
    }
    else if (e.key == "Backspace") {
        if (0 < col && col <= width) {
            col -= 1;
        }
        let currentTile = document.getElementById(row.toString() + "-" + col.toString());
        currentTile.innerText = "";
    }
    else if (e.key == "Enter") {
        if (col == width) {
            update();
        }
        else {
            document.getElementById("answer").innerText = "Not enough letters";
        }
    }

    if (!gameOver && row == height) {
        gameOver = true;
        document.getElementById("answer").innerText = word + " is the correct word!";
    }
}

function update() {
    let guess = "";
    document.getElementById("answer").innerText = "";

    // string up the guess word
    for (let c = 0; c < width; c++) {
        let currentTile = document.getElementById(row.toString() + "-" + c.toString());
        let letter = currentTile.innerText;
        guess += letter;
    }

    guess = guess.toUpperCase();
    if (!validWords.includes(guess)) {
        document.getElementById("answer").innerText = "Not in word list";
        return;
    }

    
    // start processing game
    let correct = 0;

    let letterCount = {};
    for (let i = 0; i < word.length; i++) {
        let letter = word[i];
        if (letterCount[letter]) {
            letterCount[letter] += 1;
        } else {
            letterCount[letter] = 1;
        }
    }

    // first iteration, check for correct letters in correct position
    for (let c = 0; c < width; c++) {
        let currentTile = document.getElementById(row.toString() + "-" + c.toString());
        let letter = currentTile.innerText;

        if (word[c] == letter) {
            currentTile.classList.add("correct");

            let keyTile = document.getElementById(letter);
            keyTile.classList.remove("present");
            keyTile.classList.add("correct");

            correct += 1;
            letterCount[letter] -= 1;
        }

        if (correct == width) {
            document.getElementById("answer").innerText = word + " is correct!\nYIPPIIIEE!";
            gameOver = true;
        }
    }

    // second iteration, check for correct letters in wrong position and absent ones
    for (let c = 0; c < width; c++) {
        let currentTile = document.getElementById(row.toString() + "-" + c.toString());
        let letter = currentTile.innerText;

        if (!currentTile.classList.contains("correct")) {
            if (word.includes(letter) && letterCount[letter] > 0) {
                currentTile.classList.add("present");
                let keyTile = document.getElementById(letter);
                if (!keyTile.classList.contains("correct")) {
                    keyTile.classList.add("present");
                }
                letterCount[letter] -= 1;
            }
            else {
                currentTile.classList.add("absent");
                let keyTile = document.getElementById(letter);
                keyTile.classList.add("absent");
            }
        }
    }

    row += 1;
    col = 0;
}

function pickRandomWord() {
    const index = Math.floor(Math.random() * validWords.length);
    return validWords[index];
}

