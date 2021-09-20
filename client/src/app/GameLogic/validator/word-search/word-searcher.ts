import { PlaceLetter } from '@app/GameLogic/actions/place-letter';
import { Board } from '@app/GameLogic/game/board';
import { Tile } from '@app/GameLogic/game/tile';
import { DictionaryService } from '../dictionary.service';

export class WordSearcher {
    listOfValidWord: string[] = [];
    neighbours: [number, number][];
    grid: Tile[][];
    placementIsValid: boolean = true;

    constructor(board: Board, private dictionaryService: DictionaryService) {
        this.grid = board.grid;
    }

    //Si tous les mots formes sont valides return true;
    validatePlacement(action: PlaceLetter): boolean {
        this.searchAdjacentWords(action);
        return this.placementIsValid;
    }
    get listOfWords() {
        if (this.placementIsValid) {
            return this.listOfValidWord;
        } else {
            throw Error('Can"t get the neighbours because placement is invalid');
        }
    }
    searchAdjacentWords(action: PlaceLetter) {
        const startX = action.placement.x;
        const startY = action.placement.y;
        const direction = action.placement.direction;
        if (direction === 'H') {
            const word = this.getWordHorizontal(startX, startY);
            this.addWord(word);
        }

        if (direction === 'V') {
            const word = this.getWordVertical(startX, startY);
            this.addWord(word);
        }

        if (direction === 'H') {
            let neighbourSet = new Set(this.neighbours);
            for (const neighbour of neighbourSet) {
                const word = this.getWordVertical(neighbour[0], neighbour[1]);
                this.addWord(word);
            }
        }

        if (direction === 'V') {
            let neighbourSet = new Set(this.neighbours);
            for (const neighbour of neighbourSet) {
                const word = this.getWordHorizontal(neighbour[0], neighbour[1]);
                this.addWord(word);
            }
        }
    }

    addWord(word: Tile[]) {
        const wordString = this.tileToString(word).toLowerCase();
        if (this.dictionaryService.isWordInDict(wordString)) {
            this.listOfValidWord.push(wordString);
        }
        // } else {
        //     this.placementIsValid = false;
        //     throw Error('The word ' + wordString + ' is not in the current dictionary. Placement is invalid');
        // }
    }

    tileToString(word: Tile[]): string {
        let wordTemp: string = '';
        word.forEach((tile) => {
            wordTemp = wordTemp.concat(tile.letterObject.char.valueOf());
        });
        return wordTemp;
    }

    getWordVertical(x: number, y: number) {
        let word: Tile[] = [];
        let currentTile = this.grid[y][x];
        while (currentTile.letterObject.char !== ' ') {
            y += 1;
            currentTile = this.grid[y][x];
        }
        y -= 1;
        const firstLetter = this.grid[y][x];
        currentTile = firstLetter;
        while (currentTile.letterObject.char !== ' ') {
            if (typeof (currentTile.letterObject === undefined)) {
                throw Error('LetterObject undefined');
            }
            word.push(currentTile);
            if (this.grid[y][x - 1].letterObject.char !== ' ') {
                this.neighbours.push([x - 1, y]);
            } else if (this.grid[y][x + 1].letterObject.char !== ' ') {
                this.neighbours.push([x + 1, y]);
            }
            y += 1;
            currentTile = this.grid[y][x];
        }
        console.log('WordV: ', word);
        return word;
    }

    getWordHorizontal(x: number, y: number) {
        let word: Tile[] = [];
        let currentTile = this.grid[y][x];
        while (currentTile.letterObject.char !== ' ' && x >= 0 && y >= 0) {
            currentTile = this.grid[y][x];
            x -= 1;
        }
        x += 1;
        const firstLetter = this.grid[y][x];
        currentTile = firstLetter;
        console.log('current:', currentTile);
        while (currentTile.letterObject.char !== ' ') {
            if (typeof (currentTile.letterObject === undefined)) {
                throw Error('LetterObject undefined');
            }
            word.push(currentTile);
            if (this.grid[y - 1][x].letterObject.char !== ' ') {
                this.neighbours.push([x, y - 1]);
            } else if (this.grid[y + 1][x].letterObject.char !== ' ') {
                this.neighbours.push([x, y + 1]);
            }
            x += 1;
            currentTile = this.grid[y][x];
        }
        console.log('WordH: ', word);
        return word;
    }
}
