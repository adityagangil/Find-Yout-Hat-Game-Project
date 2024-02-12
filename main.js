const prompt = require('prompt-sync')({ sigint: true });

const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';

class Field {
    constructor(field) {
        this._field = field;
        this._playerRow = 0;
        this._playerCol = 0;
        this._gameOver = false;
    }

    print() {
        for (let row of this._field) {
            console.log(row.join(''));
        }
    }

    static generateField(height, width, percentHoles) {
        const field = [];
        const totalTiles = height * width;
        let numHoles = Math.floor((percentHoles / 100) * totalTiles);

        for (let i = 0; i < height; i++) {
            const row = [];
            for (let j = 0; j < width; j++) {
                row.push(fieldCharacter);
            }
            field.push(row);
        }

        field[0][0] = pathCharacter; // Player start position

        // Place hat
        let hatRow = Math.floor(Math.random() * height);
        let hatCol = Math.floor(Math.random() * width);
        while (hatRow === 0 && hatCol === 0) {
            hatRow = Math.floor(Math.random() * height);
            hatCol = Math.floor(Math.random() * width);
        }
        field[hatRow][hatCol] = hat;

        // Place holes
        while (numHoles > 0) {
            const row = Math.floor(Math.random() * height);
            const col = Math.floor(Math.random() * width);
            if (field[row][col] === fieldCharacter && !(row === 0 && col === 0)) {
                field[row][col] = hole;
                numHoles--;
            }
        }

        return field;
    }

    move(direction) {
        switch (direction) {
            case 'up':
                this._playerRow -= 1;
                break;
            case 'down':
                this._playerRow += 1;
                break;
            case 'left':
                this._playerCol -= 1;
                break;
            case 'right':
                this._playerCol += 1;
                break;
            default:
                console.log('Invalid move!');
                break;
        }

        if (this._playerRow < 0 || this._playerRow >= this._field.length || this._playerCol < 0 || this._playerCol >= this._field[0].length) {
            console.log('You went outside the field! Game over.');
            this._gameOver = true;
        } else if (this._field[this._playerRow][this._playerCol] === hole) {
            console.log('You fell into a hole! Game over.');
            this._gameOver = true;
        } else if (this._field[this._playerRow][this._playerCol] === hat) {
            console.log('Congratulations! You found your hat!');
            this._gameOver = true;
        } else {
            this._field[this._playerRow][this._playerCol] = pathCharacter;
        }
    }

    get gameOver() {
        return this._gameOver;
    }
}

function playGame() {
    const height = 5;
    const width = 10;
    const percentHoles = 20;
    const field = Field.generateField(height, width, percentHoles);
    const myField = new Field(field);

    console.log('Find Your Hat Game!');
    console.log('Instructions: Enter "up", "down", "left", or "right" to move.');
    console.log('Try to find your hat (^) without falling into a hole (O) or going outside the field (░).');

    while (!myField.gameOver) {
        console.log();
        myField.print();
        const direction = prompt('Which way? ');
        myField.move(direction.toLowerCase());
    }
}

playGame();
