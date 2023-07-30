const rs = require('readline-sync');

let grid = [];
const gridSize = 3;
let guessArr = [];
let fleetSizeVariable = 2;
const fleetSizeConstant = 2;

const createGrid = (size) => {
    const alpha = ['A', 'B', 'C'];
    grid = [];
    for (let i = 0; i < size; i++) {
        grid.push([]);
        for (let j = 0; j < size; j++) {
            grid[i].push({ id: alpha[i] + (j + 1), hasShip: false });
        }
    }
    return grid;
};

const getRandomNum = (max) => {
    return Math.floor(Math.random() * max);
};

const createShipsFunction = (numberOfShips, gridSize) => {
    const alpha = ['A', 'B', 'C'];
    let col;
    let row;
    for (let i = 0; i < numberOfShips; i++) {
        col = getRandomNum(gridSize);
        row = getRandomNum(gridSize);
        // Check if the selected cell already has a ship
        if (grid[row][col].hasShip) {
            i--; // Retry for a unique position
        } else {
            grid[row][col].hasShip = true;
        }
    }
};

const checkIfShipIsHit = (guessed) => {
    const row = guessed.charCodeAt(0) - 'A'.charCodeAt(0);
    const col = parseInt(guessed.substring(1)) - 1;

    if (grid[row][col].hasShip) {
        console.log('You have hit a ship');
        fleetSizeVariable--;
        console.log(`you have this many ships left to hit: ${fleetSizeVariable}`);
        grid[row][col].hasShip = false; // Mark the ship as hit
    } else {
        console.log('You have missed');
    }
};

const askToPlayAgain = () => {
    if (rs.keyInYN('Do you want to play again? ')) {
        newGameLogic();
    } else {
        console.log(`Thanks for playing`);
    }
};

const getUserInput = () => {
    let guessed = rs.question('Enter a location to strike ');

    guessed = guessed.toUpperCase(); // Convert the input to uppercase

    if (guessArr.includes(guessed)) {
        console.log('already shot there');
        return getUserInput();
    }

    guessArr.push(guessed);
    return guessed;
};

const gameLoop = () => {
    fleetSizeVariable = fleetSizeConstant;
    guessArr = [];
    createGrid(gridSize); // Reset the grid here before starting a new game
    createShipsFunction(fleetSizeVariable, gridSize);
};

const newGameLogic = () => {
    console.log('Press any key to start the game.');
    rs.keyInPause();
    gameLoop();
    while (fleetSizeVariable > 0) {
        const guessed = getUserInput();
        checkIfShipIsHit(guessed);
    }
    askToPlayAgain();
};

newGameLogic();