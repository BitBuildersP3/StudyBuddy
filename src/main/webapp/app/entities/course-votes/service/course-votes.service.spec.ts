import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ICourseVotes } from '../course-votes.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../course-votes.test-samples';

import { CourseVotesService } from './course-votes.service';

const requireRestSample: ICourseVotes = {
  ...sampleWithRequiredData,
};

describe('CourseVotes Service', () => {
  let service: CourseVotesService;
  let httpMock: HttpTestingController;
  let expectedResult: ICourseVotes | ICourseVotes[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(CourseVotesService);
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

    it('should create a CourseVotes', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const courseVotes = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(courseVotes).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a CourseVotes', () => {
      const courseVotes = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(courseVotes).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a CourseVotes', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of CourseVotes', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a CourseVotes', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addCourseVotesToCollectionIfMissing', () => {
      it('should add a CourseVotes to an empty array', () => {
        const courseVotes: ICourseVotes = sampleWithRequiredData;
        expectedResult = service.addCourseVotesToCollectionIfMissing([], courseVotes);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(courseVotes);
      });

      it('should not add a CourseVotes to an array that contains it', () => {
        const courseVotes: ICourseVotes = sampleWithRequiredData;
        const courseVotesCollection: ICourseVotes[] = [
          {
            ...courseVotes,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addCourseVotesToCollectionIfMissing(courseVotesCollection, courseVotes);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a CourseVotes to an array that doesn't contain it", () => {
        const courseVotes: ICourseVotes = sampleWithRequiredData;
        const courseVotesCollection: ICourseVotes[] = [sampleWithPartialData];
        expectedResult = service.addCourseVotesToCollectionIfMissing(courseVotesCollection, courseVotes);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(courseVotes);
      });

      it('should add only unique CourseVotes to an array', () => {
        const courseVotesArray: ICourseVotes[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const courseVotesCollection: ICourseVotes[] = [sampleWithRequiredData];
        expectedResult = service.addCourseVotesToCollectionIfMissing(courseVotesCollection, ...courseVotesArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const courseVotes: ICourseVotes = sampleWithRequiredData;
        const courseVotes2: ICourseVotes = sampleWithPartialData;
        expectedResult = service.addCourseVotesToCollectionIfMissing([], courseVotes, courseVotes2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(courseVotes);
        expect(expectedResult).toContain(courseVotes2);
      });

      it('should accept null and undefined values', () => {
        const courseVotes: ICourseVotes = sampleWithRequiredData;
        expectedResult = service.addCourseVotesToCollectionIfMissing([], null, courseVotes, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(courseVotes);
      });

      it('should return initial array if no CourseVotes is added', () => {
        const courseVotesCollection: ICourseVotes[] = [sampleWithRequiredData];
        expectedResult = service.addCourseVotesToCollectionIfMissing(courseVotesCollection, undefined, null);
        expect(expectedResult).toEqual(courseVotesCollection);
      });
    });

    describe('compareCourseVotes', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareCourseVotes(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareCourseVotes(entity1, entity2);
        const compareResult2 = service.compareCourseVotes(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareCourseVotes(entity1, entity2);
        const compareResult2 = service.compareCourseVotes(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareCourseVotes(entity1, entity2);
        const compareResult2 = service.compareCourseVotes(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
