import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { DATE_FORMAT } from 'app/config/input.constants';
import { INews } from '../news.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../news.test-samples';

import { NewsService, RestNews } from './news.service';

const requireRestSample: RestNews = {
  ...sampleWithRequiredData,
  creationDate: sampleWithRequiredData.creationDate?.format(DATE_FORMAT),
};

describe('News Service', () => {
  let service: NewsService;
  let httpMock: HttpTestingController;
  let expectedResult: INews | INews[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(NewsService);
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

    it('should create a News', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const news = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(news).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a News', () => {
      const news = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(news).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a News', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of News', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a News', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addNewsToCollectionIfMissing', () => {
      it('should add a News to an empty array', () => {
        const news: INews = sampleWithRequiredData;
        expectedResult = service.addNewsToCollectionIfMissing([], news);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(news);
      });

      it('should not add a News to an array that contains it', () => {
        const news: INews = sampleWithRequiredData;
        const newsCollection: INews[] = [
          {
            ...news,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addNewsToCollectionIfMissing(newsCollection, news);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a News to an array that doesn't contain it", () => {
        const news: INews = sampleWithRequiredData;
        const newsCollection: INews[] = [sampleWithPartialData];
        expectedResult = service.addNewsToCollectionIfMissing(newsCollection, news);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(news);
      });

      it('should add only unique News to an array', () => {
        const newsArray: INews[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const newsCollection: INews[] = [sampleWithRequiredData];
        expectedResult = service.addNewsToCollectionIfMissing(newsCollection, ...newsArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const news: INews = sampleWithRequiredData;
        const news2: INews = sampleWithPartialData;
        expectedResult = service.addNewsToCollectionIfMissing([], news, news2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(news);
        expect(expectedResult).toContain(news2);
      });

      it('should accept null and undefined values', () => {
        const news: INews = sampleWithRequiredData;
        expectedResult = service.addNewsToCollectionIfMissing([], null, news, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(news);
      });

      it('should return initial array if no News is added', () => {
        const newsCollection: INews[] = [sampleWithRequiredData];
        expectedResult = service.addNewsToCollectionIfMissing(newsCollection, undefined, null);
        expect(expectedResult).toEqual(newsCollection);
      });
    });

    describe('compareNews', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareNews(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareNews(entity1, entity2);
        const compareResult2 = service.compareNews(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareNews(entity1, entity2);
        const compareResult2 = service.compareNews(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareNews(entity1, entity2);
        const compareResult2 = service.compareNews(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
