import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ICourses } from '../courses.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../courses.test-samples';

import { CoursesService } from './courses.service';

const requireRestSample: ICourses = {
  ...sampleWithRequiredData,
};

describe('Courses Service', () => {
  let service: CoursesService;
  let httpMock: HttpTestingController;
  let expectedResult: ICourses | ICourses[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(CoursesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a Courses', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const courses = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(courses).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Courses', () => {
      const courses = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(courses).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Courses', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Courses', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Courses', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addCoursesToCollectionIfMissing', () => {
      it('should add a Courses to an empty array', () => {
        const courses: ICourses = sampleWithRequiredData;
        expectedResult = service.addCoursesToCollectionIfMissing([], courses);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(courses);
      });

      it('should not add a Courses to an array that contains it', () => {
        const courses: ICourses = sampleWithRequiredData;
        const coursesCollection: ICourses[] = [
          {
            ...courses,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addCoursesToCollectionIfMissing(coursesCollection, courses);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Courses to an array that doesn't contain it", () => {
        const courses: ICourses = sampleWithRequiredData;
        const coursesCollection: ICourses[] = [sampleWithPartialData];
        expectedResult = service.addCoursesToCollectionIfMissing(coursesCollection, courses);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(courses);
      });

      it('should add only unique Courses to an array', () => {
        const coursesArray: ICourses[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const coursesCollection: ICourses[] = [sampleWithRequiredData];
        expectedResult = service.addCoursesToCollectionIfMissing(coursesCollection, ...coursesArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const courses: ICourses = sampleWithRequiredData;
        const courses2: ICourses = sampleWithPartialData;
        expectedResult = service.addCoursesToCollectionIfMissing([], courses, courses2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(courses);
        expect(expectedResult).toContain(courses2);
      });

      it('should accept null and undefined values', () => {
        const courses: ICourses = sampleWithRequiredData;
        expectedResult = service.addCoursesToCollectionIfMissing([], null, courses, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(courses);
      });

      it('should return initial array if no Courses is added', () => {
        const coursesCollection: ICourses[] = [sampleWithRequiredData];
        expectedResult = service.addCoursesToCollectionIfMissing(coursesCollection, undefined, null);
        expect(expectedResult).toEqual(coursesCollection);
      });
    });

    describe('compareCourses', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareCourses(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareCourses(entity1, entity2);
        const compareResult2 = service.compareCourses(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareCourses(entity1, entity2);
        const compareResult2 = service.compareCourses(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareCourses(entity1, entity2);
        const compareResult2 = service.compareCourses(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
