import dayjs from 'dayjs/esm';

import { ISection, NewSection } from './section.model';

export const sampleWithRequiredData: ISection = {
  id: 8943,
};

export const sampleWithPartialData: ISection = {
  id: 66446,
  creationDate: dayjs('2023-03-18'),
  status: 'Técnico Bedfordshire mesh',
};

export const sampleWithFullData: ISection = {
  id: 7290,
  name: 'magnetic',
  description: 'Berkshire',
  excerpt: 'Berkshire platforms compress',
  creationDate: dayjs('2023-03-18'),
  time: 27138,
  status: 'SQL Compatible haptic',
};

export const sampleWithNewData: NewSection = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
