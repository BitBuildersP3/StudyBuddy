import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { CourseVotesFormService, CourseVotesFormGroup } from './course-votes-form.service';
import { ICourseVotes } from '../course-votes.model';
import { CourseVotesService } from '../service/course-votes.service';

@Component({
  selector: 'jhi-course-votes-update',
  templateUrl: './course-votes-update.component.html',
})
export class CourseVotesUpdateComponent implements OnInit {
  isSaving = false;
  courseVotes: ICourseVotes | null = null;

  editForm: CourseVotesFormGroup = this.courseVotesFormService.createCourseVotesFormGroup();

  constructor(
    protected courseVotesService: CourseVotesService,
    protected courseVotesFormService: CourseVotesFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ courseVotes }) => {
      this.courseVotes = courseVotes;
      if (courseVotes) {
        this.updateForm(courseVotes);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const courseVotes = this.courseVotesFormService.getCourseVotes(this.editForm);
    if (courseVotes.id !== null) {
      this.subscribeToSaveResponse(this.courseVotesService.update(courseVotes));
    } else {
      this.subscribeToSaveResponse(this.courseVotesService.create(courseVotes));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICourseVotes>>): void {
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

  protected updateForm(courseVotes: ICourseVotes): void {
    this.courseVotes = courseVotes;
    this.courseVotesFormService.resetForm(this.editForm, courseVotes);
  }
}
