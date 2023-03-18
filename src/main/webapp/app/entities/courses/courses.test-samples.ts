import { ICourses, NewCourses } from './courses.model';

export const sampleWithRequiredData: ICourses = {
  id: 22388,
};

export const sampleWithPartialData: ICourses = {
  id: 55175,
  name: 'overriding Guarani Creativo',
  description: 'port',
  previewImg: 'hacking transmitter Genérico',
  status: 'Lado',
  score: 34956,
  excerpt: 'Hormigon matrix Colegio',
  userId: 90608,
  userVotes: 45789,
};

export const sampleWithFullData: ICourses = {
  id: 53290,
  name: 'Coche Genérico',
  description: 'Morado Moda back',
  previewImg: 'Cataluña intangible',
  status: 'Ejecutivo',
  score: 31176,
  excerpt: 'partnerships León',
  userId: 64154,
  userVotes: 19926,
};

export const sampleWithNewData: NewCourses = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
