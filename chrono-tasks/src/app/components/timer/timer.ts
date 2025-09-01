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

  formatDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
}
