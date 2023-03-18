import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../files.test-samples';

import { FilesFormService } from './files-form.service';

describe('Files Form Service', () => {
  let service: FilesFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FilesFormService);
  });

  describe('Service methods', () => {
    describe('createFilesFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createFilesFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            type: expect.any(Object),
            url1: expect.any(Object),
            url2: expect.any(Object),
            url3: expect.any(Object),
            status: expect.any(Object),
            name: expect.any(Object),
            excerpt: expect.any(Object),
            publishDate: expect.any(Object),
            section: expect.any(Object),
          })
        );
      });

      it('passing IFiles should create a new form with FormGroup', () => {
        const formGroup = service.createFilesFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            type: expect.any(Object),
            url1: expect.any(Object),
            url2: expect.any(Object),
            url3: expect.any(Object),
            status: expect.any(Object),
            name: expect.any(Object),
            excerpt: expect.any(Object),
            publishDate: expect.any(Object),
            section: expect.any(Object),
          })
        );
      });
    });

    describe('getFiles', () => {
      it('should return NewFiles for default Files initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createFilesFormGroup(sampleWithNewData);

        const files = service.getFiles(formGroup) as any;

        expect(files).toMatchObject(sampleWithNewData);
      });

      it('should return NewFiles for empty Files initial value', () => {
        const formGroup = service.createFilesFormGroup();

        const files = service.getFiles(formGroup) as any;

        expect(files).toMatchObject({});
      });

      it('should return IFiles', () => {
        const formGroup = service.createFilesFormGroup(sampleWithRequiredData);

        const files = service.getFiles(formGroup) as any;

        expect(files).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IFiles should not enable id FormControl', () => {
        const formGroup = service.createFilesFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewFiles should disable id FormControl', () => {
        const formGroup = service.createFilesFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
