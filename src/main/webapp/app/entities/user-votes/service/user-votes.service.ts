import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IUserVotes, NewUserVotes } from '../user-votes.model';

export type PartialUpdateUserVotes = Partial<IUserVotes> & Pick<IUserVotes, 'id'>;

export type EntityResponseType = HttpResponse<IUserVotes>;
export type EntityArrayResponseType = HttpResponse<IUserVotes[]>;

@Injectable({ providedIn: 'root' })
export class UserVotesService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/user-votes');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(userVotes: NewUserVotes): Observable<EntityResponseType> {
    return this.http.post<IUserVotes>(this.resourceUrl, userVotes, { observe: 'response' });
  }

  update(userVotes: IUserVotes): Observable<EntityResponseType> {
    return this.http.put<IUserVotes>(`${this.resourceUrl}/${this.getUserVotesIdentifier(userVotes)}`, userVotes, { observe: 'response' });
  }

  partialUpdate(userVotes: PartialUpdateUserVotes): Observable<EntityResponseType> {
    return this.http.patch<IUserVotes>(`${this.resourceUrl}/${this.getUserVotesIdentifier(userVotes)}`, userVotes, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IUserVotes>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IUserVotes[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getUserVotesIdentifier(userVotes: Pick<IUserVotes, 'id'>): number {
    return userVotes.id;
  }

  compareUserVotes(o1: Pick<IUserVotes, 'id'> | null, o2: Pick<IUserVotes, 'id'> | null): boolean {
    return o1 && o2 ? this.getUserVotesIdentifier(o1) === this.getUserVotesIdentifier(o2) : o1 === o2;
  }

  addUserVotesToCollectionIfMissing<Type extends Pick<IUserVotes, 'id'>>(
    userVotesCollection: Type[],
    ...userVotesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const userVotes: Type[] = userVotesToCheck.filter(isPresent);
    if (userVotes.length > 0) {
      const userVotesCollectionIdentifiers = userVotesCollection.map(userVotesItem => this.getUserVotesIdentifier(userVotesItem)!);
      const userVotesToAdd = userVotes.filter(userVotesItem => {
        const userVotesIdentifier = this.getUserVotesIdentifier(userVotesItem);
        if (userVotesCollectionIdentifiers.includes(userVotesIdentifier)) {
          return false;
        }
        userVotesCollectionIdentifiers.push(userVotesIdentifier);
        return true;
      });
      return [...userVotesToAdd, ...userVotesCollection];
    }
    return userVotesCollection;
  }
}
