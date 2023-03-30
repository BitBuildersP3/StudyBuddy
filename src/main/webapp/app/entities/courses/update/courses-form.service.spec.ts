import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../courses.test-samples';

import { CoursesFormService } from './courses-form.service';

describe('Courses Form Service', () => {
  let service: CoursesFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CoursesFormService);
  });

  describe('Service methods', () => {
    describe('createCoursesFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createCoursesFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            description: expect.any(Object),
            previewImg: expect.any(Object),
            status: expect.any(Object),
            score: expect.any(Object),
            excerpt: expect.any(Object),
            userId: expect.any(Object),
            ownerName: expect.any(Object),
            userName: expect.any(Object),
            userVotes: expect.any(Object),
            users: expect.any(Object),
            category: expect.any(Object),
          })
        );
      });

      it('passing ICourses should create a new form with FormGroup', () => {
        const formGroup = service.createCoursesFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            description: expect.any(Object),
            previewImg: expect.any(Object),
            status: expect.any(Object),
            score: expect.any(Object),
            excerpt: expect.any(Object),
            userId: expect.any(Object),
            ownerName: expect.any(Object),
            userName: expect.any(Object),
            userVotes: expect.any(Object),
            users: expect.any(Object),
            category: expect.any(Object),
          })
        );
      });
    });

    describe('getCourses', () => {
      it('should return NewCourses for default Courses initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createCoursesFormGroup(sampleWithNewData);

        const courses = service.getCourses(formGroup) as any;

        expect(courses).toMatchObject(sampleWithNewData);
      });

      it('should return NewCourses for empty Courses initial value', () => {
        const formGroup = service.createCoursesFormGroup();

        const courses = service.getCourses(formGroup) as any;

        expect(courses).toMatchObject({});
      });

      it('should return ICourses', () => {
        const formGroup = service.createCoursesFormGroup(sampleWithRequiredData);

        const courses = service.getCourses(formGroup) as any;

        expect(courses).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ICourses should not enable id FormControl', () => {
        const formGroup = service.createCoursesFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewCourses should disable id FormControl', () => {
        const formGroup = service.createCoursesFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
