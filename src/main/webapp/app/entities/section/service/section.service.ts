import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ISection, NewSection } from '../section.model';

export type PartialUpdateSection = Partial<ISection> & Pick<ISection, 'id'>;

type RestOf<T extends ISection | NewSection> = Omit<T, 'creationDate'> & {
  creationDate?: string | null;
};

export type RestSection = RestOf<ISection>;

export type NewRestSection = RestOf<NewSection>;

export type PartialUpdateRestSection = RestOf<PartialUpdateSection>;

export type EntityResponseType = HttpResponse<ISection>;
export type EntityArrayResponseType = HttpResponse<ISection[]>;

@Injectable({ providedIn: 'root' })
export class SectionService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/sections');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(section: NewSection): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(section);
    return this.http
      .post<RestSection>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(section: ISection): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(section);
    return this.http
      .put<RestSection>(`${this.resourceUrl}/${this.getSectionIdentifier(section)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(section: PartialUpdateSection): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(section);
    return this.http
      .patch<RestSection>(`${this.resourceUrl}/${this.getSectionIdentifier(section)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestSection>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestSection[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getSectionIdentifier(section: Pick<ISection, 'id'>): number {
    return section.id;
  }

  compareSection(o1: Pick<ISection, 'id'> | null, o2: Pick<ISection, 'id'> | null): boolean {
    return o1 && o2 ? this.getSectionIdentifier(o1) === this.getSectionIdentifier(o2) : o1 === o2;
  }

  addSectionToCollectionIfMissing<Type extends Pick<ISection, 'id'>>(
    sectionCollection: Type[],
    ...sectionsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const sections: Type[] = sectionsToCheck.filter(isPresent);
    if (sections.length > 0) {
      const sectionCollectionIdentifiers = sectionCollection.map(sectionItem => this.getSectionIdentifier(sectionItem)!);
      const sectionsToAdd = sections.filter(sectionItem => {
        const sectionIdentifier = this.getSectionIdentifier(sectionItem);
        if (sectionCollectionIdentifiers.includes(sectionIdentifier)) {
          return false;
        }
        sectionCollectionIdentifiers.push(sectionIdentifier);
        return true;
      });
      return [...sectionsToAdd, ...sectionCollection];
    }
    return sectionCollection;
  }

  protected convertDateFromClient<T extends ISection | NewSection | PartialUpdateSection>(section: T): RestOf<T> {
    return {
      ...section,
      creationDate: section.creationDate?.format(DATE_FORMAT) ?? null,
    };
  }

  protected convertDateFromServer(restSection: RestSection): ISection {
    return {
      ...restSection,
      creationDate: restSection.creationDate ? dayjs(restSection.creationDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestSection>): HttpResponse<ISection> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestSection[]>): HttpResponse<ISection[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
