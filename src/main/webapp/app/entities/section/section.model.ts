import dayjs from 'dayjs/esm';
import { ICourses } from 'app/entities/courses/courses.model';

export interface ISection {
  id: number;
  name?: string | null;
  description?: string | null;
  excerpt?: string | null;
  creationDate?: dayjs.Dayjs | null;
  time?: number | null;
  status?: string | null;
  courses?: Pick<ICourses, 'id'> | null;
}

export type NewSection = Omit<ISection, 'id'> & { id: null };
