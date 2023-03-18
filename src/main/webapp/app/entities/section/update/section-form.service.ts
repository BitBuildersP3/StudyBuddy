import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ISection, NewSection } from '../section.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ISection for edit and NewSectionFormGroupInput for create.
 */
type SectionFormGroupInput = ISection | PartialWithRequiredKeyOf<NewSection>;

type SectionFormDefaults = Pick<NewSection, 'id'>;

type SectionFormGroupContent = {
  id: FormControl<ISection['id'] | NewSection['id']>;
  name: FormControl<ISection['name']>;
  description: FormControl<ISection['description']>;
  excerpt: FormControl<ISection['excerpt']>;
  creationDate: FormControl<ISection['creationDate']>;
  time: FormControl<ISection['time']>;
  status: FormControl<ISection['status']>;
  courses: FormControl<ISection['courses']>;
};

export type SectionFormGroup = FormGroup<SectionFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class SectionFormService {
  createSectionFormGroup(section: SectionFormGroupInput = { id: null }): SectionFormGroup {
    const sectionRawValue = {
      ...this.getFormDefaults(),
      ...section,
    };
    return new FormGroup<SectionFormGroupContent>({
      id: new FormControl(
        { value: sectionRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      name: new FormControl(sectionRawValue.name),
      description: new FormControl(sectionRawValue.description),
      excerpt: new FormControl(sectionRawValue.excerpt),
      creationDate: new FormControl(sectionRawValue.creationDate),
      time: new FormControl(sectionRawValue.time),
      status: new FormControl(sectionRawValue.status),
      courses: new FormControl(sectionRawValue.courses),
    });
  }

  getSection(form: SectionFormGroup): ISection | NewSection {
    return form.getRawValue() as ISection | NewSection;
  }

  resetForm(form: SectionFormGroup, section: SectionFormGroupInput): void {
    const sectionRawValue = { ...this.getFormDefaults(), ...section };
    form.reset(
      {
        ...sectionRawValue,
        id: { value: sectionRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): SectionFormDefaults {
    return {
      id: null,
    };
  }
}
