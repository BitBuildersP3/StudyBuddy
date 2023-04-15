import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../course-votes.test-samples';

import { CourseVotesFormService } from './course-votes-form.service';

describe('CourseVotes Form Service', () => {
  let service: CourseVotesFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CourseVotesFormService);
  });

  describe('Service methods', () => {
    describe('createCourseVotesFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createCourseVotesFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            idCourse: expect.any(Object),
            json: expect.any(Object),
          })
        );
      });

      it('passing ICourseVotes should create a new form with FormGroup', () => {
        const formGroup = service.createCourseVotesFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            idCourse: expect.any(Object),
            json: expect.any(Object),
          })
        );
      });
    });

    describe('getCourseVotes', () => {
      it('should return NewCourseVotes for default CourseVotes initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createCourseVotesFormGroup(sampleWithNewData);

        const courseVotes = service.getCourseVotes(formGroup) as any;

        expect(courseVotes).toMatchObject(sampleWithNewData);
      });

      it('should return NewCourseVotes for empty CourseVotes initial value', () => {
        const formGroup = service.createCourseVotesFormGroup();

        const courseVotes = service.getCourseVotes(formGroup) as any;

        expect(courseVotes).toMatchObject({});
      });

      it('should return ICourseVotes', () => {
        const formGroup = service.createCourseVotesFormGroup(sampleWithRequiredData);

        const courseVotes = service.getCourseVotes(formGroup) as any;

        expect(courseVotes).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ICourseVotes should not enable id FormControl', () => {
        const formGroup = service.createCourseVotesFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewCourseVotes should disable id FormControl', () => {
        const formGroup = service.createCourseVotesFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
