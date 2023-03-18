import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../todo-list.test-samples';

import { TodoListFormService } from './todo-list-form.service';

describe('TodoList Form Service', () => {
  let service: TodoListFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TodoListFormService);
  });

  describe('Service methods', () => {
    describe('createTodoListFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createTodoListFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            task: expect.any(Object),
            priority: expect.any(Object),
            status: expect.any(Object),
            user: expect.any(Object),
          })
        );
      });

      it('passing ITodoList should create a new form with FormGroup', () => {
        const formGroup = service.createTodoListFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            task: expect.any(Object),
            priority: expect.any(Object),
            status: expect.any(Object),
            user: expect.any(Object),
          })
        );
      });
    });

    describe('getTodoList', () => {
      it('should return NewTodoList for default TodoList initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createTodoListFormGroup(sampleWithNewData);

        const todoList = service.getTodoList(formGroup) as any;

        expect(todoList).toMatchObject(sampleWithNewData);
      });

      it('should return NewTodoList for empty TodoList initial value', () => {
        const formGroup = service.createTodoListFormGroup();

        const todoList = service.getTodoList(formGroup) as any;

        expect(todoList).toMatchObject({});
      });

      it('should return ITodoList', () => {
        const formGroup = service.createTodoListFormGroup(sampleWithRequiredData);

        const todoList = service.getTodoList(formGroup) as any;

        expect(todoList).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ITodoList should not enable id FormControl', () => {
        const formGroup = service.createTodoListFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewTodoList should disable id FormControl', () => {
        const formGroup = service.createTodoListFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
