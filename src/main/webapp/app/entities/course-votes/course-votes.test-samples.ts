import { ICourseVotes, NewCourseVotes } from './course-votes.model';

export const sampleWithRequiredData: ICourseVotes = {
  id: 15167,
};

export const sampleWithPartialData: ICourseVotes = {
  id: 84485,
};

export const sampleWithFullData: ICourseVotes = {
  id: 31296,
  idCourse: 43082,
  json: 'Zapatos Riera',
};

export const sampleWithNewData: NewCourseVotes = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
