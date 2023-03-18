import { IUser } from 'app/entities/user/user.model';

export interface ITodoList {
  id: number;
  task?: string | null;
  priority?: number | null;
  status?: string | null;
  user?: Pick<IUser, 'id' | 'login'> | null;
}

export type NewTodoList = Omit<ITodoList, 'id'> & { id: null };
