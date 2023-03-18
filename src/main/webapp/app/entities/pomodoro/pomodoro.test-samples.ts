import dayjs from 'dayjs/esm';

import { IPomodoro, NewPomodoro } from './pomodoro.model';

export const sampleWithRequiredData: IPomodoro = {
  id: 31783,
};

export const sampleWithPartialData: IPomodoro = {
  id: 81107,
  totalTime: 37528,
  status: 'web-readiness',
  task: 'Berkshire BCEAO',
  beginBreak: dayjs('2023-03-18'),
};

export const sampleWithFullData: IPomodoro = {
  id: 30517,
  beginTime: dayjs('2023-03-18'),
  endTime: dayjs('2023-03-18'),
  totalTime: 98546,
  status: 'Negro',
  task: 'Hormigon Plástico Cambridgeshire',
  beginBreak: dayjs('2023-03-18'),
  endBreak: dayjs('2023-03-18'),
  totalBreak: 70261,
};

export const sampleWithNewData: NewPomodoro = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
