import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IUserVotes, NewUserVotes } from '../user-votes.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IUserVotes for edit and NewUserVotesFormGroupInput for create.
 */
type UserVotesFormGroupInput = IUserVotes | PartialWithRequiredKeyOf<NewUserVotes>;

type UserVotesFormDefaults = Pick<NewUserVotes, 'id'>;

type UserVotesFormGroupContent = {
  id: FormControl<IUserVotes['id'] | NewUserVotes['id']>;
  idUser: FormControl<IUserVotes['idUser']>;
  json: FormControl<IUserVotes['json']>;
};

export type UserVotesFormGroup = FormGroup<UserVotesFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class UserVotesFormService {
  createUserVotesFormGroup(userVotes: UserVotesFormGroupInput = { id: null }): UserVotesFormGroup {
    const userVotesRawValue = {
      ...this.getFormDefaults(),
      ...userVotes,
    };
    return new FormGroup<UserVotesFormGroupContent>({
      id: new FormControl(
        { value: userVotesRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      idUser: new FormControl(userVotesRawValue.idUser),
      json: new FormControl(userVotesRawValue.json),
    });
  }

  getUserVotes(form: UserVotesFormGroup): IUserVotes | NewUserVotes {
    return form.getRawValue() as IUserVotes | NewUserVotes;
  }

  resetForm(form: UserVotesFormGroup, userVotes: UserVotesFormGroupInput): void {
    const userVotesRawValue = { ...this.getFormDefaults(), ...userVotes };
    form.reset(
      {
        ...userVotesRawValue,
        id: { value: userVotesRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): UserVotesFormDefaults {
    return {
      id: null,
    };
  }
}
