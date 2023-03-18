import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IPomodoro } from '../pomodoro.model';

@Component({
  selector: 'jhi-pomodoro-detail',
  templateUrl: './pomodoro-detail.component.html',
})
export class PomodoroDetailComponent implements OnInit {
  pomodoro: IPomodoro | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ pomodoro }) => {
      this.pomodoro = pomodoro;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
