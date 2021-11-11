import { TestBed } from '@angular/core/testing';
import { PassTurn } from '@app/game-logic/actions/pass-turn';
import { DEFAULT_TIME_PER_TURN } from '@app/game-logic/constants';
import { BoardService } from '@app/game-logic/game/board/board.service';
import { OfflineGame } from '@app/game-logic/game/games/solo-game/offline-game';
import { ObjectiveManagerService } from '@app/game-logic/game/objectives/objective-manager.service';
import { TimerService } from '@app/game-logic/game/timer/timer.service';
import { MessagesService } from '@app/game-logic/messages/messages.service';
import { Player } from '@app/game-logic/player/player';
import { User } from '@app/game-logic/player/user';
import { PointCalculatorService } from '@app/game-logic/point-calculator/point-calculator.service';
import { DictionaryService } from '@app/game-logic/validator/dictionary.service';

describe('PassTurn', () => {
    let game: OfflineGame;
    const player1: Player = new User('Tim');
    const player2: Player = new User('George');
    const randomBonus = false;
    const dict = new DictionaryService();
    beforeEach(() => {
        TestBed.configureTestingModule({ providers: [{ provide: DictionaryService, useValue: dict }] });
        const messageService = TestBed.inject(MessagesService);
        const timerService = TestBed.inject(TimerService);
        const pointCalulatorService = TestBed.inject(PointCalculatorService);
        const boardService = TestBed.inject(BoardService);
        const objectiveManager = TestBed.inject(ObjectiveManagerService);
        game = new OfflineGame(
            randomBonus,
            DEFAULT_TIME_PER_TURN,
            timerService,
            pointCalulatorService,
            boardService,
            messageService,
            objectiveManager,
        );
        game.players.push(player1);
        game.players.push(player2);
    });

    it('should create an instance', () => {
        expect(new PassTurn(new User('Tim'))).toBeTruthy();
    });

    it('should pass turn', () => {
        game.start();
        const beforePlayer: Player = game.getActivePlayer();
        const passAction = new PassTurn(beforePlayer);
        beforePlayer.play(passAction);
        const afterPlayer: Player = game.getActivePlayer();
        expect(beforePlayer.name).not.toBe(afterPlayer.name);
    });
});
