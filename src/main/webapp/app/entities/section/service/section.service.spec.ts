import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { DATE_FORMAT } from 'app/config/input.constants';
import { ISection } from '../section.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../section.test-samples';

import { SectionService, RestSection } from './section.service';

const requireRestSample: RestSection = {
  ...sampleWithRequiredData,
  creationDate: sampleWithRequiredData.creationDate?.format(DATE_FORMAT),
};

describe('Section Service', () => {
  let service: SectionService;
  let httpMock: HttpTestingController;
  let expectedResult: ISection | ISection[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(SectionService);
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

    it('should create a Section', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const section = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(section).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Section', () => {
      const section = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(section).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Section', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Section', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Section', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addSectionToCollectionIfMissing', () => {
      it('should add a Section to an empty array', () => {
        const section: ISection = sampleWithRequiredData;
        expectedResult = service.addSectionToCollectionIfMissing([], section);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(section);
      });

      it('should not add a Section to an array that contains it', () => {
        const section: ISection = sampleWithRequiredData;
        const sectionCollection: ISection[] = [
          {
            ...section,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addSectionToCollectionIfMissing(sectionCollection, section);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Section to an array that doesn't contain it", () => {
        const section: ISection = sampleWithRequiredData;
        const sectionCollection: ISection[] = [sampleWithPartialData];
        expectedResult = service.addSectionToCollectionIfMissing(sectionCollection, section);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(section);
      });

      it('should add only unique Section to an array', () => {
        const sectionArray: ISection[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const sectionCollection: ISection[] = [sampleWithRequiredData];
        expectedResult = service.addSectionToCollectionIfMissing(sectionCollection, ...sectionArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const section: ISection = sampleWithRequiredData;
        const section2: ISection = sampleWithPartialData;
        expectedResult = service.addSectionToCollectionIfMissing([], section, section2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(section);
        expect(expectedResult).toContain(section2);
      });

      it('should accept null and undefined values', () => {
        const section: ISection = sampleWithRequiredData;
        expectedResult = service.addSectionToCollectionIfMissing([], null, section, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(section);
      });

      it('should return initial array if no Section is added', () => {
        const sectionCollection: ISection[] = [sampleWithRequiredData];
        expectedResult = service.addSectionToCollectionIfMissing(sectionCollection, undefined, null);
        expect(expectedResult).toEqual(sectionCollection);
      });
    });

    describe('compareSection', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareSection(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareSection(entity1, entity2);
        const compareResult2 = service.compareSection(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareSection(entity1, entity2);
        const compareResult2 = service.compareSection(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareSection(entity1, entity2);
        const compareResult2 = service.compareSection(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
