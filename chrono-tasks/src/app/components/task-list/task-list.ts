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
    return task.times?.some(time => time.end_date === null) || false;
  }

  getActiveTime(task: Task): Time | undefined {
    return task.times?.find(time => time.end_date === null);
  }

  startTimer(task: Task): void {
    const now = new Date().toISOString();
    const newTime: Omit<Time, 'id'> = {
      description: '',
      begin_date: now,
      end_date: null,
      spent_time: 0
    };

    this.subscription.add(
      this.timeService.createTime(task.id, newTime).subscribe({
        next: (createdTime) => {
          this.currentTimeService.setActiveTime(createdTime, task);
          this.tasks$ = this.taskService.getTasks(true);
        },
        error: (error) => console.error('Error starting timer:', error)
      })
    );
  }

  stopActiveTime(task: Task): void {
    const activeTime = this.getActiveTime(task);
    if (!activeTime) return;

    const now = new Date().toISOString();
    const beginDate = new Date(activeTime.begin_date);
    const endDate = new Date(now);
    const spentTime = Math.floor((endDate.getTime() - beginDate.getTime()) / 1000);

    this.subscription.add(
      this.timeService.updateTime(task.id, activeTime.id, {
        end_date: now,
        spent_time: spentTime
      }).subscribe({
        next: () => {
          this.currentTimeService.clearActiveTime();
          this.tasks$ = this.taskService.getTasks(true);
        },
        error: (error) => console.error('Error stopping timer:', error)
      })
    );
  }

  getTotalSpentTime(times: Time[]): number {
    return times.reduce((total, time) => total + time.spent_time, 0);
  }

  formatDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  }

  deleteTask(taskId: string): void {
    if (confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
      this.subscription.add(
        this.taskService.deleteTask(taskId).subscribe({
          next: () => {
            this.tasks$ = this.taskService.getTasks(true);
          },
          error: (error) => console.error('Error deleting task:', error)
        })
      );
    }
  }
}
