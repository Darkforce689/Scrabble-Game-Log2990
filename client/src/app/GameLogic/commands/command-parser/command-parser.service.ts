import { Injectable } from '@angular/core';
import { Command, CommandType } from '@app/GameLogic/commands/command.interface';
import {
    BOARD_DIMENSION,
    CHARACTER_H,
    CHARACTER_V,
    MAX_PLACE_LETTER_ARG_SIZE,
    MIN_PLACE_LETTER_ARG_SIZE,
    RACK_LETTER_COUNT,
} from '@app/GameLogic/constants';
import { Observable, Subject } from 'rxjs';

const INVALID_PLACE_LETTER = new RegExp('[^a-zA-Z]');
const INVALID_EXCHANGE_LETTER = new RegExp('[^a-z*]');
@Injectable({
    providedIn: 'root',
})
export class CommandParserService {
    private errorSyntax = 'erreur de syntax';
    private command$: Subject<Command> = new Subject();
    get parsedCommand$(): Observable<Command> {
        return this.command$;
    }

    createCommand(from: string, args: string[], commandType: CommandType): Command {
        const command = { from, type: commandType, args } as Command;
        return command;
    }

    sendCommand(command: Command) {
        this.command$.next(command);
    }

    parse(message: string, from: string): CommandType | undefined {
        const toVerify = message.split(' ').filter(Boolean);
        const commandCondition = toVerify[0];
        if (commandCondition[0] === '!') {
            const commandType = commandCondition as CommandType;
            if (Object.values(CommandType).includes(commandType)) {
                let args = toVerify.slice(1, toVerify.length);
                if (commandType === CommandType.Place) {
                    if (toVerify.length < 3) {
                        throw Error('mot ou emplacement manquant');
                    }
                    args = this.placeLetterFormatter(args);
                }
                if (commandType === CommandType.Exchange) {
                    this.exchangeLetterArgVerifier(args[0]);
                }
                const command = this.createCommand(from, args, commandCondition as CommandType);
                this.sendCommand(command);
                return commandCondition as CommandType;
            }
            const errorContent = commandCondition + ' est une entrée invalide';
            throw Error(errorContent);
        }
        return undefined;
    }

    placeLetterFormatter(args: string[]): string[] {
        if (args[0].length <= MAX_PLACE_LETTER_ARG_SIZE && args[0].length >= MIN_PLACE_LETTER_ARG_SIZE) {
            const row = args[0].charCodeAt(0);
            const col = this.colArgVerifier(args[0]);
            const direction = args[0].charCodeAt(args[0].length - 1);
            const word = args[1].normalize('NFD').replace(/\p{Diacritic}/gu, '');

            this.placeLetterArgVerifier(row, col, direction, word);

            args = [];
            args = [String.fromCharCode(row), String(col), String.fromCharCode(direction), word];
        } else {
            throw Error(this.errorSyntax + ': les paramètres sont invalides');
        }
        return args;
    }

    placeLetterArgVerifier(row: number, col: number, direction: number, word: string) {
        if (row > 'o'.charCodeAt(0) || row < 'a'.charCodeAt(0)) {
            throw Error(this.errorSyntax + ': ligne hors champ');
        }
        if (col > BOARD_DIMENSION) {
            throw Error(this.errorSyntax + ': colonne hors champ');
        }
        if (direction !== CHARACTER_H && direction !== CHARACTER_V) {
            throw Error(this.errorSyntax + ': direction invalide');
        }
        if (word.length < 2 || word.length > BOARD_DIMENSION || INVALID_PLACE_LETTER.test(word)) {
            throw Error(this.errorSyntax + ': mot invalide');
        }
    }

    colArgVerifier(arg1: string): number {
        let col;
        if (this.isNumeric(arg1[1]) && this.isNumeric(arg1[2]) && arg1.length === MAX_PLACE_LETTER_ARG_SIZE) {
            col = Number(arg1[1] + arg1[2]);
            return col;
        } else if (this.isNumeric(arg1[1]) && arg1.length === MIN_PLACE_LETTER_ARG_SIZE) {
            col = Number(arg1[1]);
            return col;
        }
        throw Error(this.errorSyntax + ': colonne invalide');
    }

    exchangeLetterArgVerifier(word: string) {
        if (INVALID_EXCHANGE_LETTER.test(word) || word === undefined) {
            throw Error('les paramètres sont invalides');
        }
        if (word.length > RACK_LETTER_COUNT) {
            throw Error('Commande impossible à réaliser: un maximum de 7 lettres peuvent être échangé');
        }
    }

    private isNumeric(value: string) {
        return /^\d+$/.test(value);
    }
}
