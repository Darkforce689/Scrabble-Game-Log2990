import { Injectable } from '@angular/core';
import { Observable, Subject, timer } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

const TIMER_STEP = 1000; // one second
@Injectable({
    providedIn: 'root',
})
export class TimerService {
    source: Observable<number>;
    readonly timePerStep: number = TIMER_STEP;

    start(interval: number) {
        const end$: Subject<void> = new Subject();
        const numberOfStep = Math.ceil(interval / TIMER_STEP);
        this.source = timer(TIMER_STEP, TIMER_STEP);
        this.source.pipe(takeUntil(end$)).subscribe((step) => {
            console.log((step + 1) * this.timePerStep);
            if (step >= numberOfStep - 1) {
                end$.next();
            }
        });
        return end$;
    }
}
