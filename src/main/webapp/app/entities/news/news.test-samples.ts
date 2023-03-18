import dayjs from 'dayjs/esm';

import { INews, NewNews } from './news.model';

export const sampleWithRequiredData: INews = {
  id: 76512,
};

export const sampleWithPartialData: INews = {
  id: 72405,
  name: 'Tácticas',
};

export const sampleWithFullData: INews = {
  id: 78351,
  name: 'Buckinghamshire Aplicaciones optical',
  excerpt: 'División',
  body: 'Increible',
  image: 'architectures Negro',
  creationDate: dayjs('2023-03-18'),
};

export const sampleWithNewData: NewNews = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
