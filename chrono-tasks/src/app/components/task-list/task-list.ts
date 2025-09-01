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
    this.activeTime$ = this.currentTimeService.activeTime$;
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
          alert('Error al iniciar el timer. Por favor, inténtalo de nuevo.');
        }
      })
    );
  }

  stopActiveTime(task: Task): void {
    // Nota: La API real tiene problemas con el endpoint PUT para actualizar tiempos
    // Por ahora, mostramos un mensaje informativo
    alert('La funcionalidad de parar timers está temporalmente deshabilitada debido a limitaciones de la API. Los timers se pueden iniciar correctamente.');
  }

  getTotalSpentTime(times: Time[]): number {
    return times.reduce((total, time) => total + time.spent_time, 0);
  }

  formatDuration(hours: number): string {
    const totalHours = Math.floor(hours);
    const minutes = Math.floor((hours - totalHours) * 60);
    return `${totalHours}h ${minutes}m`;
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
