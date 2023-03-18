import dayjs from 'dayjs/esm';

import { IFiles, NewFiles } from './files.model';

export const sampleWithRequiredData: IFiles = {
  id: 14378,
};

export const sampleWithPartialData: IFiles = {
  id: 73224,
  url1: 'Sopa',
  excerpt: 'payment Fácil',
  publishDate: dayjs('2023-03-18'),
};

export const sampleWithFullData: IFiles = {
  id: 95217,
  type: 'Orígenes',
  url1: 'Card backing',
  url2: 'Asistente Sabroso Ensalada',
  url3: 'Ladrillo bluetooth codificar',
  status: 'Cayman Buckinghamshire',
  name: 'Gris',
  excerpt: 'Madera Holanda',
  publishDate: dayjs('2023-03-18'),
};

export const sampleWithNewData: NewFiles = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
