import { Action } from '@app/game-logic/actions/action';
import { BOARD_MAX_POSITION, BOARD_MIN_POSITION, EMPTY_CHAR, N_CORNERS } from '@app/game-logic/constants';
import { Game } from '@app/game-logic/game/games/game';
import { SpecialOfflineGame } from '@app/game-logic/game/games/special-games/special-offline-game';
import { Objective } from '@app/game-logic/game/objectives/objectives/objective';
export class FourCorners extends Objective {
    name = 'Quatre Coins';
    description = 'Être le joueur à remplir le 4e coin de la planche de jeu';
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    points = 30;

    updateProgression(action: Action, game: Game) {
        let newProgression = 0;
        const grid = (game as SpecialOfflineGame).board.grid;

        if (grid[BOARD_MIN_POSITION][BOARD_MIN_POSITION].letterObject.char !== EMPTY_CHAR) {
            newProgression += 1 / N_CORNERS;
        }

        if (grid[BOARD_MAX_POSITION][BOARD_MIN_POSITION].letterObject.char !== EMPTY_CHAR) {
            newProgression += 1 / N_CORNERS;
        }

        if (grid[BOARD_MIN_POSITION][BOARD_MAX_POSITION].letterObject.char !== EMPTY_CHAR) {
            newProgression += 1 / N_CORNERS;
        }

        if (grid[BOARD_MAX_POSITION][BOARD_MAX_POSITION].letterObject.char !== EMPTY_CHAR) {
            newProgression += 1 / N_CORNERS;
        }

        this.progression = newProgression;
    }
}