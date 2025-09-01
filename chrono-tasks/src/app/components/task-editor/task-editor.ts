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
  private subscription: Subscription = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private taskService: TaskService,
    private timeService: TimeService,
    private currentTimeService: CurrentTimeService
  ) {
    this.activeTime$ = this.currentTimeService.activeTime$;
  }

  ngOnInit(): void {
    const taskId = this.route.snapshot.paramMap.get('id');
    if (taskId) {
      this.loadTask(taskId);
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
        },
        error: (error) => {
          console.error('Error starting timer:', error);
          alert('Error al iniciar el timer. Por favor, inténtalo de nuevo.');
        }
      })
    );
  }

  stopActiveTime(): void {
    // Nota: La API real tiene problemas con el endpoint PUT para actualizar tiempos
    // Por ahora, mostramos un mensaje informativo
    alert('La funcionalidad de parar timers está temporalmente deshabilitada debido a limitaciones de la API. Los timers se pueden iniciar correctamente.');
  }

  isTimeActive(time: Time): boolean {
    return time.end_date === '';
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
          },
          error: (error) => {
            console.error('Error deleting time:', error);
            alert('Error al eliminar el registro de tiempo. Por favor, inténtalo de nuevo.');
          }
        })
      );
    }
  }

  goBack(): void {
    this.router.navigate(['/tasks']);
  }
}
