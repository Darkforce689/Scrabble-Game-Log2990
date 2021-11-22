/* eslint-disable dot-notation */
import { TestBed } from '@angular/core/testing';
import { CommandExecuterService } from '@app/game-logic/commands/command-executer/command-executer.service';
import { DEFAULT_TIME_PER_TURN } from '@app/game-logic/constants';
import { GameSettings } from '@app/game-logic/game/games/game-settings.interface';
import { OnlineGame } from '@app/game-logic/game/games/online-game/online-game';
import { DictionaryService } from '@app/game-logic/validator/dictionary.service';
import { LeaderboardService } from '@app/leaderboard/leaderboard.service';
import { JvHttpService } from '@app/services/jv-http.service';
import { GameSocketHandlerService } from '@app/socket-handler/game-socket-handler/game-socket-handler.service';
import { OnlineGameSettings } from '@app/socket-handler/interfaces/game-settings-multi.interface';
import { UserAuth } from '@app/socket-handler/interfaces/user-auth.interface';
import { GameManagerService } from './game-manager.service';

describe('GameManagerService', () => {
    let service: GameManagerService;
    const commandExecuterMock = jasmine.createSpyObj('CommandExecuterService', ['execute', 'resetDebug']);
    const leaderboardServiceMock = jasmine.createSpyObj('LeaderboardService', ['updateLeaderboard']);
    const botHttpService = jasmine.createSpyObj('JvHttpService', ['getDataInfo']);
    const dict = new DictionaryService();
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                { provide: DictionaryService, useValue: dict },
                { provide: CommandExecuterService, useValue: commandExecuterMock },
                { provide: LeaderboardService, useValue: leaderboardServiceMock },
                { provide: JvHttpService, useValue: botHttpService },
            ],
        });
        service = TestBed.inject(GameManagerService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should throw error if game is not created first', () => {
        expect(() => {
            service.startGame();
        }).toThrow(Error('No game created yet'));
    });

    it('should emit void on start game', () => {
        service.newGame$.subscribe((v: void) => {
            expect(v).toBeFalsy();
        });
        const gameSettings: GameSettings = {
            timePerTurn: 10,
            playerName: 'allo',
            botDifficulty: 'easy',
            randomBonus: false,
        };
        service.createGame(gameSettings);
        service.startGame();
        service.stopGame();
        expect().nothing();
    });

    it('should not start new game if game exists', () => {
        const gameSettings: GameSettings = {
            timePerTurn: 10,
            playerName: 'allo',
            botDifficulty: 'easy',
            randomBonus: false,
        };
        service.createGame(gameSettings);
        const gameSpy = spyOn(service, 'stopGame').and.callFake(() => {
            return false;
        });
        service.createGame(gameSettings);
        expect(gameSpy).toHaveBeenCalled();
    });

    it('should not start a game if its an online game', () => {
        const onlineGameSettings: OnlineGameSettings = {
            timePerTurn: DEFAULT_TIME_PER_TURN,
            playerName: 'p1',
            opponentName: 'p2',
            randomBonus: false,
            id: '0',
        };

        const userAuth: UserAuth = {
            playerName: 'p1',
            gameToken: '0',
        };

        service.joinOnlineGame(userAuth, onlineGameSettings);
        service.startGame();
        expect().nothing();
    });
});

