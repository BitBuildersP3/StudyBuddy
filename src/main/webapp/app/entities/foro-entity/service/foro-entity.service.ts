import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IForoEntity, NewForoEntity } from '../foro-entity.model';

export type PartialUpdateForoEntity = Partial<IForoEntity> & Pick<IForoEntity, 'id'>;

export type EntityResponseType = HttpResponse<IForoEntity>;
export type EntityArrayResponseType = HttpResponse<IForoEntity[]>;

@Injectable({ providedIn: 'root' })
export class ForoEntityService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/foro-entities');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(foroEntity: any): Observable<EntityResponseType> {
    return this.http.post<IForoEntity>(this.resourceUrl, foroEntity, { observe: 'response' });
  }

  update(foroEntity: IForoEntity): Observable<EntityResponseType> {
    return this.http.put<IForoEntity>(`${this.resourceUrl}/${this.getForoEntityIdentifier(foroEntity)}`, foroEntity, {
      observe: 'response',
    });
  }

  partialUpdate(foroEntity: PartialUpdateForoEntity): Observable<EntityResponseType> {
    return this.http.patch<IForoEntity>(`${this.resourceUrl}/${this.getForoEntityIdentifier(foroEntity)}`, foroEntity, {
      observe: 'response',
    });
  }

  find(id: string): Observable<EntityResponseType> {
    return this.http.get<IForoEntity>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IForoEntity[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: string): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getForoEntityIdentifier(foroEntity: Pick<IForoEntity, 'id'>): string {
    return foroEntity.id;
  }

  compareForoEntity(o1: Pick<IForoEntity, 'id'> | null, o2: Pick<IForoEntity, 'id'> | null): boolean {
    return o1 && o2 ? this.getForoEntityIdentifier(o1) === this.getForoEntityIdentifier(o2) : o1 === o2;
  }

  addForoEntityToCollectionIfMissing<Type extends Pick<IForoEntity, 'id'>>(
    foroEntityCollection: Type[],
    ...foroEntitiesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const foroEntities: Type[] = foroEntitiesToCheck.filter(isPresent);
    if (foroEntities.length > 0) {
      const foroEntityCollectionIdentifiers = foroEntityCollection.map(foroEntityItem => this.getForoEntityIdentifier(foroEntityItem)!);
      const foroEntitiesToAdd = foroEntities.filter(foroEntityItem => {
        const foroEntityIdentifier = this.getForoEntityIdentifier(foroEntityItem);
        if (foroEntityCollectionIdentifiers.includes(foroEntityIdentifier)) {
          return false;
        }
        foroEntityCollectionIdentifiers.push(foroEntityIdentifier);
        return true;
      });
      return [...foroEntitiesToAdd, ...foroEntityCollection];
    }
    return foroEntityCollection;
  }
}
