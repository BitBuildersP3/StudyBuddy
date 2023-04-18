import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../foro-entity.test-samples';

import { ForoEntityFormService } from './foro-entity-form.service';

describe('ForoEntity Form Service', () => {
  let service: ForoEntityFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ForoEntityFormService);
  });

  describe('Service methods', () => {
    describe('createForoEntityFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createForoEntityFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            json: expect.any(Object),
          })
        );
      });

      it('passing IForoEntity should create a new form with FormGroup', () => {
        const formGroup = service.createForoEntityFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            json: expect.any(Object),
          })
        );
      });
    });

    describe('getForoEntity', () => {
      it('should return NewForoEntity for default ForoEntity initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createForoEntityFormGroup(sampleWithNewData);

        const foroEntity = service.getForoEntity(formGroup) as any;

        expect(foroEntity).toMatchObject(sampleWithNewData);
      });

      it('should return NewForoEntity for empty ForoEntity initial value', () => {
        const formGroup = service.createForoEntityFormGroup();

        const foroEntity = service.getForoEntity(formGroup) as any;

        expect(foroEntity).toMatchObject({});
      });

      it('should return IForoEntity', () => {
        const formGroup = service.createForoEntityFormGroup(sampleWithRequiredData);

        const foroEntity = service.getForoEntity(formGroup) as any;

        expect(foroEntity).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IForoEntity should not enable id FormControl', () => {
        const formGroup = service.createForoEntityFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewForoEntity should disable id FormControl', () => {
        const formGroup = service.createForoEntityFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
