import { ITodoList, NewTodoList } from './todo-list.model';

export const sampleWithRequiredData: ITodoList = {
  id: 88086,
};

export const sampleWithPartialData: ITodoList = {
  id: 97616,
  priority: 67040,
};

export const sampleWithFullData: ITodoList = {
  id: 39673,
  task: 'Singapore',
  priority: 94837,
  status: 'protocolo',
};

export const sampleWithNewData: NewTodoList = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
