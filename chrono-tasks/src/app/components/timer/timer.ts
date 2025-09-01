import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, Subscription } from 'rxjs';
import { CurrentTimeService, ActiveTime } from '../../services/current-time.service';

@Component({
  selector: 'app-timer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './timer.html',
  styleUrl: './timer.scss'
})
export class TimerComponent implements OnInit, OnDestroy {
  activeTime$: Observable<ActiveTime | null>;
  private subscription: Subscription = new Subscription();

  constructor(private currentTimeService: CurrentTimeService) {
    this.activeTime$ = this.currentTimeService.getTimerObservable();
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  formatDuration(hours: number): string {
    const totalHours = Math.floor(hours);
    const minutes = Math.floor((hours - totalHours) * 60);
    const seconds = Math.floor(((hours - totalHours) * 60 - minutes) * 60);
    return `${totalHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
}
