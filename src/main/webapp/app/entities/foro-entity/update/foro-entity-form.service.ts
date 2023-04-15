import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IForoEntity, NewForoEntity } from '../foro-entity.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IForoEntity for edit and NewForoEntityFormGroupInput for create.
 */
type ForoEntityFormGroupInput = IForoEntity | PartialWithRequiredKeyOf<NewForoEntity>;

type ForoEntityFormDefaults = Pick<NewForoEntity, 'id'>;

type ForoEntityFormGroupContent = {
  id: FormControl<IForoEntity['id'] | NewForoEntity['id']>;
  json: FormControl<IForoEntity['json']>;
};

export type ForoEntityFormGroup = FormGroup<ForoEntityFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ForoEntityFormService {
  createForoEntityFormGroup(foroEntity: ForoEntityFormGroupInput = { id: null }): ForoEntityFormGroup {
    const foroEntityRawValue = {
      ...this.getFormDefaults(),
      ...foroEntity,
    };
    return new FormGroup<ForoEntityFormGroupContent>({
      id: new FormControl(
        { value: foroEntityRawValue.id, disabled: foroEntityRawValue.id !== null },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      json: new FormControl(foroEntityRawValue.json),
    });
  }

  getForoEntity(form: ForoEntityFormGroup): IForoEntity | NewForoEntity {
    return form.getRawValue() as IForoEntity | NewForoEntity;
  }

  resetForm(form: ForoEntityFormGroup, foroEntity: ForoEntityFormGroupInput): void {
    const foroEntityRawValue = { ...this.getFormDefaults(), ...foroEntity };
    form.reset(
      {
        ...foroEntityRawValue,
        id: { value: foroEntityRawValue.id, disabled: foroEntityRawValue.id !== null },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): ForoEntityFormDefaults {
    return {
      id: null,
    };
  }
}
