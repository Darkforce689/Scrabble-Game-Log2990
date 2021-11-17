import { Action } from '@app/game-logic/actions/action';
import { BOARD_MAX_POSITION, BOARD_MIN_POSITION, EMPTY_CHAR, N_CORNERS } from '@app/game-logic/constants';
import { Objective } from '@app/game-logic/game/objectives/objectives/objective';
import { ObjectiveUpdateParams } from '@app/game-logic/game/objectives/objectives/objective-update-params.interface';

export class FourCorners extends Objective {
    name = 'Quatre Coins';
    description = 'Être le joueur à remplir le 4e coin de la planche de jeu';
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    points = 30;

    protected updateProgression(action: Action, params: ObjectiveUpdateParams) {
        let newProgression = 0;
        const grid = params.previousGrid;

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
