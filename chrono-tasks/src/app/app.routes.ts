import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/tasks', pathMatch: 'full' },
  { path: 'tasks', loadComponent: () => import('./components/task-list/task-list').then(m => m.TaskListComponent) },
  { path: 'tasks/new', loadComponent: () => import('./components/task-form/task-form').then(m => m.TaskFormComponent) },
  { path: 'tasks/:id', loadComponent: () => import('./components/task-editor/task-editor').then(m => m.TaskEditorComponent) },
  { path: '**', redirectTo: '/tasks' }
];