describe('GameManagerService Online Edition', () => {
    let service: GameManagerService;
    let gameSocketHandler: GameSocketHandlerService;
    const commandExecuterMock = jasmine.createSpyObj('CommandExecuterService', ['execute', 'resetDebug']);
    const leaderboardServiceMock = jasmine.createSpyObj('LeaderboardService', ['updateLeaderboard']);
    const mockBotHttpService = jasmine.createSpyObj('JvHttpService', ['getDataInfo']);
    const dict = new DictionaryService();
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                { provide: DictionaryService, useValue: dict },
                { provide: CommandExecuterService, useValue: commandExecuterMock },
                { provide: LeaderboardService, useValue: leaderboardServiceMock },
                { provide: JvHttpService, useValue: mockBotHttpService },
            ],
        });
        service = TestBed.inject(GameManagerService);
        gameSocketHandler = TestBed.inject(GameSocketHandlerService);
    });

    it('should join an online game', () => {
        const onlineGameSettings: OnlineGameSettings = {
            timePerTurn: DEFAULT_TIME_PER_TURN,
            playerName: 'p1',
            opponentName: 'p2',
            randomBonus: false,
            id: '0',
        };

        const userAuth: UserAuth = {
            playerName: 'p1',
            gameToken: '0',
        };

        service.joinOnlineGame(userAuth, onlineGameSettings);
        const result = service['game'];
        expect(result).toBeInstanceOf(OnlineGame);
    });

    it('should stop game if offline game exist on join an online game', () => {
        const gameSettings: GameSettings = {
            timePerTurn: 10,
            playerName: 'allo',
            botDifficulty: 'easy',
            randomBonus: false,
        };

        service.createGame(gameSettings);
        const gameSpy = spyOn(service, 'stopGame').and.callThrough();
        const onlineGameSettings: OnlineGameSettings = {
            timePerTurn: DEFAULT_TIME_PER_TURN,
            playerName: 'p1',
            opponentName: 'p2',
            randomBonus: false,
            id: '0',
        };

        const userAuth: UserAuth = {
            playerName: 'p1',
            gameToken: '0',
        };

        service.joinOnlineGame(userAuth, onlineGameSettings);
        expect(gameSpy).toHaveBeenCalled();
    });

    it('should stop game if online game exist on join an online game', () => {
        const onlineGameSettings: OnlineGameSettings = {
            timePerTurn: DEFAULT_TIME_PER_TURN,
            playerName: 'p1',
            opponentName: 'p2',
            randomBonus: false,
            id: '0',
        };

        const userAuth: UserAuth = {
            playerName: 'p1',
            gameToken: '0',
        };

        const gameSpy = spyOn(service, 'stopGame').and.callThrough();

        service.joinOnlineGame(userAuth, onlineGameSettings);

        service.joinOnlineGame(userAuth, onlineGameSettings);
        expect(gameSpy).toHaveBeenCalled();
    });

    it('should throw error if there is no opponent', () => {
        const onlineGameSettings: OnlineGameSettings = {
            timePerTurn: DEFAULT_TIME_PER_TURN,
            playerName: 'p1',
            randomBonus: false,
            id: '0',
        };

        const userAuth: UserAuth = {
            playerName: 'p1',
            gameToken: '0',
        };

        expect(() => service.joinOnlineGame(userAuth, onlineGameSettings)).toThrowError('No opponent name was entered');
    });

    it('should test the disconnectedFromServerSubject subject', () => {
        gameSocketHandler['disconnectedFromServerSubject'].next();
        const result = service.disconnectedFromServer$.subscribe();
        expect(result).toBeTruthy();
    });

    it('should join an online game when you are the opponent', () => {
        const onlineGameSettings: OnlineGameSettings = {
            timePerTurn: DEFAULT_TIME_PER_TURN,
            playerName: 'p2',
            opponentName: 'p1',
            randomBonus: false,
            id: '0',
        };

        const userAuth: UserAuth = {
            playerName: 'p1',
            gameToken: '0',
        };

        service.joinOnlineGame(userAuth, onlineGameSettings);
        const result = service['game'];
        expect(result).toBeInstanceOf(OnlineGame);
    });

    it('should stopOnlineGame when onlineGame is undefined', () => {
        const onlineGameSettings: OnlineGameSettings = {
            timePerTurn: DEFAULT_TIME_PER_TURN,
            playerName: 'p2',
            opponentName: 'p1',
            randomBonus: false,
            id: '0',
        };
        const userAuth: UserAuth = {
            playerName: 'p1',
            gameToken: '0',
        };
        service.joinOnlineGame(userAuth, onlineGameSettings);
        const spy = spyOn(service['onlineChat'], 'leaveChatRoom');
        service['stopGame']();
        expect(spy).toHaveBeenCalled();
    });
});
