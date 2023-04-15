import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IForoEntity } from '../foro-entity.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../foro-entity.test-samples';

import { ForoEntityService } from './foro-entity.service';

const requireRestSample: IForoEntity = {
  ...sampleWithRequiredData,
};

describe('ForoEntity Service', () => {
  let service: ForoEntityService;
  let httpMock: HttpTestingController;
  let expectedResult: IForoEntity | IForoEntity[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ForoEntityService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find('ABC').subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a ForoEntity', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const foroEntity = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(foroEntity).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a ForoEntity', () => {
      const foroEntity = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(foroEntity).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a ForoEntity', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of ForoEntity', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a ForoEntity', () => {
      const expected = true;

      service.delete('ABC').subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addForoEntityToCollectionIfMissing', () => {
      it('should add a ForoEntity to an empty array', () => {
        const foroEntity: IForoEntity = sampleWithRequiredData;
        expectedResult = service.addForoEntityToCollectionIfMissing([], foroEntity);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(foroEntity);
      });

      it('should not add a ForoEntity to an array that contains it', () => {
        const foroEntity: IForoEntity = sampleWithRequiredData;
        const foroEntityCollection: IForoEntity[] = [
          {
            ...foroEntity,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addForoEntityToCollectionIfMissing(foroEntityCollection, foroEntity);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a ForoEntity to an array that doesn't contain it", () => {
        const foroEntity: IForoEntity = sampleWithRequiredData;
        const foroEntityCollection: IForoEntity[] = [sampleWithPartialData];
        expectedResult = service.addForoEntityToCollectionIfMissing(foroEntityCollection, foroEntity);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(foroEntity);
      });

      it('should add only unique ForoEntity to an array', () => {
        const foroEntityArray: IForoEntity[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const foroEntityCollection: IForoEntity[] = [sampleWithRequiredData];
        expectedResult = service.addForoEntityToCollectionIfMissing(foroEntityCollection, ...foroEntityArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const foroEntity: IForoEntity = sampleWithRequiredData;
        const foroEntity2: IForoEntity = sampleWithPartialData;
        expectedResult = service.addForoEntityToCollectionIfMissing([], foroEntity, foroEntity2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(foroEntity);
        expect(expectedResult).toContain(foroEntity2);
      });

      it('should accept null and undefined values', () => {
        const foroEntity: IForoEntity = sampleWithRequiredData;
        expectedResult = service.addForoEntityToCollectionIfMissing([], null, foroEntity, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(foroEntity);
      });

      it('should return initial array if no ForoEntity is added', () => {
        const foroEntityCollection: IForoEntity[] = [sampleWithRequiredData];
        expectedResult = service.addForoEntityToCollectionIfMissing(foroEntityCollection, undefined, null);
        expect(expectedResult).toEqual(foroEntityCollection);
      });
    });

    describe('compareForoEntity', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareForoEntity(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 'ABC' };
        const entity2 = null;

        const compareResult1 = service.compareForoEntity(entity1, entity2);
        const compareResult2 = service.compareForoEntity(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 'ABC' };
        const entity2 = { id: 'CBA' };

        const compareResult1 = service.compareForoEntity(entity1, entity2);
        const compareResult2 = service.compareForoEntity(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 'ABC' };
        const entity2 = { id: 'ABC' };

        const compareResult1 = service.compareForoEntity(entity1, entity2);
        const compareResult2 = service.compareForoEntity(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
