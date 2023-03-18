import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { DATE_FORMAT } from 'app/config/input.constants';
import { IPomodoro } from '../pomodoro.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../pomodoro.test-samples';

import { PomodoroService, RestPomodoro } from './pomodoro.service';

const requireRestSample: RestPomodoro = {
  ...sampleWithRequiredData,
  beginTime: sampleWithRequiredData.beginTime?.format(DATE_FORMAT),
  endTime: sampleWithRequiredData.endTime?.format(DATE_FORMAT),
  beginBreak: sampleWithRequiredData.beginBreak?.format(DATE_FORMAT),
  endBreak: sampleWithRequiredData.endBreak?.format(DATE_FORMAT),
};

describe('Pomodoro Service', () => {
  let service: PomodoroService;
  let httpMock: HttpTestingController;
  let expectedResult: IPomodoro | IPomodoro[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(PomodoroService);
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

    it('should create a Pomodoro', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const pomodoro = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(pomodoro).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Pomodoro', () => {
      const pomodoro = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(pomodoro).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Pomodoro', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Pomodoro', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Pomodoro', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addPomodoroToCollectionIfMissing', () => {
      it('should add a Pomodoro to an empty array', () => {
        const pomodoro: IPomodoro = sampleWithRequiredData;
        expectedResult = service.addPomodoroToCollectionIfMissing([], pomodoro);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(pomodoro);
      });

      it('should not add a Pomodoro to an array that contains it', () => {
        const pomodoro: IPomodoro = sampleWithRequiredData;
        const pomodoroCollection: IPomodoro[] = [
          {
            ...pomodoro,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addPomodoroToCollectionIfMissing(pomodoroCollection, pomodoro);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Pomodoro to an array that doesn't contain it", () => {
        const pomodoro: IPomodoro = sampleWithRequiredData;
        const pomodoroCollection: IPomodoro[] = [sampleWithPartialData];
        expectedResult = service.addPomodoroToCollectionIfMissing(pomodoroCollection, pomodoro);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(pomodoro);
      });

      it('should add only unique Pomodoro to an array', () => {
        const pomodoroArray: IPomodoro[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const pomodoroCollection: IPomodoro[] = [sampleWithRequiredData];
        expectedResult = service.addPomodoroToCollectionIfMissing(pomodoroCollection, ...pomodoroArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const pomodoro: IPomodoro = sampleWithRequiredData;
        const pomodoro2: IPomodoro = sampleWithPartialData;
        expectedResult = service.addPomodoroToCollectionIfMissing([], pomodoro, pomodoro2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(pomodoro);
        expect(expectedResult).toContain(pomodoro2);
      });

      it('should accept null and undefined values', () => {
        const pomodoro: IPomodoro = sampleWithRequiredData;
        expectedResult = service.addPomodoroToCollectionIfMissing([], null, pomodoro, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(pomodoro);
      });

      it('should return initial array if no Pomodoro is added', () => {
        const pomodoroCollection: IPomodoro[] = [sampleWithRequiredData];
        expectedResult = service.addPomodoroToCollectionIfMissing(pomodoroCollection, undefined, null);
        expect(expectedResult).toEqual(pomodoroCollection);
      });
    });

    describe('comparePomodoro', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.comparePomodoro(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.comparePomodoro(entity1, entity2);
        const compareResult2 = service.comparePomodoro(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.comparePomodoro(entity1, entity2);
        const compareResult2 = service.comparePomodoro(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.comparePomodoro(entity1, entity2);
        const compareResult2 = service.comparePomodoro(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
