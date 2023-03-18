import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IEvents } from '../events.model';

@Component({
  selector: 'jhi-events-detail',
  templateUrl: './events-detail.component.html',
})
export class EventsDetailComponent implements OnInit {
  events: IEvents | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ events }) => {
      this.events = events;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
