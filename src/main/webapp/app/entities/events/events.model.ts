import dayjs from 'dayjs/esm';
import { IUser } from 'app/entities/user/user.model';

export interface IEvents {
  id: number;
  name?: string | null;
  description?: string | null;
  startDate?: dayjs.Dayjs | null;
  endDate?: dayjs.Dayjs | null;
  url?: string | null;
  status?: string | null;
  address?: string | null;
  user?: Pick<IUser, 'id' | 'login'> | null;
}

export type NewEvents = Omit<IEvents, 'id'> & { id: null };
