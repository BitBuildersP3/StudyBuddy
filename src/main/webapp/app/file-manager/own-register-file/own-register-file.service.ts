import { Injectable } from '@angular/core';
import { IFiles, NewFiles } from '../../entities/files/files.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IFiles for edit and NewFilesFormGroupInput for create.
 */
type FilesFormGroupInput = IFiles | PartialWithRequiredKeyOf<NewFiles>;

type FilesFormDefaults = Pick<NewFiles, 'id'>;

type FilesFormGroupContent = {
  id: FormControl<IFiles['id'] | NewFiles['id']>;

  name: FormControl<IFiles['name']>;
  excerpt: FormControl<IFiles['excerpt']>;
};
export type FilesFormGroup = FormGroup<FilesFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class OwnRegisterFileService {
  createFilesFormGroup(files: FilesFormGroupInput = { id: null }): FilesFormGroup {
    const filesRawValue = {
      ...this.getFormDefaults(),
      ...files,
    };
    return new FormGroup<FilesFormGroupContent>({
      id: new FormControl(
        { value: filesRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),

      // Se quema el status

      name: new FormControl(filesRawValue.name),
      excerpt: new FormControl(filesRawValue.excerpt),
    });
  }

  getFiles(form: FilesFormGroup): IFiles | NewFiles {
    return form.getRawValue() as IFiles | NewFiles;
  }

  resetForm(form: FilesFormGroup, files: FilesFormGroupInput): void {
    const filesRawValue = { ...this.getFormDefaults(), ...files };
    form.reset(
      {
        ...filesRawValue,
        id: { value: filesRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): FilesFormDefaults {
    return {
      id: null,
    };
  }
}
