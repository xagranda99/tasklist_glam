import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Time } from '../models/time.model';

@Injectable({
  providedIn: 'root'
})
export class TimeService {
  constructor(private apiService: ApiService) {}

  getTimes(taskId: string): Observable<Time[]> {
    return this.apiService.get<Time[]>(`/tasks/${taskId}/times`);
  }

  createTime(taskId: string, time: Omit<Time, 'id'>): Observable<Time> {
    return this.apiService.post<Time>(`/tasks/${taskId}/times`, time);
  }

  updateTime(taskId: string, timeId: string, time: Partial<Time>): Observable<Time> {
    return this.apiService.put<Time>(`/tasks/${taskId}/times/${timeId}`, time);
  }

  deleteTime(taskId: string, timeId: string): Observable<void> {
    return this.apiService.delete<void>(`/tasks/${taskId}/times/${timeId}`);
  }
}
