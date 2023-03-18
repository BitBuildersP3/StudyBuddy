import dayjs from 'dayjs/esm';
import { IUser } from 'app/entities/user/user.model';

export interface IExtraUserInfo {
  id: number;
  phone?: string | null;
  degree?: string | null;
  profilePicture?: string | null;
  birthDay?: dayjs.Dayjs | null;
  score?: number | null;
  userVotes?: number | null;
  user?: Pick<IUser, 'id' | 'login'> | null;
}

export type NewExtraUserInfo = Omit<IExtraUserInfo, 'id'> & { id: null };
