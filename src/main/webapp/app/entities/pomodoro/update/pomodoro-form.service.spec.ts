import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../pomodoro.test-samples';

import { PomodoroFormService } from './pomodoro-form.service';

describe('Pomodoro Form Service', () => {
  let service: PomodoroFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PomodoroFormService);
  });

  describe('Service methods', () => {
    describe('createPomodoroFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createPomodoroFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            beginTime: expect.any(Object),
            endTime: expect.any(Object),
            totalTime: expect.any(Object),
            status: expect.any(Object),
            task: expect.any(Object),
            beginBreak: expect.any(Object),
            endBreak: expect.any(Object),
            totalBreak: expect.any(Object),
            user: expect.any(Object),
          })
        );
      });

      it('passing IPomodoro should create a new form with FormGroup', () => {
        const formGroup = service.createPomodoroFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            beginTime: expect.any(Object),
            endTime: expect.any(Object),
            totalTime: expect.any(Object),
            status: expect.any(Object),
            task: expect.any(Object),
            beginBreak: expect.any(Object),
            endBreak: expect.any(Object),
            totalBreak: expect.any(Object),
            user: expect.any(Object),
          })
        );
      });
    });

    describe('getPomodoro', () => {
      it('should return NewPomodoro for default Pomodoro initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createPomodoroFormGroup(sampleWithNewData);

        const pomodoro = service.getPomodoro(formGroup) as any;

        expect(pomodoro).toMatchObject(sampleWithNewData);
      });

      it('should return NewPomodoro for empty Pomodoro initial value', () => {
        const formGroup = service.createPomodoroFormGroup();

        const pomodoro = service.getPomodoro(formGroup) as any;

        expect(pomodoro).toMatchObject({});
      });

      it('should return IPomodoro', () => {
        const formGroup = service.createPomodoroFormGroup(sampleWithRequiredData);

        const pomodoro = service.getPomodoro(formGroup) as any;

        expect(pomodoro).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IPomodoro should not enable id FormControl', () => {
        const formGroup = service.createPomodoroFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewPomodoro should disable id FormControl', () => {
        const formGroup = service.createPomodoroFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
