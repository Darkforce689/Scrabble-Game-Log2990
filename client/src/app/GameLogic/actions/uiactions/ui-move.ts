import { Action } from '@app/GameLogic/actions/action';
import { UIAction } from '@app/GameLogic/actions/uiactions/ui-action';

export class UIMove implements UIAction {
    receiveKey(key: string): void {
        throw new Error('Method not implemented.');
    }
    create(): Action {
        throw new Error('Method not implemented.');
    }
}
