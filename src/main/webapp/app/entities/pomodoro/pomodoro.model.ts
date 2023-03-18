import dayjs from 'dayjs/esm';
import { IUser } from 'app/entities/user/user.model';

export interface IPomodoro {
  id: number;
  beginTime?: dayjs.Dayjs | null;
  endTime?: dayjs.Dayjs | null;
  totalTime?: number | null;
  status?: string | null;
  task?: string | null;
  beginBreak?: dayjs.Dayjs | null;
  endBreak?: dayjs.Dayjs | null;
  totalBreak?: number | null;
  user?: Pick<IUser, 'id' | 'login'> | null;
}

export type NewPomodoro = Omit<IPomodoro, 'id'> & { id: null };
