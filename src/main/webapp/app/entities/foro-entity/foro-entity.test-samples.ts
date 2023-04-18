import { IForoEntity, NewForoEntity } from './foro-entity.model';

export const sampleWithRequiredData: IForoEntity = {
  id: 'ef6e65d4-ed63-4567-b2fa-66011dcf33d2',
};

export const sampleWithPartialData: IForoEntity = {
  id: '71672276-e49c-4954-9065-72854cb54776',
  json: 'generating Ingeniero',
};

export const sampleWithFullData: IForoEntity = {
  id: '595f9d8f-9d14-474e-bdab-0a3ed0f3b8d9',
  json: 'synthesizing',
};

export const sampleWithNewData: NewForoEntity = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
