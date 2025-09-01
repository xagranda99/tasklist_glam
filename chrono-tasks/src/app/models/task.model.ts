import { Time } from './time.model';

export interface Task {
  id: string;
  name: string;
  description: string;
  customer: string;
  times?: Time[];
}
