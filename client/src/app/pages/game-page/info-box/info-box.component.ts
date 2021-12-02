import { Component, OnInit } from '@angular/core';
import { GameInfoService } from '@app/game-logic/game/game-info/game-info.service';
import { Observable } from 'rxjs';
import {  map } from 'rxjs/operators';

export const MILISECONDS_IN_MINUTE = 60000;
export const FLOAT_TO_PERCENT = 100;
@Component({
    selector: 'app-info-box',
    templateUrl: './info-box.component.html',
    styleUrls: ['./info-box.component.scss'],
})
export class InfoBoxComponent implements OnInit {
    timeLeft$: Observable<number | undefined>;
    timeLeftPercent$: Observable<number | undefined>;

    constructor(private info: GameInfoService) {}

    ngOnInit() {
        this.timeLeft$ = this.info.timeLeftForTurn.pipe(
            map((value: number | undefined) => {
                if (value === undefined) {
                    return;
                }
                return value;
            }),
        );
        this.timeLeftPercent$ = this.info.timeLeftPercentForTurn.pipe(
            map((value: number | undefined) => {
                if (value === undefined) {
                    return;
                }
                return value * FLOAT_TO_PERCENT;
            }),
        );
    }

    showWinner(): string {
        const winner = this.info.winner;
        let winnerString = '';
        if (winner.length !== 1) {
            winnerString = winner[0].name + ' et ' + winner[1].name;
        } else {
            winnerString = winner[0].name;
        }
        return winnerString;
    }

    get numberOfLettersRemaining(): number {
        return this.info.numberOfLettersRemaining;
    }

    get isEndOfGame(): boolean {
        return this.info.isEndOfGame;
    }
}
