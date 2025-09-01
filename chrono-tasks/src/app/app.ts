import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header';
import { TimerComponent } from './components/timer/timer';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, TimerComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = 'Chrono Tasks';
}
