import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IEvents, NewEvents } from '../events.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IEvents for edit and NewEventsFormGroupInput for create.
 */
type EventsFormGroupInput = IEvents | PartialWithRequiredKeyOf<NewEvents>;

type EventsFormDefaults = Pick<NewEvents, 'id'>;

type EventsFormGroupContent = {
  id: FormControl<IEvents['id'] | NewEvents['id']>;
  name: FormControl<IEvents['name']>;
  description: FormControl<IEvents['description']>;
  startDate: FormControl<IEvents['startDate']>;
  endDate: FormControl<IEvents['endDate']>;
  url: FormControl<IEvents['url']>;
  status: FormControl<IEvents['status']>;
  address: FormControl<IEvents['address']>;
  user: FormControl<IEvents['user']>;
};

export type EventsFormGroup = FormGroup<EventsFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class EventsFormService {
  createEventsFormGroup(events: EventsFormGroupInput = { id: null }): EventsFormGroup {
    const eventsRawValue = {
      ...this.getFormDefaults(),
      ...events,
    };
    return new FormGroup<EventsFormGroupContent>({
      id: new FormControl(
        { value: eventsRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      name: new FormControl(eventsRawValue.name),
      description: new FormControl(eventsRawValue.description),
      startDate: new FormControl(eventsRawValue.startDate),
      endDate: new FormControl(eventsRawValue.endDate),
      url: new FormControl(eventsRawValue.url),
      status: new FormControl(eventsRawValue.status),
      address: new FormControl(eventsRawValue.address),
      user: new FormControl(eventsRawValue.user),
    });
  }

  getEvents(form: EventsFormGroup): IEvents | NewEvents {
    return form.getRawValue() as IEvents | NewEvents;
  }

  resetForm(form: EventsFormGroup, events: EventsFormGroupInput): void {
    const eventsRawValue = { ...this.getFormDefaults(), ...events };
    form.reset(
      {
        ...eventsRawValue,
        id: { value: eventsRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): EventsFormDefaults {
    return {
      id: null,
    };
  }
}
