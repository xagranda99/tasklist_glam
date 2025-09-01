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

  formatDuration(hours: number): string {
    const totalHours = Math.floor(hours);
    const minutes = Math.floor((hours - totalHours) * 60);
    const seconds = Math.floor(((hours - totalHours) * 60 - minutes) * 60);
    return `${totalHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
}
