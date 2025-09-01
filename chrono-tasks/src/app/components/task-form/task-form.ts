import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './task-form.html',
  styleUrl: './task-form.scss'
})
export class TaskFormComponent implements OnInit {
  task: Omit<Task, 'id'> = {
    name: '',
    description: '',
    customer: ''
  };

  constructor(
    private taskService: TaskService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.isFormValid()) {
      this.taskService.createTask(this.task).subscribe({
        next: () => {
          this.router.navigate(['/tasks']);
        },
        error: (error) => {
          console.error('Error creating task:', error);
          alert('Error al crear la tarea');
        }
      });
    }
  }

  isFormValid(): boolean {
    return !!(this.task.name.trim() && this.task.customer.trim());
  }

  onCancel(): void {
    this.router.navigate(['/tasks']);
  }
}
