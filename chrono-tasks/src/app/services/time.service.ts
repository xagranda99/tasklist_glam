import { Injectable } from '@angular/core';
import { Observable, forkJoin, of } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { ApiService } from './api.service';
import { Time } from '../models/time.model';
import { TaskService } from './task.service';

@Injectable({
  providedIn: 'root'
})
export class TimeService {
  constructor(
    private apiService: ApiService,
    private taskService: TaskService
  ) {}

  getTimes(taskId: string): Observable<Time[]> {
    return this.apiService.get<Time[]>(`/tasks/${taskId}/times`);
  }

  createTime(taskId: string, time: Omit<Time, 'id'>): Observable<Time> {
    // First, stop any active times across all tasks
    return this.stopAllActiveTimes().pipe(
      switchMap(() => {
        return this.apiService.post<Time>(`/tasks/${taskId}/times`, time);
      })
    );
  }

  updateTime(taskId: string, timeId: string, time: Partial<Time>): Observable<Time> {
    return this.apiService.put<Time>(`/tasks/${taskId}/times/${timeId}`, time);
  }

  deleteTime(taskId: string, timeId: string): Observable<void> {
    return this.apiService.delete<void>(`/tasks/${taskId}/times/${timeId}`);
  }

  private stopAllActiveTimes(): Observable<any> {
    // Get all tasks with their times
    return this.taskService.getTasks(true).pipe(
      switchMap(tasks => {
        const activeTimes = tasks
          .flatMap(task => task.times || [])
          .filter(time => time.end_date === null);

        if (activeTimes.length === 0) {
          return of(null);
        }

        // Stop all active times
        const stopRequests = activeTimes.map(activeTime => {
          const now = new Date().toISOString();
          const beginDate = new Date(activeTime.begin_date);
          const endDate = new Date(now);
          const spentTime = Math.floor((endDate.getTime() - beginDate.getTime()) / 1000);

          return this.updateTime(
            tasks.find(task => task.times?.some(t => t.id === activeTime.id))!.id,
            activeTime.id,
            {
              end_date: now,
              spent_time: spentTime
            }
          );
        });

        return forkJoin(stopRequests);
      })
    );
  }
}
