import { IUser } from 'app/entities/user/user.model';
import { ICategory } from 'app/entities/category/category.model';

export interface ICourses {
  id: number;
  name?: string | null;
  description?: string | null;
  previewImg?: string | null;
  status?: string | null;
  score?: number | null;
  excerpt?: string | null;
  userId?: number | null;
  userVotes?: number | null;
  users?: Pick<IUser, 'id' | 'login'>[] | null;
  category?: Pick<ICategory, 'id'> | null;
}

export type NewCourses = Omit<ICourses, 'id'> & { id: null };
