import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddDictDialogComponent } from '@app/components/modals/add-dict-dialog/add-dict-dialog.component';
import { AlertDialogComponent } from '@app/components/modals/alert-dialog/alert-dialog.component';
import { EditDictDialogComponent } from '@app/components/modals/edit-dict/edit-dict.component';
import { Dictionary } from '@app/game-logic/validator/dictionary';
import { DictHttpService } from '@app/services/dict-http.service';

export interface DictInfo {
    title: string;
    description: string;
    canEdit: boolean;
}

@Component({
    selector: 'app-admin-dict',
    templateUrl: './admin-dict.component.html',
    styleUrls: ['./admin-dict.component.scss'],
})
export class AdminDictComponent implements OnInit {
    listDict: Dictionary[];
    selectedFile: string = '';
    displayedColumns: string[] = ['position', 'name', 'weight', 'edit', 'delete'];

    dictDataSource: DictInfo[];
    dictDisplayedColumns: string[] = ['title', 'description', 'edit', 'delete'];

    constructor(private readonly dictHttpService: DictHttpService, private dialog: MatDialog) {}

    ngOnInit(): void {
        this.updateDictMap();
    }

    // TODO remove unused function when dialog will be ready
    async loadFile() {
        const input = document.getElementById('fileInput') as HTMLInputElement;
        const file = input.files![0];
        this.selectedFile = '';
        const dict = await this.readFile(file);
        this.uploadDictionary(dict);
    }

    showUpdateMenu(dict: DictInfo): void {
        this.dialog
            .open(EditDictDialogComponent, { width: '250px', data: dict })
            .afterClosed()
            .subscribe(() => {
                this.updateDictMap();
            });
    }

    showAddMenu(): void {
        // TODO change AlertDialogComponent to AddDictionaryDialog
        this.dialog
            .open(AddDictDialogComponent, {
                width: '250px',
            })
            .afterClosed()
            .subscribe(() => {
                this.updateDictMap();
            });
    }

    async deleteDict(dict: DictInfo) {
        this.dictHttpService.deleteDict(dict.title).subscribe(() => {
            this.updateDictMap();
        })
    }

    showSelectedFile() {
        const input = document.getElementById('fileInput') as HTMLInputElement;
        this.selectedFile = input.files![0].name;
    }

    private async readFile(file: File): Promise<Dictionary> {
        const tempFileReader = new FileReader();
        return new Promise((resolve) => {
            tempFileReader.onload = (res) => {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                const resultString = res.target!.result;
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                const dictionary: Dictionary = JSON.parse(resultString!.toString());
                resolve(dictionary);
            };
            tempFileReader.readAsText(file);
        });
    }

    private uploadDictionary(dict: Dictionary): void {
        this.dictHttpService.uploadDict(dict).subscribe((value) => {
            if (!value) {
                this.dialog.open(AlertDialogComponent, {
                    width: '250px',
                    data: {
                        message: 'Erreur de lecture du fichier',
                        button1: 'Ok',
                        button2: '',
                    },
                });
            } else {
                this.updateDictMap();
            }
        });
    }

    private updateDictMap(): void {
        this.dictHttpService.getDictInfoList().subscribe((res) => {
            const list = res as DictInfo[];
            this.dictDataSource = list;
        });
    }
}