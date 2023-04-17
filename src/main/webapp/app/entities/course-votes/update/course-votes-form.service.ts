import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ICourseVotes, NewCourseVotes } from '../course-votes.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ICourseVotes for edit and NewCourseVotesFormGroupInput for create.
 */
type CourseVotesFormGroupInput = ICourseVotes | PartialWithRequiredKeyOf<NewCourseVotes>;

type CourseVotesFormDefaults = Pick<NewCourseVotes, 'id'>;

type CourseVotesFormGroupContent = {
  id: FormControl<ICourseVotes['id'] | NewCourseVotes['id']>;
  idCourse: FormControl<ICourseVotes['idCourse']>;
  json: FormControl<ICourseVotes['json']>;
};

export type CourseVotesFormGroup = FormGroup<CourseVotesFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class CourseVotesFormService {
  createCourseVotesFormGroup(courseVotes: CourseVotesFormGroupInput = { id: null }): CourseVotesFormGroup {
    const courseVotesRawValue = {
      ...this.getFormDefaults(),
      ...courseVotes,
    };
    return new FormGroup<CourseVotesFormGroupContent>({
      id: new FormControl(
        { value: courseVotesRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      idCourse: new FormControl(courseVotesRawValue.idCourse),
      json: new FormControl(courseVotesRawValue.json),
    });
  }

  getCourseVotes(form: CourseVotesFormGroup): ICourseVotes | NewCourseVotes {
    return form.getRawValue() as ICourseVotes | NewCourseVotes;
  }

  resetForm(form: CourseVotesFormGroup, courseVotes: CourseVotesFormGroupInput): void {
    const courseVotesRawValue = { ...this.getFormDefaults(), ...courseVotes };
    form.reset(
      {
        ...courseVotesRawValue,
        id: { value: courseVotesRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): CourseVotesFormDefaults {
    return {
      id: null,
    };
  }
}
