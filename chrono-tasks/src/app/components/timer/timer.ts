import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, Subscription } from 'rxjs';
import { CurrentTimeService, ActiveTime } from '../../services/current-time.service';
import { TimeService } from '../../services/time.service';

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

  constructor(
    private currentTimeService: CurrentTimeService,
    private timeService: TimeService
  ) {
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

  stopTimer(): void {
    this.activeTime$.subscribe(activeTime => {
      if (activeTime && activeTime.task && activeTime.time) {
        this.subscription.add(
          this.timeService.stopTimer(activeTime.task.id, activeTime.time).subscribe({
            next: (updatedTime) => {
              this.currentTimeService.clearActiveTime();
              alert('Timer detenido. Si hay problemas de conexión, la petición se guardará para reintentar más tarde.');
            },
            error: (error) => {
              console.error('Error stopping timer:', error);
              alert('Error al parar el timer. La petición se ha guardado para reintentar más tarde.');
            }
          })
        );
      }
    }).unsubscribe();
  }
}
