import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../events.test-samples';

import { EventsFormService } from './events-form.service';

describe('Events Form Service', () => {
  let service: EventsFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EventsFormService);
  });

  describe('Service methods', () => {
    describe('createEventsFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createEventsFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            description: expect.any(Object),
            startDate: expect.any(Object),
            endDate: expect.any(Object),
            url: expect.any(Object),
            status: expect.any(Object),
            address: expect.any(Object),
            user: expect.any(Object),
          })
        );
      });

      it('passing IEvents should create a new form with FormGroup', () => {
        const formGroup = service.createEventsFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            description: expect.any(Object),
            startDate: expect.any(Object),
            endDate: expect.any(Object),
            url: expect.any(Object),
            status: expect.any(Object),
            address: expect.any(Object),
            user: expect.any(Object),
          })
        );
      });
    });

    describe('getEvents', () => {
      it('should return NewEvents for default Events initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createEventsFormGroup(sampleWithNewData);

        const events = service.getEvents(formGroup) as any;

        expect(events).toMatchObject(sampleWithNewData);
      });

      it('should return NewEvents for empty Events initial value', () => {
        const formGroup = service.createEventsFormGroup();

        const events = service.getEvents(formGroup) as any;

        expect(events).toMatchObject({});
      });

      it('should return IEvents', () => {
        const formGroup = service.createEventsFormGroup(sampleWithRequiredData);

        const events = service.getEvents(formGroup) as any;

        expect(events).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IEvents should not enable id FormControl', () => {
        const formGroup = service.createEventsFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewEvents should disable id FormControl', () => {
        const formGroup = service.createEventsFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
