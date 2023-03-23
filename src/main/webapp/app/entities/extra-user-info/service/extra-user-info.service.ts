import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IExtraUserInfo, NewExtraUserInfo } from '../extra-user-info.model';

export type PartialUpdateExtraUserInfo = Partial<IExtraUserInfo> & Pick<IExtraUserInfo, 'id'>;

type RestOf<T extends IExtraUserInfo | NewExtraUserInfo> = Omit<T, 'birthDay'> & {
  birthDay?: string | null;
};

export type RestExtraUserInfo = RestOf<IExtraUserInfo>;

export type NewRestExtraUserInfo = RestOf<NewExtraUserInfo>;

export type PartialUpdateRestExtraUserInfo = RestOf<PartialUpdateExtraUserInfo>;

export type EntityResponseType = HttpResponse<IExtraUserInfo>;
export type EntityArrayResponseType = HttpResponse<IExtraUserInfo[]>;

@Injectable({ providedIn: 'root' })
export class ExtraUserInfoService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/extra-user-infos');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(extraUserInfo: NewExtraUserInfo): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(extraUserInfo);
    return this.http
      .post<RestExtraUserInfo>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(extraUserInfo: IExtraUserInfo): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(extraUserInfo);
    return this.http
      .put<RestExtraUserInfo>(`${this.resourceUrl}/${this.getExtraUserInfoIdentifier(extraUserInfo)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(extraUserInfo: PartialUpdateExtraUserInfo): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(extraUserInfo);
    return this.http
      .patch<RestExtraUserInfo>(`${this.resourceUrl}/${this.getExtraUserInfoIdentifier(extraUserInfo)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestExtraUserInfo>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestExtraUserInfo[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getExtraUserInfoIdentifier(extraUserInfo: Pick<IExtraUserInfo, 'id'>): number {
    return extraUserInfo.id;
  }

  compareExtraUserInfo(o1: Pick<IExtraUserInfo, 'id'> | null, o2: Pick<IExtraUserInfo, 'id'> | null): boolean {
    return o1 && o2 ? this.getExtraUserInfoIdentifier(o1) === this.getExtraUserInfoIdentifier(o2) : o1 === o2;
  }

  addExtraUserInfoToCollectionIfMissing<Type extends Pick<IExtraUserInfo, 'id'>>(
    extraUserInfoCollection: Type[],
    ...extraUserInfosToCheck: (Type | null | undefined)[]
  ): Type[] {
    const extraUserInfos: Type[] = extraUserInfosToCheck.filter(isPresent);
    if (extraUserInfos.length > 0) {
      const extraUserInfoCollectionIdentifiers = extraUserInfoCollection.map(
        extraUserInfoItem => this.getExtraUserInfoIdentifier(extraUserInfoItem)!
      );
      const extraUserInfosToAdd = extraUserInfos.filter(extraUserInfoItem => {
        const extraUserInfoIdentifier = this.getExtraUserInfoIdentifier(extraUserInfoItem);
        if (extraUserInfoCollectionIdentifiers.includes(extraUserInfoIdentifier)) {
          return false;
        }
        extraUserInfoCollectionIdentifiers.push(extraUserInfoIdentifier);
        return true;
      });
      return [...extraUserInfosToAdd, ...extraUserInfoCollection];
    }
    return extraUserInfoCollection;
  }

  getInfoByCurrentUser(): Observable<EntityResponseType> {
    return this.http
      .get<RestExtraUserInfo>(`${this.resourceUrl}/byUser`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  protected convertDateFromClient<T extends IExtraUserInfo | NewExtraUserInfo | PartialUpdateExtraUserInfo>(extraUserInfo: T): RestOf<T> {
    return {
      ...extraUserInfo,
      birthDay: extraUserInfo.birthDay?.format(DATE_FORMAT) ?? null,
    };
  }

  protected convertDateFromServer(restExtraUserInfo: RestExtraUserInfo): IExtraUserInfo {
    return {
      ...restExtraUserInfo,
      birthDay: restExtraUserInfo.birthDay ? dayjs(restExtraUserInfo.birthDay) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestExtraUserInfo>): HttpResponse<IExtraUserInfo> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestExtraUserInfo[]>): HttpResponse<IExtraUserInfo[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
