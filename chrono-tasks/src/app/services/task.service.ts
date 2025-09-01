import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Task } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  constructor(private apiService: ApiService) {}

  getTasks(expanded: boolean = false): Observable<Task[]> {
    const endpoint = expanded ? '/tasks?expanded=times' : '/tasks';
    return this.apiService.get<Task[]>(endpoint);
  }

  getTask(id: string): Observable<Task> {
    return this.apiService.get<Task>(`/tasks/${id}`);
  }

  createTask(task: Omit<Task, 'id'>): Observable<Task> {
    return this.apiService.post<Task>('/tasks', task);
  }

  updateTask(id: string, task: Partial<Task>): Observable<Task> {
    return this.apiService.put<Task>(`/tasks/${id}`, task);
  }

  deleteTask(id: string): Observable<void> {
    return this.apiService.delete<void>(`/tasks/${id}`);
  }
}
