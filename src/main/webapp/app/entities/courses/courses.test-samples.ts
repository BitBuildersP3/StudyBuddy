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
  ownerName: 'Práctico Hormigon Moldavia',
  userName: 'HTTP',
  userVotes: 5845,
};

export const sampleWithFullData: ICourses = {
  id: 58517,
  name: 'withdrawal',
  description: 'copying',
  previewImg: 'Auto',
  status: 'Loan',
  score: 36036,
  excerpt: 'Berkshire',
  userId: 99487,
  ownerName: 'withdrawal',
  userName: 'a Rincón',
  userVotes: 19926,
};

export const sampleWithNewData: NewCourses = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
