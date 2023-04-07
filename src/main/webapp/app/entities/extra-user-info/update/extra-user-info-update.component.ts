import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ExtraUserInfoFormService, ExtraUserInfoFormGroup } from './extra-user-info-form.service';
import { IExtraUserInfo } from '../extra-user-info.model';
import { ExtraUserInfoService } from '../service/extra-user-info.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

@Component({
  selector: 'jhi-extra-user-info-update',
  templateUrl: './extra-user-info-update.component.html',
})
export class ExtraUserInfoUpdateComponent implements OnInit {
  isSaving = false;
  extraUserInfo: IExtraUserInfo | null = null;

  usersSharedCollection: IUser[] = [];
  previewURL: string = '';

  editForm: ExtraUserInfoFormGroup = this.extraUserInfoFormService.createExtraUserInfoFormGroup();

  constructor(
    protected extraUserInfoService: ExtraUserInfoService,
    protected extraUserInfoFormService: ExtraUserInfoFormService,
    protected userService: UserService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareUser = (o1: IUser | null, o2: IUser | null): boolean => this.userService.compareUser(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ extraUserInfo }) => {
      this.extraUserInfo = extraUserInfo;
      if (extraUserInfo) {
        this.updateForm(extraUserInfo);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const extraUserInfo = this.extraUserInfoFormService.getExtraUserInfo(this.editForm);
    if (extraUserInfo.id !== null) {
      extraUserInfo.profilePicture = this.previewURL;
      this.subscribeToSaveResponse(this.extraUserInfoService.update(extraUserInfo));
    } else {
      this.subscribeToSaveResponse(this.extraUserInfoService.create(extraUserInfo));
    }
  }
  saveUrl(URL: string): void {
    this.previewURL = URL;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IExtraUserInfo>>): void {
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

  protected updateForm(extraUserInfo: IExtraUserInfo): void {
    this.extraUserInfo = extraUserInfo;
    this.extraUserInfoFormService.resetForm(this.editForm, extraUserInfo);

    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing<IUser>(this.usersSharedCollection, extraUserInfo.user);
  }

  protected loadRelationshipsOptions(): void {
    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing<IUser>(users, this.extraUserInfo?.user)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));
  }
}
