import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../section.test-samples';

import { SectionFormService } from './section-form.service';

describe('Section Form Service', () => {
  let service: SectionFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SectionFormService);
  });

  describe('Service methods', () => {
    describe('createSectionFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createSectionFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            description: expect.any(Object),
            excerpt: expect.any(Object),
            creationDate: expect.any(Object),
            time: expect.any(Object),
            status: expect.any(Object),
            courses: expect.any(Object),
          })
        );
      });

      it('passing ISection should create a new form with FormGroup', () => {
        const formGroup = service.createSectionFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            description: expect.any(Object),
            excerpt: expect.any(Object),
            creationDate: expect.any(Object),
            time: expect.any(Object),
            status: expect.any(Object),
            courses: expect.any(Object),
          })
        );
      });
    });

    describe('getSection', () => {
      it('should return NewSection for default Section initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createSectionFormGroup(sampleWithNewData);

        const section = service.getSection(formGroup) as any;

        expect(section).toMatchObject(sampleWithNewData);
      });

      it('should return NewSection for empty Section initial value', () => {
        const formGroup = service.createSectionFormGroup();

        const section = service.getSection(formGroup) as any;

        expect(section).toMatchObject({});
      });

      it('should return ISection', () => {
        const formGroup = service.createSectionFormGroup(sampleWithRequiredData);

        const section = service.getSection(formGroup) as any;

        expect(section).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ISection should not enable id FormControl', () => {
        const formGroup = service.createSectionFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewSection should disable id FormControl', () => {
        const formGroup = service.createSectionFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
