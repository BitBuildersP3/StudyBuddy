import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { UserVotesFormService, UserVotesFormGroup } from './user-votes-form.service';
import { IUserVotes } from '../user-votes.model';
import { UserVotesService } from '../service/user-votes.service';

@Component({
  selector: 'jhi-user-votes-update',
  templateUrl: './user-votes-update.component.html',
})
export class UserVotesUpdateComponent implements OnInit {
  isSaving = false;
  userVotes: IUserVotes | null = null;

  editForm: UserVotesFormGroup = this.userVotesFormService.createUserVotesFormGroup();

  constructor(
    protected userVotesService: UserVotesService,
    protected userVotesFormService: UserVotesFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ userVotes }) => {
      this.userVotes = userVotes;
      if (userVotes) {
        this.updateForm(userVotes);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const userVotes = this.userVotesFormService.getUserVotes(this.editForm);
    if (userVotes.id !== null) {
      this.subscribeToSaveResponse(this.userVotesService.update(userVotes));
    } else {
      this.subscribeToSaveResponse(this.userVotesService.create(userVotes));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IUserVotes>>): void {
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

  protected updateForm(userVotes: IUserVotes): void {
    this.userVotes = userVotes;
    this.userVotesFormService.resetForm(this.editForm, userVotes);
  }
}
