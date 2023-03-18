import dayjs from 'dayjs/esm';

import { IExtraUserInfo, NewExtraUserInfo } from './extra-user-info.model';

export const sampleWithRequiredData: IExtraUserInfo = {
  id: 85163,
};

export const sampleWithPartialData: IExtraUserInfo = {
  id: 11047,
  degree: 'Cambridgeshire',
  profilePicture: 'Increible Directo Mercado',
  score: 20076,
};

export const sampleWithFullData: IExtraUserInfo = {
  id: 43231,
  phone: '978.201.654',
  degree: 'ejecutiva',
  profilePicture: 'transition Galicia Borders',
  birthDay: dayjs('2023-03-18'),
  score: 97491,
  userVotes: 11002,
};

export const sampleWithNewData: NewExtraUserInfo = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
