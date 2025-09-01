import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, interval, map, startWith } from 'rxjs';
import { Time } from '../models/time.model';
import { Task } from '../models/task.model';

export interface ActiveTime {
  time: Time;
  task: Task;
  elapsedSeconds: number;
}

@Injectable({
  providedIn: 'root'
})
export class CurrentTimeService {
  private activeTimeSubject = new BehaviorSubject<ActiveTime | null>(null);
  public activeTime$ = this.activeTimeSubject.asObservable();

  private timer$ = interval(1000).pipe(
    startWith(0),
    map(() => {
      const activeTime = this.activeTimeSubject.value;
      if (activeTime) {
        const now = new Date();
        const beginDate = new Date(activeTime.time.begin_date);
        const elapsedSeconds = Math.floor((now.getTime() - beginDate.getTime()) / 1000);
        
        return {
          ...activeTime,
          elapsedSeconds
        };
      }
      return null;
    })
  );

  constructor() {}

  setActiveTime(time: Time, task: Task): void {
    const activeTime: ActiveTime = {
      time,
      task,
      elapsedSeconds: 0
    };
    this.activeTimeSubject.next(activeTime);
  }

  clearActiveTime(): void {
    this.activeTimeSubject.next(null);
  }

  getTimerObservable(): Observable<ActiveTime | null> {
    return this.timer$;
  }

  getCurrentTime(): ActiveTime | null {
    return this.activeTimeSubject.value;
  }
}
