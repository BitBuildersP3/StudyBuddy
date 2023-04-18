import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';
import { ExtraUserInfoService } from 'app/entities/extra-user-info/service/extra-user-info.service';
import { EntityResponseType } from 'app/entities/news/service/news.service';
import { EventsFormService, EventsFormGroup } from './events-form.service';
import { IEvents } from '../events.model';
import { EventsService } from '../service/events.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { User } from '../../../admin/user-management/user-management.model';

@Component({
  selector: 'jhi-events-update',
  templateUrl: './events-update.component.html',
  styleUrls: ['./events-update.component.scss'],
})
export class EventsUpdateComponent implements OnInit {
  isSaving = false;
  events: IEvents | null = null;
  idUser: number = 0;
  status = '';

  usersSharedCollection: IUser[] = [];

  editForm: EventsFormGroup = this.eventsFormService.createEventsFormGroup();
  ownerName: string = '';

  user: User | null = null;

  constructor(
    protected eventsService: EventsService,
    protected eventsFormService: EventsFormService,
    protected userService: UserService,
    protected activatedRoute: ActivatedRoute,
    protected extraUser: ExtraUserInfoService,
    private route: ActivatedRoute
  ) {}

  compareUser = (o1: IUser | null, o2: IUser | null): boolean => this.userService.compareUser(o1, o2);

  ngOnInit(): void {
    this.extraUser.getInfoByCurrentUser().subscribe({
      next: (res: EntityResponseType) => {
        // @ts-ignore
        this.idUser = res.body?.user.id;
        const login = res.body?.user?.login;
        if (login != null) {
          this.ownerName = login;
          console.log(this.ownerName);
        }


      },



    });

    // No borrar esto es para el modificar
    this.activatedRoute.data.subscribe(({ events }) => {
      this.events = events;

      if (events) {
        this.updateForm(events);
      }

      this.loadRelationshipsOptions();
      // No borrar esto es para el modificar
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    const user: Pick<IUser, 'id' | 'login'> = { id: this.idUser, login: this.ownerName };

    this.isSaving = true;
    const events = this.eventsFormService.getEvents(this.editForm);
    if (events.id !== null) {
      this.subscribeToSaveResponse(this.eventsService.update(events));
    } else {
      events.status = 'pendiente';
      events.user = user;
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
