import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { PomodoroFormService, PomodoroFormGroup } from './pomodoro-form.service';
import { IPomodoro } from '../pomodoro.model';
import { PomodoroService } from '../service/pomodoro.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

@Component({
  selector: 'jhi-pomodoro-update',
  templateUrl: './pomodoro-update.component.html',
})
export class PomodoroUpdateComponent implements OnInit {
  isSaving = false;
  pomodoro: IPomodoro | null = null;

  usersSharedCollection: IUser[] = [];

  editForm: PomodoroFormGroup = this.pomodoroFormService.createPomodoroFormGroup();

  constructor(
    protected pomodoroService: PomodoroService,
    protected pomodoroFormService: PomodoroFormService,
    protected userService: UserService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareUser = (o1: IUser | null, o2: IUser | null): boolean => this.userService.compareUser(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ pomodoro }) => {
      this.pomodoro = pomodoro;
      if (pomodoro) {
        this.updateForm(pomodoro);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const pomodoro = this.pomodoroFormService.getPomodoro(this.editForm);
    if (pomodoro.id !== null) {
      this.subscribeToSaveResponse(this.pomodoroService.update(pomodoro));
    } else {
      this.subscribeToSaveResponse(this.pomodoroService.create(pomodoro));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPomodoro>>): void {
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

  protected updateForm(pomodoro: IPomodoro): void {
    this.pomodoro = pomodoro;
    this.pomodoroFormService.resetForm(this.editForm, pomodoro);

    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing<IUser>(this.usersSharedCollection, pomodoro.user);
  }

  protected loadRelationshipsOptions(): void {
    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing<IUser>(users, this.pomodoro?.user)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));
  }
}
