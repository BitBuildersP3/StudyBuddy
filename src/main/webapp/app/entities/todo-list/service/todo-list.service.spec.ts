import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ITodoList } from '../todo-list.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../todo-list.test-samples';

import { TodoListService } from './todo-list.service';

const requireRestSample: ITodoList = {
  ...sampleWithRequiredData,
};

describe('TodoList Service', () => {
  let service: TodoListService;
  let httpMock: HttpTestingController;
  let expectedResult: ITodoList | ITodoList[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(TodoListService);
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

    it('should create a TodoList', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const todoList = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(todoList).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a TodoList', () => {
      const todoList = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(todoList).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a TodoList', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of TodoList', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a TodoList', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addTodoListToCollectionIfMissing', () => {
      it('should add a TodoList to an empty array', () => {
        const todoList: ITodoList = sampleWithRequiredData;
        expectedResult = service.addTodoListToCollectionIfMissing([], todoList);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(todoList);
      });

      it('should not add a TodoList to an array that contains it', () => {
        const todoList: ITodoList = sampleWithRequiredData;
        const todoListCollection: ITodoList[] = [
          {
            ...todoList,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addTodoListToCollectionIfMissing(todoListCollection, todoList);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a TodoList to an array that doesn't contain it", () => {
        const todoList: ITodoList = sampleWithRequiredData;
        const todoListCollection: ITodoList[] = [sampleWithPartialData];
        expectedResult = service.addTodoListToCollectionIfMissing(todoListCollection, todoList);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(todoList);
      });

      it('should add only unique TodoList to an array', () => {
        const todoListArray: ITodoList[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const todoListCollection: ITodoList[] = [sampleWithRequiredData];
        expectedResult = service.addTodoListToCollectionIfMissing(todoListCollection, ...todoListArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const todoList: ITodoList = sampleWithRequiredData;
        const todoList2: ITodoList = sampleWithPartialData;
        expectedResult = service.addTodoListToCollectionIfMissing([], todoList, todoList2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(todoList);
        expect(expectedResult).toContain(todoList2);
      });

      it('should accept null and undefined values', () => {
        const todoList: ITodoList = sampleWithRequiredData;
        expectedResult = service.addTodoListToCollectionIfMissing([], null, todoList, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(todoList);
      });

      it('should return initial array if no TodoList is added', () => {
        const todoListCollection: ITodoList[] = [sampleWithRequiredData];
        expectedResult = service.addTodoListToCollectionIfMissing(todoListCollection, undefined, null);
        expect(expectedResult).toEqual(todoListCollection);
      });
    });

    describe('compareTodoList', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareTodoList(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareTodoList(entity1, entity2);
        const compareResult2 = service.compareTodoList(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareTodoList(entity1, entity2);
        const compareResult2 = service.compareTodoList(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareTodoList(entity1, entity2);
        const compareResult2 = service.compareTodoList(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
