import dayjs from 'dayjs/esm';
import { IUser } from 'app/entities/user/user.model';

export interface INews {
  id: number;
  name?: string | null;
  excerpt?: string | null;
  body?: string | null;
  image?: string | null;
  creationDate?: dayjs.Dayjs | null;
  user?: Pick<IUser, 'id' | 'login'> | null;
}

export type NewNews = Omit<INews, 'id'> & { id: null };
