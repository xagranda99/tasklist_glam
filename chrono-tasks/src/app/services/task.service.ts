import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiService } from './api.service';
import { Task } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  constructor(private apiService: ApiService) {}

  getTasks(expanded: boolean = false): Observable<Task[]> {
    const endpoint = expanded ? '/tasks?expanded=times' : '/tasks';
    return this.apiService.get<Task[]>(endpoint).pipe(
      map(tasks => tasks.map(task => ({
        ...task,
        times: task.times || [] // Asegurar que times siempre sea un array
      })))
    );
  }

  getTask(id: string): Observable<Task> {
    // La API real no soporta GET /tasks/{id}, usamos filtro por ID
    return this.apiService.get<Task[]>(`/tasks?id=${id}`).pipe(
      map(tasks => {
        if (tasks.length === 0) {
          throw new Error(`Task with id ${id} not found`);
        }
        const task = tasks[0];
        return {
          ...task,
          times: task.times || [] // Asegurar que times siempre sea un array
        };
      })
    );
  }

  createTask(task: Omit<Task, 'id'>): Observable<Task> {
    return this.apiService.post<Task>('/tasks', task).pipe(
      map(task => ({
        ...task,
        times: task.times || [] // Asegurar que times siempre sea un array
      }))
    );
  }

  updateTask(id: string, task: Partial<Task>): Observable<Task> {
    return this.apiService.put<Task>(`/tasks/${id}`, task).pipe(
      map(task => ({
        ...task,
        times: task.times || [] // Asegurar que times siempre sea un array
      }))
    );
  }

  deleteTask(id: string): Observable<void> {
    return this.apiService.delete<void>(`/tasks/${id}`);
  }
}
