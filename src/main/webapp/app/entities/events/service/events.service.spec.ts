import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { DATE_FORMAT } from 'app/config/input.constants';
import { IEvents } from '../events.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../events.test-samples';

import { EventsService, RestEvents } from './events.service';

const requireRestSample: RestEvents = {
  ...sampleWithRequiredData,
  startDate: sampleWithRequiredData.startDate?.format(DATE_FORMAT),
  endDate: sampleWithRequiredData.endDate?.format(DATE_FORMAT),
};

describe('Events Service', () => {
  let service: EventsService;
  let httpMock: HttpTestingController;
  let expectedResult: IEvents | IEvents[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(EventsService);
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

    it('should create a Events', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const events = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(events).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Events', () => {
      const events = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(events).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Events', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Events', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Events', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addEventsToCollectionIfMissing', () => {
      it('should add a Events to an empty array', () => {
        const events: IEvents = sampleWithRequiredData;
        expectedResult = service.addEventsToCollectionIfMissing([], events);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(events);
      });

      it('should not add a Events to an array that contains it', () => {
        const events: IEvents = sampleWithRequiredData;
        const eventsCollection: IEvents[] = [
          {
            ...events,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addEventsToCollectionIfMissing(eventsCollection, events);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Events to an array that doesn't contain it", () => {
        const events: IEvents = sampleWithRequiredData;
        const eventsCollection: IEvents[] = [sampleWithPartialData];
        expectedResult = service.addEventsToCollectionIfMissing(eventsCollection, events);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(events);
      });

      it('should add only unique Events to an array', () => {
        const eventsArray: IEvents[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const eventsCollection: IEvents[] = [sampleWithRequiredData];
        expectedResult = service.addEventsToCollectionIfMissing(eventsCollection, ...eventsArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const events: IEvents = sampleWithRequiredData;
        const events2: IEvents = sampleWithPartialData;
        expectedResult = service.addEventsToCollectionIfMissing([], events, events2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(events);
        expect(expectedResult).toContain(events2);
      });

      it('should accept null and undefined values', () => {
        const events: IEvents = sampleWithRequiredData;
        expectedResult = service.addEventsToCollectionIfMissing([], null, events, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(events);
      });

      it('should return initial array if no Events is added', () => {
        const eventsCollection: IEvents[] = [sampleWithRequiredData];
        expectedResult = service.addEventsToCollectionIfMissing(eventsCollection, undefined, null);
        expect(expectedResult).toEqual(eventsCollection);
      });
    });

    describe('compareEvents', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareEvents(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareEvents(entity1, entity2);
        const compareResult2 = service.compareEvents(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareEvents(entity1, entity2);
        const compareResult2 = service.compareEvents(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareEvents(entity1, entity2);
        const compareResult2 = service.compareEvents(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
