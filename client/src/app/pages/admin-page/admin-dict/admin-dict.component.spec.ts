import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';
import { EditDictDialogComponent } from '@app/components/modals/edit-dict/edit-dict.component';
import { AdminDictComponent, DictInfo } from '@app/pages/admin-page/admin-dict/admin-dict.component';
import { DictHttpService } from '@app/services/dict-http.service';
import { of } from 'rxjs';

describe('admin-dictionary component', () => {
    let component: AdminDictComponent;
    let fixture: ComponentFixture<AdminDictComponent>;
    let dictHttpServiceMock: jasmine.SpyObj<DictHttpService>;
    let matDialog: jasmine.SpyObj<MatDialog>;
    beforeEach(async () => {
        // eslint-disable-next-line no-unused-vars
        dictHttpServiceMock = jasmine.createSpyObj('DictHttpService', ['uploadDict', 'getDict', 'getDictInfoList', 'deleteDict']);
        dictHttpServiceMock.getDictInfoList.and.returnValue(of([{ title: 'test', description: 'test', canEdit: true }]));
        matDialog = jasmine.createSpyObj('MatDialog', ['open']);
        jasmine.createSpyObj('AdminDictComponent', ['ngOnInit']);
        await TestBed.configureTestingModule({
            declarations: [AdminDictComponent],
            providers: [
                { provide: DictHttpService, useValue: dictHttpServiceMock },
                { provide: MatDialog, useValue: matDialog },
            ],
        });

        fixture = TestBed.createComponent(AdminDictComponent);
        jasmine.createSpyObj('fixture.componentInstance', ['ngOnInit']);
        component = fixture.componentInstance;
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });

    it('loadFile should open alert dialog if not file is not correct...', async () => {
        const dataTransfer = new DataTransfer();
        const myString = `{
            "title": "test",
            "description": "test",
            "words": ["allo"]
        }`;
        dataTransfer.items.add(new File([myString], 'test.json'));

        const inputDebugEl = fixture.debugElement.query(By.css('input[type=file]'));
        inputDebugEl.nativeElement.files = dataTransfer.files;

        inputDebugEl.nativeElement.dispatchEvent(new InputEvent('change'));
        const dummyDict = of([{ title: 'test', description: 'test', words: ['test'], id: 1 }]);
        dictHttpServiceMock.getDict.and.returnValue(dummyDict);
        fixture.detectChanges();

        const dummyAnswer = of(false);
        dictHttpServiceMock.uploadDict.and.returnValue(dummyAnswer);
        await component.loadFile();
        expect(matDialog.open).toHaveBeenCalled();
    });

    it('loadFile should not open alert dialog if file is correct', async () => {
        const dataTransfer = new DataTransfer();
        const myString = `{
            "title": "test",
            "description": "test",
            "words": ["allo"]
        }`;
        dataTransfer.items.add(new File([myString], 'test.json'));

        const inputDebugEl = fixture.debugElement.query(By.css('input[type=file]'));
        inputDebugEl.nativeElement.files = dataTransfer.files;

        inputDebugEl.nativeElement.dispatchEvent(new InputEvent('change'));
        const dummyDict = of([{ title: 'test', description: 'test', words: ['test'], id: 1 }]);
        dictHttpServiceMock.getDict.and.returnValue(dummyDict);
        fixture.detectChanges();

        const dummyAnswer = of(true);
        dictHttpServiceMock.uploadDict.and.returnValue(dummyAnswer);
        await component.loadFile();
        expect(matDialog.open).not.toHaveBeenCalled();
    });

    it('showUpdateMenu should open dialog', () => {
        const dictInfoMock: DictInfo = { title: 'test', description: 'test', canEdit: true };

        matDialog.open.and.returnValue({
            afterClosed: () => {
                return of({});
            },
            close: () => {
                return;
            },
        } as MatDialogRef<EditDictDialogComponent>);
        component.showUpdateMenu(dictInfoMock);
        expect(matDialog.open).toHaveBeenCalled();
    });

    it('deleteDict should call http service', () => {
        const dictInfoMock: DictInfo = { title: 'test', description: 'test', canEdit: true };
        component.deleteDict(dictInfoMock);
        expect(dictHttpServiceMock.deleteDict).toHaveBeenCalledWith(dictInfoMock.title);
    });
});
