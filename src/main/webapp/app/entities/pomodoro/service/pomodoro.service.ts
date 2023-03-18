import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IPomodoro, NewPomodoro } from '../pomodoro.model';

export type PartialUpdatePomodoro = Partial<IPomodoro> & Pick<IPomodoro, 'id'>;

type RestOf<T extends IPomodoro | NewPomodoro> = Omit<T, 'beginTime' | 'endTime' | 'beginBreak' | 'endBreak'> & {
  beginTime?: string | null;
  endTime?: string | null;
  beginBreak?: string | null;
  endBreak?: string | null;
};

export type RestPomodoro = RestOf<IPomodoro>;

export type NewRestPomodoro = RestOf<NewPomodoro>;

export type PartialUpdateRestPomodoro = RestOf<PartialUpdatePomodoro>;

export type EntityResponseType = HttpResponse<IPomodoro>;
export type EntityArrayResponseType = HttpResponse<IPomodoro[]>;

@Injectable({ providedIn: 'root' })
export class PomodoroService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/pomodoros');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(pomodoro: NewPomodoro): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(pomodoro);
    return this.http
      .post<RestPomodoro>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(pomodoro: IPomodoro): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(pomodoro);
    return this.http
      .put<RestPomodoro>(`${this.resourceUrl}/${this.getPomodoroIdentifier(pomodoro)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(pomodoro: PartialUpdatePomodoro): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(pomodoro);
    return this.http
      .patch<RestPomodoro>(`${this.resourceUrl}/${this.getPomodoroIdentifier(pomodoro)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestPomodoro>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestPomodoro[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getPomodoroIdentifier(pomodoro: Pick<IPomodoro, 'id'>): number {
    return pomodoro.id;
  }

  comparePomodoro(o1: Pick<IPomodoro, 'id'> | null, o2: Pick<IPomodoro, 'id'> | null): boolean {
    return o1 && o2 ? this.getPomodoroIdentifier(o1) === this.getPomodoroIdentifier(o2) : o1 === o2;
  }

  addPomodoroToCollectionIfMissing<Type extends Pick<IPomodoro, 'id'>>(
    pomodoroCollection: Type[],
    ...pomodorosToCheck: (Type | null | undefined)[]
  ): Type[] {
    const pomodoros: Type[] = pomodorosToCheck.filter(isPresent);
    if (pomodoros.length > 0) {
      const pomodoroCollectionIdentifiers = pomodoroCollection.map(pomodoroItem => this.getPomodoroIdentifier(pomodoroItem)!);
      const pomodorosToAdd = pomodoros.filter(pomodoroItem => {
        const pomodoroIdentifier = this.getPomodoroIdentifier(pomodoroItem);
        if (pomodoroCollectionIdentifiers.includes(pomodoroIdentifier)) {
          return false;
        }
        pomodoroCollectionIdentifiers.push(pomodoroIdentifier);
        return true;
      });
      return [...pomodorosToAdd, ...pomodoroCollection];
    }
    return pomodoroCollection;
  }

  protected convertDateFromClient<T extends IPomodoro | NewPomodoro | PartialUpdatePomodoro>(pomodoro: T): RestOf<T> {
    return {
      ...pomodoro,
      beginTime: pomodoro.beginTime?.format(DATE_FORMAT) ?? null,
      endTime: pomodoro.endTime?.format(DATE_FORMAT) ?? null,
      beginBreak: pomodoro.beginBreak?.format(DATE_FORMAT) ?? null,
      endBreak: pomodoro.endBreak?.format(DATE_FORMAT) ?? null,
    };
  }

  protected convertDateFromServer(restPomodoro: RestPomodoro): IPomodoro {
    return {
      ...restPomodoro,
      beginTime: restPomodoro.beginTime ? dayjs(restPomodoro.beginTime) : undefined,
      endTime: restPomodoro.endTime ? dayjs(restPomodoro.endTime) : undefined,
      beginBreak: restPomodoro.beginBreak ? dayjs(restPomodoro.beginBreak) : undefined,
      endBreak: restPomodoro.endBreak ? dayjs(restPomodoro.endBreak) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestPomodoro>): HttpResponse<IPomodoro> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestPomodoro[]>): HttpResponse<IPomodoro[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
