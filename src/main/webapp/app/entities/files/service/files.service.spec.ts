import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { DATE_FORMAT } from 'app/config/input.constants';
import { IFiles } from '../files.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../files.test-samples';

import { FilesService, RestFiles } from './files.service';

const requireRestSample: RestFiles = {
  ...sampleWithRequiredData,
  publishDate: sampleWithRequiredData.publishDate?.format(DATE_FORMAT),
};

describe('Files Service', () => {
  let service: FilesService;
  let httpMock: HttpTestingController;
  let expectedResult: IFiles | IFiles[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(FilesService);
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

    it('should create a Files', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const files = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(files).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Files', () => {
      const files = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(files).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Files', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Files', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Files', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addFilesToCollectionIfMissing', () => {
      it('should add a Files to an empty array', () => {
        const files: IFiles = sampleWithRequiredData;
        expectedResult = service.addFilesToCollectionIfMissing([], files);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(files);
      });

      it('should not add a Files to an array that contains it', () => {
        const files: IFiles = sampleWithRequiredData;
        const filesCollection: IFiles[] = [
          {
            ...files,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addFilesToCollectionIfMissing(filesCollection, files);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Files to an array that doesn't contain it", () => {
        const files: IFiles = sampleWithRequiredData;
        const filesCollection: IFiles[] = [sampleWithPartialData];
        expectedResult = service.addFilesToCollectionIfMissing(filesCollection, files);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(files);
      });

      it('should add only unique Files to an array', () => {
        const filesArray: IFiles[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const filesCollection: IFiles[] = [sampleWithRequiredData];
        expectedResult = service.addFilesToCollectionIfMissing(filesCollection, ...filesArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const files: IFiles = sampleWithRequiredData;
        const files2: IFiles = sampleWithPartialData;
        expectedResult = service.addFilesToCollectionIfMissing([], files, files2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(files);
        expect(expectedResult).toContain(files2);
      });

      it('should accept null and undefined values', () => {
        const files: IFiles = sampleWithRequiredData;
        expectedResult = service.addFilesToCollectionIfMissing([], null, files, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(files);
      });

      it('should return initial array if no Files is added', () => {
        const filesCollection: IFiles[] = [sampleWithRequiredData];
        expectedResult = service.addFilesToCollectionIfMissing(filesCollection, undefined, null);
        expect(expectedResult).toEqual(filesCollection);
      });
    });

    describe('compareFiles', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareFiles(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareFiles(entity1, entity2);
        const compareResult2 = service.compareFiles(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareFiles(entity1, entity2);
        const compareResult2 = service.compareFiles(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareFiles(entity1, entity2);
        const compareResult2 = service.compareFiles(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
