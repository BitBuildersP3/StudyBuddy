import dayjs from 'dayjs/esm';
import { ISection } from 'app/entities/section/section.model';

export interface IFiles {
  id: number;
  type?: string | null;
  url1?: string | null;
  url2?: string | null;
  url3?: string | null;
  status?: string | null;
  name?: string | null;
  excerpt?: string | null;
  publishDate?: dayjs.Dayjs | null;
  section?: Pick<ISection, 'id'> | null;
}

export type NewFiles = Omit<IFiles, 'id'> & { id: null };
