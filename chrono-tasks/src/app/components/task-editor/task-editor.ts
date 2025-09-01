import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { Task } from '../../models/task.model';
import { Time } from '../../models/time.model';
import { TaskService } from '../../services/task.service';
import { TimeService } from '../../services/time.service';
import { CurrentTimeService, ActiveTime } from '../../services/current-time.service';
import { RequestQueueService } from '../../services/queue/request-queue.service';
import { PendingTimeRequest } from '../../services/queue/pending-request.model';

@Component({
  selector: 'app-task-editor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './task-editor.html',
  styleUrl: './task-editor.scss'
})
export class TaskEditorComponent implements OnInit, OnDestroy {
  task: Task | null = null;
  activeTime$: Observable<ActiveTime | null>;
  showAddTimeForm = false;
  pendingRequests: PendingTimeRequest[] = [];
  newTime: Omit<Time, 'id'> = {
    description: '',
    begin_date: '',
    end_date: '',
    spent_time: 0
  };
  private subscription: Subscription = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private taskService: TaskService,
    private timeService: TimeService,
    private currentTimeService: CurrentTimeService,
    private requestQueue: RequestQueueService
  ) {
    this.activeTime$ = this.currentTimeService.getTimerObservable();
  }

  ngOnInit(): void {
    const taskId = this.route.snapshot.paramMap.get('id');
    if (taskId) {
      this.loadTask(taskId);
      this.loadPendingRequests(taskId);
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  loadTask(taskId: string): void {
    this.subscription.add(
      this.taskService.getTask(taskId).subscribe({
        next: (task) => {
          this.task = task;
        },
        error: (error) => {
          console.error('Error loading task:', error);
          this.router.navigate(['/tasks']);
        }
      })
    );
  }

  loadPendingRequests(taskId: string): void {
    this.pendingRequests = this.timeService.getPendingRequestsForTask(taskId);
  }

  hasActiveTime(): boolean {
    return this.task?.times?.some(time => time.end_date === '') || false;
  }

  getActiveTime(): Time | undefined {
    return this.task?.times?.find(time => time.end_date === '');
  }

  startTimer(): void {
    if (!this.task) return;

    const now = new Date().toISOString();
    const newTime: Omit<Time, 'id'> = {
      description: '',
      begin_date: now,
      end_date: '', // API real usa string vacío para tiempos activos
      spent_time: 0
    };

    this.subscription.add(
      this.timeService.createTime(this.task.id, newTime).subscribe({
        next: (createdTime) => {
          this.currentTimeService.setActiveTime(createdTime, this.task!);
          this.loadTask(this.task!.id);
          this.loadPendingRequests(this.task!.id);
        },
        error: (error) => {
          console.error('Error starting timer:', error);
          alert('Error al iniciar el timer. La petición se ha guardado para reintentar más tarde.');
        }
      })
    );
  }

  stopActiveTime(): void {
    if (!this.task) return;

    const activeTime = this.getActiveTime();
    if (!activeTime) return;

    this.subscription.add(
      this.timeService.stopTimer(this.task.id, activeTime).subscribe({
        next: (updatedTime) => {
          this.currentTimeService.clearActiveTime();
          this.loadTask(this.task!.id);
          this.loadPendingRequests(this.task!.id);
          alert('Timer detenido. Si hay problemas de conexión, la petición se guardará para reintentar más tarde.');
        },
        error: (error) => {
          console.error('Error stopping timer:', error);
          alert('Error al parar el timer. La petición se ha guardado para reintentar más tarde.');
        }
      })
    );
  }

  addTime(): void {
    if (!this.task) return;

    // Validar que al menos tenga fecha de inicio
    if (!this.newTime.begin_date) {
      alert('La fecha de inicio es obligatoria');
      return;
    }

    // Convertir fechas a formato ISO
    const beginDate = new Date(this.newTime.begin_date).toISOString();
    const endDate = this.newTime.end_date ? new Date(this.newTime.end_date).toISOString() : '';

    // Calcular spent_time si hay fecha de fin
    let spentTime = 0;
    if (endDate) {
      const begin = new Date(beginDate);
      const end = new Date(endDate);
      spentTime = (end.getTime() - begin.getTime()) / (1000 * 60 * 60); // Convert to hours
    }

    const timeToAdd: Omit<Time, 'id'> = {
      description: this.newTime.description,
      begin_date: beginDate,
      end_date: endDate,
      spent_time: spentTime
    };

    this.subscription.add(
      this.timeService.createTime(this.task.id, timeToAdd).subscribe({
        next: () => {
          this.loadTask(this.task!.id);
          this.loadPendingRequests(this.task!.id);
          this.cancelAddTime();
          alert('Tiempo añadido. Si hay problemas de conexión, la petición se guardará para reintentar más tarde.');
        },
        error: (error) => {
          console.error('Error adding time:', error);
          alert('Error al añadir el tiempo. La petición se ha guardado para reintentar más tarde.');
        }
      })
    );
  }

  cancelAddTime(): void {
    this.showAddTimeForm = false;
    this.newTime = {
      description: '',
      begin_date: '',
      end_date: '',
      spent_time: 0
    };
  }

  isTimeActive(time: Time): boolean {
    return time.end_date === '';
  }

  getTotalSpentTime(): number {
    if (!this.task?.times || this.task.times.length === 0) return 0;
    
    let totalHours = 0;
    
    // Sumar tiempos completados
    for (const time of this.task.times) {
      if (time.end_date && time.end_date !== '') {
        // Tiempo completado - usar spent_time
        totalHours += time.spent_time || 0;
      } else if (time.end_date === '') {
        // Tiempo activo - calcular duración actual
        const activeTimeInfo = this.currentTimeService.getCurrentTime();
        if (activeTimeInfo && activeTimeInfo.task?.id === this.task.id && activeTimeInfo.time?.id === time.id) {
          // Usar la duración calculada en tiempo real
          totalHours += activeTimeInfo.elapsedHours;
        } else {
          // Fallback: calcular duración desde begin_date
          const beginDate = new Date(time.begin_date);
          const now = new Date();
          const elapsedMs = now.getTime() - beginDate.getTime();
          totalHours += elapsedMs / (1000 * 60 * 60); // Convertir a horas
        }
      }
    }
    
    return totalHours;
  }

  formatDuration(hours: number): string {
    const totalHours = Math.floor(hours);
    const minutes = Math.floor((hours - totalHours) * 60);
    const seconds = Math.floor(((hours - totalHours) * 60 - minutes) * 60);
    return `${totalHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleString('es-ES');
  }

  deleteTime(timeId: string): void {
    if (!this.task) return;

    if (confirm('¿Estás seguro de que quieres eliminar este registro de tiempo?')) {
      this.subscription.add(
        this.timeService.deleteTime(this.task.id, timeId).subscribe({
          next: () => {
            this.loadTask(this.task!.id);
            this.loadPendingRequests(this.task!.id);
            alert('Tiempo eliminado. Si hay problemas de conexión, la petición se guardará para reintentar más tarde.');
          },
          error: (error) => {
            console.error('Error deleting time:', error);
            alert('Error al eliminar el registro de tiempo. La petición se ha guardado para reintentar más tarde.');
          }
        })
      );
    }
  }

  goBack(): void {
    this.router.navigate(['/tasks']);
  }
}
