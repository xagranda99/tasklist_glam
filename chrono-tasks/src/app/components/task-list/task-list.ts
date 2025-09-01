import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { Task } from '../../models/task.model';
import { Time } from '../../models/time.model';
import { TaskService } from '../../services/task.service';
import { TimeService } from '../../services/time.service';
import { CurrentTimeService, ActiveTime } from '../../services/current-time.service';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './task-list.html',
  styleUrl: './task-list.scss'
})
export class TaskListComponent implements OnInit, OnDestroy {
  tasks$: Observable<Task[]>;
  activeTime$: Observable<ActiveTime | null>;
  private subscription: Subscription = new Subscription();

  constructor(
    private taskService: TaskService,
    private timeService: TimeService,
    private currentTimeService: CurrentTimeService
  ) {
    this.tasks$ = this.taskService.getTasks(true);
    this.activeTime$ = this.currentTimeService.getTimerObservable();
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  hasActiveTime(task: Task): boolean {
    return task.times?.some(time => time.end_date === '') || false;
  }

  getActiveTime(task: Task): Time | undefined {
    return task.times?.find(time => time.end_date === '');
  }

  startTimer(task: Task): void {
    const now = new Date().toISOString();
    const newTime: Omit<Time, 'id'> = {
      description: '',
      begin_date: now,
      end_date: '', // API real usa string vacío para tiempos activos
      spent_time: 0
    };

    this.subscription.add(
      this.timeService.createTime(task.id, newTime).subscribe({
        next: (createdTime) => {
          this.currentTimeService.setActiveTime(createdTime, task);
          this.tasks$ = this.taskService.getTasks(true);
        },
        error: (error) => {
          console.error('Error starting timer:', error);
          alert('Error al iniciar el timer. La petición se ha guardado para reintentar más tarde.');
        }
      })
    );
  }

  stopActiveTime(task: Task): void {
    const activeTime = this.getActiveTime(task);
    if (!activeTime) return;

    this.subscription.add(
      this.timeService.stopTimer(task.id, activeTime).subscribe({
        next: (updatedTime) => {
          this.currentTimeService.clearActiveTime();
          this.tasks$ = this.taskService.getTasks(true);
          alert('Timer detenido. Si hay problemas de conexión, la petición se guardará para reintentar más tarde.');
        },
        error: (error) => {
          console.error('Error stopping timer:', error);
          alert('Error al parar el timer. La petición se ha guardado para reintentar más tarde.');
        }
      })
    );
  }

  getTotalSpentTime(task: Task): number {
    if (!task.times || task.times.length === 0) return 0;
    
    let totalHours = 0;
    
    // Sumar tiempos completados
    for (const time of task.times) {
      if (time.end_date && time.end_date !== '') {
        // Tiempo completado - usar spent_time
        totalHours += time.spent_time || 0;
      } else if (time.end_date === '') {
        // Tiempo activo - calcular duración actual
        const activeTimeInfo = this.currentTimeService.getCurrentTime();
        if (activeTimeInfo && activeTimeInfo.task?.id === task.id && activeTimeInfo.time?.id === time.id) {
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

  deleteTask(taskId: string): void {
    if (confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
      this.subscription.add(
        this.taskService.deleteTask(taskId).subscribe({
          next: () => {
            this.tasks$ = this.taskService.getTasks(true);
          },
          error: (error) => {
            console.error('Error deleting task:', error);
            alert('Error al eliminar la tarea. Por favor, inténtalo de nuevo.');
          }
        })
      );
    }
  }
}
