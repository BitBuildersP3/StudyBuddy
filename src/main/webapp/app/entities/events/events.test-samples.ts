import dayjs from 'dayjs/esm';

import { IEvents, NewEvents } from './events.model';

export const sampleWithRequiredData: IEvents = {
  id: 89576,
};

export const sampleWithPartialData: IEvents = {
  id: 35131,
  description: 'synthesize Madera',
  url: 'http://horacio.com.es',
  address: 'Account',
};

export const sampleWithFullData: IEvents = {
  id: 49091,
  name: 'harness',
  description: 'Cambridgeshire Ordenador',
  startDate: dayjs('2023-03-18'),
  endDate: dayjs('2023-03-17'),
  url: 'http://mateo.com',
  status: 'Distrito Salchichas',
  address: 'Israeli',
};

export const sampleWithNewData: NewEvents = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
