const gridSize = 10;
let ships = [
    { name: 'Carrier', units: 5, CoordOfShip: [] },
    { name: 'Battleship', units: 4, CoordOfShip: [] },
    { name: 'Cruiser', units: 3, CoordOfShip: [] },
    { name: 'Submarine', units: 3, CoordOfShip: [] },
    { name: 'Destroyer', units: 2, CoordOfShip: [] }
];

let guessArr = [];
let fleetSizeVariable = 5;

const rs = require('readline-sync');

const createGrid = () => {
    const alpha = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

    const grid = [];
    for (let i = 0; i < gridSize; i++) {
        grid.push([]);
        for (let j = 0; j < gridSize; j++) {
            grid[i].push(alpha[i] + (j + 1));
        }
    }

    return grid;
};

const getRandomNum = () => {
    return Math.floor(Math.random() * gridSize);
};

const coinFlip = () => {
    return Math.floor(Math.random() * 2);
};

const hasDuplicateCoord = (coords) => {
    for (const ship of ships) {
        for (const coord of coords) {
            if (ship.CoordOfShip.includes(coord)) {
                return true;
            }
        }
    }
    return false;
};

const placeShip = (size) => {
    const alpha = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
    let x, y, direction, firstCoord, coord;

    do {
        x = getRandomNum();
        y = getRandomNum();
        direction = coinFlip();
        firstCoord = alpha[x] + (y + 1);
        coord = [firstCoord];

        for (let i = 1; i < size; i++) {
            if (direction === 0) {
                if (y + 1 < gridSize) {
                    y++;
                } else {

                    coord = [];
                    break;
                }
            } else {
                if (x + 1 < gridSize) {
                    x++;
                } else {

                    coord = [];
                    break;
                }
            }

            const newCoord = alpha[x] + (y + 1);
            if (hasDuplicateCoord([newCoord])) {

                coord = [];
                break;
            } else {
                coord.push(newCoord);
            }
        }
    } while (coord.length !== size || hasDuplicateCoord(coord));

    return coord;
};

const createShips = () => {
    ships.forEach((ship) => {
        const CoordOfShip = placeShip(ship.units);
        ship.CoordOfShip = CoordOfShip;
        console.log(`${ship.name} coordinates: ${ship.CoordOfShip.join(', ')}`);
    });

    console.log("Fleet of Ships:");
    ships.forEach((ship) => {
        console.log(`${ship.name}: ${ship.units}`);
    });
};

const checkIfShipIsHit = (guessed) => {
    for (const ship of ships) {
        if (ship.CoordOfShip.includes(guessed)) {
            console.log('You have hit a ship');

            const index = ship.CoordOfShip.indexOf(guessed);
            ship.CoordOfShip.splice(index, 1); // Remove the hit coordinate

            if (ship.CoordOfShip.length === 0) {
                console.log(`You have sunk the ${ship.name}!`);
                fleetSizeVariable--;
                console.log(`You have ${fleetSizeVariable} ships left to sink.`);
            } else {
                console.log(`The ${ship.name} has been hit but not sunk.`);
            }

            return;
        }
    }
    console.log('You have missed');
};


const getUserInput = () => {
    let guessed = rs.question('Enter a location to strike: ');

    while (!isValidLocation(guessed) || guessArr.includes(guessed)) {
        if (!isValidLocation(guessed)) {
            console.log('Invalid location. Please enter a valid location.');
        } else if (guessArr.includes(guessed)) {
            console.log('You already shot there');
        }
        guessed = rs.question('Enter a location to strike: ');
    }

    guessArr.push(guessed);
    return guessed;
};

const isValidLocation = (location) => {
    const alpha = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
    const row = location.charAt(0).toUpperCase();
    const col = parseInt(location.substring(1));

    return alpha.includes(row) && !isNaN(col) && col >= 1 && col <= 10;
};

const playGame = () => {
    createShips();

    while (fleetSizeVariable > 0) {
        const guessed = getUserInput();
        checkIfShipIsHit(guessed);
    }

    console.log('Game Over');
};

const newGameLogic = () => {
    let playAgain = 'yes';

    while (playAgain.toLowerCase() === 'yes' || playAgain.toLowerCase() === 'y') {
        playGame();
        playAgain = rs.question('Do you want to play again? (yes/no): ');
    }

    console.log('Goodbye! Thanks for playing!');
};

newGameLogic();