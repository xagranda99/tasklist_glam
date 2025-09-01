import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, interval, map, startWith, Subscription } from 'rxjs';
import { CurrentTimeService, ActiveTime } from '../../services/current-time.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class HeaderComponent implements OnInit, OnDestroy {
  currentTime$: Observable<Date>;
  activeTime$: Observable<ActiveTime | null>;
  private subscription: Subscription = new Subscription();

  constructor(private currentTimeService: CurrentTimeService) {
    this.currentTime$ = interval(1000).pipe(
      startWith(0),
      map(() => new Date())
    );
    this.activeTime$ = this.currentTimeService.getTimerObservable();
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  formatTime(date: Date): string {
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }

  formatDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
}
