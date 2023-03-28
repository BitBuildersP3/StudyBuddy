import { ICourses, NewCourses } from './courses.model';

export const sampleWithRequiredData: ICourses = {
  id: 22388,
};

export const sampleWithPartialData: ICourses = {
  id: 85151,
  name: 'Pollo',
  description: 'Creativo en Hormigon',
  previewImg: 'Desarrollador',
  status: 'Genérico Algodón',
  score: 39441,
  excerpt: 'Marca PCI',
  userId: 70850,
  userVotes: 98984,
  ownerName: 'Colegio',
  userName: 'Muelle Coche Genérico',
};

export const sampleWithFullData: ICourses = {
  id: 86823,
  name: 'copying',
  description: 'Auto',
  previewImg: 'Loan',
  status: 'intangible tolerancia',
  score: 66500,
  excerpt: 'Grupo',
  userId: 67888,
  userVotes: 57274,
  ownerName: 'bluetooth Integración',
  userName: 'Madera Nacional Cataluña',
};

export const sampleWithNewData: NewCourses = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
