import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { DATE_FORMAT } from 'app/config/input.constants';
import { IExtraUserInfo } from '../extra-user-info.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../extra-user-info.test-samples';

import { ExtraUserInfoService, RestExtraUserInfo } from './extra-user-info.service';

const requireRestSample: RestExtraUserInfo = {
  ...sampleWithRequiredData,
  birthDay: sampleWithRequiredData.birthDay?.format(DATE_FORMAT),
};

describe('ExtraUserInfo Service', () => {
  let service: ExtraUserInfoService;
  let httpMock: HttpTestingController;
  let expectedResult: IExtraUserInfo | IExtraUserInfo[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ExtraUserInfoService);
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

    it('should create a ExtraUserInfo', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const extraUserInfo = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(extraUserInfo).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a ExtraUserInfo', () => {
      const extraUserInfo = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(extraUserInfo).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a ExtraUserInfo', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of ExtraUserInfo', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a ExtraUserInfo', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addExtraUserInfoToCollectionIfMissing', () => {
      it('should add a ExtraUserInfo to an empty array', () => {
        const extraUserInfo: IExtraUserInfo = sampleWithRequiredData;
        expectedResult = service.addExtraUserInfoToCollectionIfMissing([], extraUserInfo);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(extraUserInfo);
      });

      it('should not add a ExtraUserInfo to an array that contains it', () => {
        const extraUserInfo: IExtraUserInfo = sampleWithRequiredData;
        const extraUserInfoCollection: IExtraUserInfo[] = [
          {
            ...extraUserInfo,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addExtraUserInfoToCollectionIfMissing(extraUserInfoCollection, extraUserInfo);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a ExtraUserInfo to an array that doesn't contain it", () => {
        const extraUserInfo: IExtraUserInfo = sampleWithRequiredData;
        const extraUserInfoCollection: IExtraUserInfo[] = [sampleWithPartialData];
        expectedResult = service.addExtraUserInfoToCollectionIfMissing(extraUserInfoCollection, extraUserInfo);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(extraUserInfo);
      });

      it('should add only unique ExtraUserInfo to an array', () => {
        const extraUserInfoArray: IExtraUserInfo[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const extraUserInfoCollection: IExtraUserInfo[] = [sampleWithRequiredData];
        expectedResult = service.addExtraUserInfoToCollectionIfMissing(extraUserInfoCollection, ...extraUserInfoArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const extraUserInfo: IExtraUserInfo = sampleWithRequiredData;
        const extraUserInfo2: IExtraUserInfo = sampleWithPartialData;
        expectedResult = service.addExtraUserInfoToCollectionIfMissing([], extraUserInfo, extraUserInfo2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(extraUserInfo);
        expect(expectedResult).toContain(extraUserInfo2);
      });

      it('should accept null and undefined values', () => {
        const extraUserInfo: IExtraUserInfo = sampleWithRequiredData;
        expectedResult = service.addExtraUserInfoToCollectionIfMissing([], null, extraUserInfo, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(extraUserInfo);
      });

      it('should return initial array if no ExtraUserInfo is added', () => {
        const extraUserInfoCollection: IExtraUserInfo[] = [sampleWithRequiredData];
        expectedResult = service.addExtraUserInfoToCollectionIfMissing(extraUserInfoCollection, undefined, null);
        expect(expectedResult).toEqual(extraUserInfoCollection);
      });
    });

    describe('compareExtraUserInfo', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareExtraUserInfo(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareExtraUserInfo(entity1, entity2);
        const compareResult2 = service.compareExtraUserInfo(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareExtraUserInfo(entity1, entity2);
        const compareResult2 = service.compareExtraUserInfo(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareExtraUserInfo(entity1, entity2);
        const compareResult2 = service.compareExtraUserInfo(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
