import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

// Ojo con este import, path.
import { IFiles, NewFiles } from 'app/entities/files/files.model';
import { Observable } from 'rxjs';
import { EntityResponseType, RestExtraUserInfo } from '../../entities/extra-user-info/service/extra-user-info.service';
import { map } from 'rxjs/operators';

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

  url1: FormControl<IFiles['url1']>;
  url2: FormControl<IFiles['url2']>;
  url3: FormControl<IFiles['url3']>;

  name: FormControl<IFiles['name']>;
  excerpt: FormControl<IFiles['excerpt']>;
};

export type FilesFormGroup = FormGroup<FilesFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class IndexRegisterFileService {
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

      url1: new FormControl(filesRawValue.url1, {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(5), Validators.maxLength(254), Validators.pattern('^https://.*$')],
      }),

      url2:  new FormControl(filesRawValue.url2, {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(5), Validators.maxLength(254), Validators.pattern('^https://.*$')],
      }),
      url3:  new FormControl(filesRawValue.url3, {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(5), Validators.maxLength(254), Validators.pattern('^https://.*$')],
      }),
      // Se quema el status
      name:  new FormControl(filesRawValue.name, {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(5), Validators.maxLength(254), ],
      }),
      excerpt:  new FormControl(filesRawValue.excerpt, {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(5), Validators.maxLength(254), ],
      }),

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
