import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable, interval } from 'rxjs';
import { PendingRequest, PendingTimeRequest } from './pending-request.model';

@Injectable({
  providedIn: 'root'
})
export class RequestQueueService {
  private readonly STORAGE_KEY = 'chrono-tasks-pending-requests';
  private readonly MAX_RETRIES = 3;
  private readonly RETRY_DELAY = 30000; // 30 segundos

  private pendingRequestsSubject = new BehaviorSubject<PendingRequest[]>([]);
  public pendingRequests$ = this.pendingRequestsSubject.asObservable();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      this.loadPendingRequests();
      this.startRetryProcess();
    }
  }

  private loadPendingRequests(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const requests = JSON.parse(stored) as PendingRequest[];
        this.pendingRequestsSubject.next(requests);
      }
    } catch (error) {
      console.error('Error loading pending requests:', error);
    }
  }

  private savePendingRequests(requests: PendingRequest[]): void {
    if (!isPlatformBrowser(this.platformId)) {
      this.pendingRequestsSubject.next(requests);
      return;
    }

    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(requests));
      this.pendingRequestsSubject.next(requests);
    } catch (error) {
      console.error('Error saving pending requests:', error);
      this.pendingRequestsSubject.next(requests);
    }
  }

  addPendingRequest(request: PendingRequest): void {
    const requests = this.pendingRequestsSubject.value;
    const newRequest: PendingRequest = {
      ...request,
      id: this.generateId(),
      timestamp: Date.now(),
      retryCount: 0
    };
    
    const updatedRequests = [...requests, newRequest];
    this.savePendingRequests(updatedRequests);
    
    console.log('Request added to queue:', newRequest);
  }

  removePendingRequest(requestId: string): void {
    const requests = this.pendingRequestsSubject.value;
    const updatedRequests = requests.filter(req => req.id !== requestId);
    this.savePendingRequests(updatedRequests);
  }

  getPendingRequests(): PendingRequest[] {
    return this.pendingRequestsSubject.value;
  }

  getPendingRequestsForTask(taskId: string): PendingTimeRequest[] {
    return this.pendingRequestsSubject.value
      .filter(req => req.endpoint.includes(`/tasks/${taskId}/times`))
      .map(req => req as PendingTimeRequest);
  }

  private startRetryProcess(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    // Reintentar peticiones cada 30 segundos
    interval(this.RETRY_DELAY).subscribe(() => {
      this.retryPendingRequests();
    });
  }

  private retryPendingRequests(): Promise<void> {
    const requests = this.pendingRequestsSubject.value;
    const requestsToRetry = requests.filter(req => req.retryCount < this.MAX_RETRIES);

    const retryPromises = requestsToRetry.map(async (request) => {
      try {
        await this.executeRequest(request);
        this.removePendingRequest(request.id);
        console.log('Request executed successfully:', request.id);
      } catch (error) {
        console.error('Request failed, will retry:', request.id, error);
        this.incrementRetryCount(request.id);
      }
    });

    return Promise.all(retryPromises).then(() => {});
  }

  private async executeRequest(request: PendingRequest): Promise<any> {
    const headers = {
      'Content-Type': 'application/json',
      'x-access-token': '3GBWKoIHxXrI43r3hF0aVRC80IP1Q44rVr0w0O5Ikm0wUQdJcTbX60X1QBXorIjs'
    };

    const response = await fetch(`https://oficines.glamsw.com/chrono-test${request.endpoint}`, {
      method: request.method,
      headers,
      body: request.data ? JSON.stringify(request.data) : undefined
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  private incrementRetryCount(requestId: string): void {
    const requests = this.pendingRequestsSubject.value;
    const updatedRequests = requests.map(req => 
      req.id === requestId 
        ? { ...req, retryCount: req.retryCount + 1 }
        : req
    );
    this.savePendingRequests(updatedRequests);
  }

  private generateId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Métodos específicos para tiempos
  addPendingTimeRequest(taskId: string, timeData: any, type: 'create' | 'update' | 'delete', timeId?: string): void {
    const endpoint = type === 'create' 
      ? `/tasks/${taskId}/times`
      : `/tasks/${taskId}/times/${timeId}`;
    
    const method = type === 'delete' ? 'DELETE' : type === 'update' ? 'PUT' : 'POST';
    
    const request: PendingTimeRequest = {
      id: this.generateId(),
      method,
      endpoint,
      data: type === 'delete' ? { id: timeId } : timeData,
      timestamp: Date.now(),
      retryCount: 0,
      taskId,
      timeId,
      type
    };

    this.addPendingRequest(request);
  }

  clearAllPendingRequests(): void {
    this.savePendingRequests([]);
  }
}
