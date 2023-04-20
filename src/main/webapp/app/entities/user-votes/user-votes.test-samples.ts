import { IUserVotes, NewUserVotes } from './user-votes.model';

export const sampleWithRequiredData: IUserVotes = {
  id: 16978,
};

export const sampleWithPartialData: IUserVotes = {
  id: 68165,
  idUser: 'monitor Dong Principado',
  json: 'Metal concepto Agente',
};

export const sampleWithFullData: IUserVotes = {
  id: 63445,
  idUser: 'Rústico',
  json: 'Hormigon program Deportes',
};

export const sampleWithNewData: NewUserVotes = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
