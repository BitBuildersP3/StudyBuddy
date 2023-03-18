import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ITodoList, NewTodoList } from '../todo-list.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ITodoList for edit and NewTodoListFormGroupInput for create.
 */
type TodoListFormGroupInput = ITodoList | PartialWithRequiredKeyOf<NewTodoList>;

type TodoListFormDefaults = Pick<NewTodoList, 'id'>;

type TodoListFormGroupContent = {
  id: FormControl<ITodoList['id'] | NewTodoList['id']>;
  task: FormControl<ITodoList['task']>;
  priority: FormControl<ITodoList['priority']>;
  status: FormControl<ITodoList['status']>;
  user: FormControl<ITodoList['user']>;
};

export type TodoListFormGroup = FormGroup<TodoListFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class TodoListFormService {
  createTodoListFormGroup(todoList: TodoListFormGroupInput = { id: null }): TodoListFormGroup {
    const todoListRawValue = {
      ...this.getFormDefaults(),
      ...todoList,
    };
    return new FormGroup<TodoListFormGroupContent>({
      id: new FormControl(
        { value: todoListRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      task: new FormControl(todoListRawValue.task),
      priority: new FormControl(todoListRawValue.priority),
      status: new FormControl(todoListRawValue.status),
      user: new FormControl(todoListRawValue.user),
    });
  }

  getTodoList(form: TodoListFormGroup): ITodoList | NewTodoList {
    return form.getRawValue() as ITodoList | NewTodoList;
  }

  resetForm(form: TodoListFormGroup, todoList: TodoListFormGroupInput): void {
    const todoListRawValue = { ...this.getFormDefaults(), ...todoList };
    form.reset(
      {
        ...todoListRawValue,
        id: { value: todoListRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): TodoListFormDefaults {
    return {
      id: null,
    };
  }
}
