import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IPomodoro, NewPomodoro } from '../pomodoro.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IPomodoro for edit and NewPomodoroFormGroupInput for create.
 */
type PomodoroFormGroupInput = IPomodoro | PartialWithRequiredKeyOf<NewPomodoro>;

type PomodoroFormDefaults = Pick<NewPomodoro, 'id'>;

type PomodoroFormGroupContent = {
  id: FormControl<IPomodoro['id'] | NewPomodoro['id']>;
  beginTime: FormControl<IPomodoro['beginTime']>;
  endTime: FormControl<IPomodoro['endTime']>;
  totalTime: FormControl<IPomodoro['totalTime']>;
  status: FormControl<IPomodoro['status']>;
  task: FormControl<IPomodoro['task']>;
  beginBreak: FormControl<IPomodoro['beginBreak']>;
  endBreak: FormControl<IPomodoro['endBreak']>;
  totalBreak: FormControl<IPomodoro['totalBreak']>;
  user: FormControl<IPomodoro['user']>;
};

export type PomodoroFormGroup = FormGroup<PomodoroFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class PomodoroFormService {
  createPomodoroFormGroup(pomodoro: PomodoroFormGroupInput = { id: null }): PomodoroFormGroup {
    const pomodoroRawValue = {
      ...this.getFormDefaults(),
      ...pomodoro,
    };
    return new FormGroup<PomodoroFormGroupContent>({
      id: new FormControl(
        { value: pomodoroRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      beginTime: new FormControl(pomodoroRawValue.beginTime),
      endTime: new FormControl(pomodoroRawValue.endTime),
      totalTime: new FormControl(pomodoroRawValue.totalTime),
      status: new FormControl(pomodoroRawValue.status),
      task: new FormControl(pomodoroRawValue.task),
      beginBreak: new FormControl(pomodoroRawValue.beginBreak),
      endBreak: new FormControl(pomodoroRawValue.endBreak),
      totalBreak: new FormControl(pomodoroRawValue.totalBreak),
      user: new FormControl(pomodoroRawValue.user),
    });
  }

  getPomodoro(form: PomodoroFormGroup): IPomodoro | NewPomodoro {
    return form.getRawValue() as IPomodoro | NewPomodoro;
  }

  resetForm(form: PomodoroFormGroup, pomodoro: PomodoroFormGroupInput): void {
    const pomodoroRawValue = { ...this.getFormDefaults(), ...pomodoro };
    form.reset(
      {
        ...pomodoroRawValue,
        id: { value: pomodoroRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): PomodoroFormDefaults {
    return {
      id: null,
    };
  }
}
