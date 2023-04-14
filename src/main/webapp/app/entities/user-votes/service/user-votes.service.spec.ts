import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IUserVotes } from '../user-votes.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../user-votes.test-samples';

import { UserVotesService } from './user-votes.service';

const requireRestSample: IUserVotes = {
  ...sampleWithRequiredData,
};

describe('UserVotes Service', () => {
  let service: UserVotesService;
  let httpMock: HttpTestingController;
  let expectedResult: IUserVotes | IUserVotes[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(UserVotesService);
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

    it('should create a UserVotes', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const userVotes = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(userVotes).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a UserVotes', () => {
      const userVotes = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(userVotes).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a UserVotes', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of UserVotes', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a UserVotes', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addUserVotesToCollectionIfMissing', () => {
      it('should add a UserVotes to an empty array', () => {
        const userVotes: IUserVotes = sampleWithRequiredData;
        expectedResult = service.addUserVotesToCollectionIfMissing([], userVotes);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(userVotes);
      });

      it('should not add a UserVotes to an array that contains it', () => {
        const userVotes: IUserVotes = sampleWithRequiredData;
        const userVotesCollection: IUserVotes[] = [
          {
            ...userVotes,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addUserVotesToCollectionIfMissing(userVotesCollection, userVotes);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a UserVotes to an array that doesn't contain it", () => {
        const userVotes: IUserVotes = sampleWithRequiredData;
        const userVotesCollection: IUserVotes[] = [sampleWithPartialData];
        expectedResult = service.addUserVotesToCollectionIfMissing(userVotesCollection, userVotes);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(userVotes);
      });

      it('should add only unique UserVotes to an array', () => {
        const userVotesArray: IUserVotes[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const userVotesCollection: IUserVotes[] = [sampleWithRequiredData];
        expectedResult = service.addUserVotesToCollectionIfMissing(userVotesCollection, ...userVotesArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const userVotes: IUserVotes = sampleWithRequiredData;
        const userVotes2: IUserVotes = sampleWithPartialData;
        expectedResult = service.addUserVotesToCollectionIfMissing([], userVotes, userVotes2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(userVotes);
        expect(expectedResult).toContain(userVotes2);
      });

      it('should accept null and undefined values', () => {
        const userVotes: IUserVotes = sampleWithRequiredData;
        expectedResult = service.addUserVotesToCollectionIfMissing([], null, userVotes, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(userVotes);
      });

      it('should return initial array if no UserVotes is added', () => {
        const userVotesCollection: IUserVotes[] = [sampleWithRequiredData];
        expectedResult = service.addUserVotesToCollectionIfMissing(userVotesCollection, undefined, null);
        expect(expectedResult).toEqual(userVotesCollection);
      });
    });

    describe('compareUserVotes', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareUserVotes(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareUserVotes(entity1, entity2);
        const compareResult2 = service.compareUserVotes(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareUserVotes(entity1, entity2);
        const compareResult2 = service.compareUserVotes(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareUserVotes(entity1, entity2);
        const compareResult2 = service.compareUserVotes(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
