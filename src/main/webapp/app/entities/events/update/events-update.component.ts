import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { EventsFormService, EventsFormGroup } from './events-form.service';
import { IEvents } from '../events.model';
import { EventsService } from '../service/events.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

@Component({
  selector: 'jhi-events-update',
  templateUrl: './events-update.component.html',
  styleUrls: ['./events-update.component.scss'],
})
export class EventsUpdateComponent implements OnInit {
  isSaving = false;
  events: IEvents | null = null;

  usersSharedCollection: IUser[] = [];

  editForm: EventsFormGroup = this.eventsFormService.createEventsFormGroup();

  constructor(
    protected eventsService: EventsService,
    protected eventsFormService: EventsFormService,
    protected userService: UserService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareUser = (o1: IUser | null, o2: IUser | null): boolean => this.userService.compareUser(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ events }) => {
      this.events = events;
      if (events) {
        this.updateForm(events);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const events = this.eventsFormService.getEvents(this.editForm);
    if (events.id !== null) {
      this.subscribeToSaveResponse(this.eventsService.update(events));
    } else {
      this.subscribeToSaveResponse(this.eventsService.create(events));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IEvents>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(events: IEvents): void {
    this.events = events;
    this.eventsFormService.resetForm(this.editForm, events);

    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing<IUser>(this.usersSharedCollection, events.user);
  }

  protected loadRelationshipsOptions(): void {
    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing<IUser>(users, this.events?.user)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));
  }
}
