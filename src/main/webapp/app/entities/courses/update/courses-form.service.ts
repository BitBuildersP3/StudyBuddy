import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ICourses, NewCourses } from '../courses.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ICourses for edit and NewCoursesFormGroupInput for create.
 */
type CoursesFormGroupInput = ICourses | PartialWithRequiredKeyOf<NewCourses>;

type CoursesFormDefaults = Pick<NewCourses, 'id' | 'users'>;

type CoursesFormGroupContent = {
  id: FormControl<ICourses['id'] | NewCourses['id']>;
  name: FormControl<ICourses['name']>;
  description: FormControl<ICourses['description']>;
  previewImg: FormControl<ICourses['previewImg']>;
  status: FormControl<ICourses['status']>;
  score: FormControl<ICourses['score']>;
  excerpt: FormControl<ICourses['excerpt']>;
  userId: FormControl<ICourses['userId']>;
  ownerName: FormControl<ICourses['ownerName']>;
  userName: FormControl<ICourses['userName']>;
  userVotes: FormControl<ICourses['userVotes']>;
  users: FormControl<ICourses['users']>;
  category: FormControl<ICourses['category']>;
};

export type CoursesFormGroup = FormGroup<CoursesFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class CoursesFormService {
  createCoursesFormGroup(courses: CoursesFormGroupInput = { id: null }): CoursesFormGroup {
    const coursesRawValue = {
      ...this.getFormDefaults(),
      ...courses,
    };
    return new FormGroup<CoursesFormGroupContent>({
      id: new FormControl(
        { value: coursesRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      name: new FormControl(coursesRawValue.name),
      description: new FormControl(coursesRawValue.description),
      previewImg: new FormControl(coursesRawValue.previewImg),
      status: new FormControl(coursesRawValue.status),
      score: new FormControl(coursesRawValue.score),
      excerpt: new FormControl(coursesRawValue.excerpt),
      userId: new FormControl(coursesRawValue.userId),
      ownerName: new FormControl(coursesRawValue.ownerName),
      userName: new FormControl(coursesRawValue.userName),
      userVotes: new FormControl(coursesRawValue.userVotes),
      users: new FormControl(coursesRawValue.users ?? []),
      category: new FormControl(coursesRawValue.category),
    });
  }

  getCourses(form: CoursesFormGroup): ICourses | NewCourses {
    return form.getRawValue() as ICourses | NewCourses;
  }

  resetForm(form: CoursesFormGroup, courses: CoursesFormGroupInput): void {
    const coursesRawValue = { ...this.getFormDefaults(), ...courses };
    form.reset(
      {
        ...coursesRawValue,
        id: { value: coursesRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): CoursesFormDefaults {
    return {
      id: null,
      users: [],
    };
  }
}
