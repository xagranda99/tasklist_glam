import { Injectable } from '@angular/core';
import { Observable, catchError, of, switchMap } from 'rxjs';
import { ApiService } from './api.service';
import { RequestQueueService } from './queue/request-queue.service';
import { Time } from '../models/time.model';

@Injectable({
  providedIn: 'root'
})
export class TimeService {
  constructor(
    private apiService: ApiService,
    private requestQueue: RequestQueueService
  ) {}

  getTimes(taskId: string): Observable<Time[]> {
    return this.apiService.get<Time[]>(`/tasks/${taskId}/times`);
  }

  createTime(taskId: string, time: Omit<Time, 'id'>): Observable<Time> {
    return this.apiService.post<Time>(`/tasks/${taskId}/times`, time).pipe(
      catchError(error => {
        console.error('Error creating time, adding to queue:', error);
        
        // Añadir a la cola de peticiones pendientes
        this.requestQueue.addPendingTimeRequest(taskId, time, 'create');
        
        // Crear un tiempo simulado para la UI
        const simulatedTime: Time = {
          id: `temp_${Date.now()}`,
          ...time
        };
        
        return of(simulatedTime);
      })
    );
  }

  updateTime(taskId: string, timeId: string, time: Partial<Time>): Observable<Time> {
    return this.apiService.put<Time>(`/tasks/${taskId}/times/${timeId}`, time).pipe(
      catchError(error => {
        console.error('Error updating time, adding to queue:', error);
        
        // Añadir a la cola de peticiones pendientes
        this.requestQueue.addPendingTimeRequest(taskId, time, 'update', timeId);
        
        // Crear un tiempo simulado para la UI
        const simulatedTime: Time = {
          id: timeId,
          description: time.description || '',
          begin_date: time.begin_date || '',
          end_date: time.end_date || '',
          spent_time: time.spent_time || 0
        };
        
        return of(simulatedTime);
      })
    );
  }

  deleteTime(taskId: string, timeId: string): Observable<void> {
    return this.apiService.delete<void>(`/tasks/${taskId}/times/${timeId}`).pipe(
      catchError(error => {
        console.error('Error deleting time, adding to queue:', error);
        
        // Añadir a la cola de peticiones pendientes
        this.requestQueue.addPendingTimeRequest(taskId, {}, 'delete', timeId);
        
        // Retornar void para que la UI funcione
        return of(void 0);
      })
    );
  }

  // Método para parar timer usando la cola de peticiones
  stopTimer(taskId: string, activeTime: Time): Observable<Time> {
    const now = new Date().toISOString();
    const beginDate = new Date(activeTime.begin_date);
    const endDate = new Date(now);
    const spentTimeHours = (endDate.getTime() - beginDate.getTime()) / (1000 * 60 * 60);

    const completedTime: Partial<Time> = {
      description: activeTime.description,
      begin_date: activeTime.begin_date,
      end_date: now,
      spent_time: spentTimeHours
    };

    return this.updateTime(taskId, activeTime.id, completedTime);
  }

  // Método para obtener peticiones pendientes de una tarea
  getPendingRequestsForTask(taskId: string) {
    return this.requestQueue.getPendingRequestsForTask(taskId);
  }
}
