import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IExtraUserInfo, NewExtraUserInfo } from '../extra-user-info.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IExtraUserInfo for edit and NewExtraUserInfoFormGroupInput for create.
 */
type ExtraUserInfoFormGroupInput = IExtraUserInfo | PartialWithRequiredKeyOf<NewExtraUserInfo>;

type ExtraUserInfoFormDefaults = Pick<NewExtraUserInfo, 'id'>;

type ExtraUserInfoFormGroupContent = {
  id: FormControl<IExtraUserInfo['id'] | NewExtraUserInfo['id']>;
  phone: FormControl<IExtraUserInfo['phone']>;
  degree: FormControl<IExtraUserInfo['degree']>;
  profilePicture: FormControl<IExtraUserInfo['profilePicture']>;
  birthDay: FormControl<IExtraUserInfo['birthDay']>;
  score: FormControl<IExtraUserInfo['score']>;
  userVotes: FormControl<IExtraUserInfo['userVotes']>;
  user: FormControl<IExtraUserInfo['user']>;
};

export type ExtraUserInfoFormGroup = FormGroup<ExtraUserInfoFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ExtraUserInfoFormService {
  createExtraUserInfoFormGroup(extraUserInfo: ExtraUserInfoFormGroupInput = { id: null }): ExtraUserInfoFormGroup {
    const extraUserInfoRawValue = {
      ...this.getFormDefaults(),
      ...extraUserInfo,
    };
    return new FormGroup<ExtraUserInfoFormGroupContent>({
      id: new FormControl(
        { value: extraUserInfoRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      phone: new FormControl(extraUserInfoRawValue.phone),
      degree: new FormControl(extraUserInfoRawValue.degree),
      profilePicture: new FormControl(extraUserInfoRawValue.profilePicture),
      birthDay: new FormControl(extraUserInfoRawValue.birthDay),
      score: new FormControl(extraUserInfoRawValue.score),
      userVotes: new FormControl(extraUserInfoRawValue.userVotes),
      user: new FormControl(extraUserInfoRawValue.user),
    });
  }

  getExtraUserInfo(form: ExtraUserInfoFormGroup): IExtraUserInfo | NewExtraUserInfo {
    return form.getRawValue() as IExtraUserInfo | NewExtraUserInfo;
  }

  resetForm(form: ExtraUserInfoFormGroup, extraUserInfo: ExtraUserInfoFormGroupInput): void {
    const extraUserInfoRawValue = { ...this.getFormDefaults(), ...extraUserInfo };
    form.reset(
      {
        ...extraUserInfoRawValue,
        id: { value: extraUserInfoRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): ExtraUserInfoFormDefaults {
    return {
      id: null,
    };
  }
}
