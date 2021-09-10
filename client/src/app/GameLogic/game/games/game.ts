import { Player } from '@app/GameLogic/player/player';
import { LetterBag } from '../letter-bag';


export class Game {
    static maxConsecutivePass = 6;
    letterBag: LetterBag;
    players: Player[];
    activePlayerIndex: number;
    consecutivePass: number;
    isEnded: boolean = false;

    constructor(public timePerTurn:number){


    }

    startGame(): void {
        this.pickFirstPlayer();
        this.startTurn();
    }

    pickFirstPlayer() {
        const max = this.players.length;
        const firstPlayer = Math.floor(Math.random() * max);
        this.activePlayerIndex = firstPlayer;
    }

    allocateGameLetters() {
        for (const player of this.players) {
            player.letterRack = this.letterBag.drawEmptyRackLetters();
            player.displayGameLetters();
            this.letterBag.displayNumberGameLettersLeft();
        }
    }

    startTurn() {
        const end$ = 
        
    }
    
    endOfTurn(){

    }

    isEndOfGame() {
        return 0; //this.letterBag.gameLetters.length === 0 || this.consecutivePass === Game.maxConsecutivePass;
    }

    onEndOfGame() {}
}
