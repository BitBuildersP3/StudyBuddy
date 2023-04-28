import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { INews, NewNews } from '../news.model';

export type PartialUpdateNews = Partial<INews> & Pick<INews, 'id'>;

type RestOf<T extends INews | NewNews> = Omit<T, 'creationDate'> & {
  creationDate?: string | null;
};

export type RestNews = RestOf<INews>;

export type NewRestNews = RestOf<NewNews>;

export type PartialUpdateRestNews = RestOf<PartialUpdateNews>;

export type EntityResponseType = HttpResponse<INews>;
export type EntityArrayResponseType = HttpResponse<INews[]>;

@Injectable({ providedIn: 'root' })
export class NewsService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/news');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(news: NewNews): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(news);
    return this.http.post<RestNews>(this.resourceUrl, copy, { observe: 'response' }).pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(news: INews): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(news);
    return this.http
      .put<RestNews>(`${this.resourceUrl}/${this.getNewsIdentifier(news)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  findFourNewst(): Observable<EntityArrayResponseType> {
    return this.http
      .get<RestNews[]>(`${this.resourceUrl}/fourNews`, { observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }
  partialUpdate(news: PartialUpdateNews): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(news);
    return this.http
      .patch<RestNews>(`${this.resourceUrl}/${this.getNewsIdentifier(news)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestNews>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestNews[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getNewsIdentifier(news: Pick<INews, 'id'>): number {
    return news.id;
  }

  compareNews(o1: Pick<INews, 'id'> | null, o2: Pick<INews, 'id'> | null): boolean {
    return o1 && o2 ? this.getNewsIdentifier(o1) === this.getNewsIdentifier(o2) : o1 === o2;
  }

  addNewsToCollectionIfMissing<Type extends Pick<INews, 'id'>>(
    newsCollection: Type[],
    ...newsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const news: Type[] = newsToCheck.filter(isPresent);
    if (news.length > 0) {
      const newsCollectionIdentifiers = newsCollection.map(newsItem => this.getNewsIdentifier(newsItem)!);
      const newsToAdd = news.filter(newsItem => {
        const newsIdentifier = this.getNewsIdentifier(newsItem);
        if (newsCollectionIdentifiers.includes(newsIdentifier)) {
          return false;
        }
        newsCollectionIdentifiers.push(newsIdentifier);
        return true;
      });
      return [...newsToAdd, ...newsCollection];
    }
    return newsCollection;
  }

  protected convertDateFromClient<T extends INews | NewNews | PartialUpdateNews>(news: T): RestOf<T> {
    return {
      ...news,
      creationDate: news.creationDate?.format(DATE_FORMAT) ?? null,
    };
  }

  protected convertDateFromServer(restNews: RestNews): INews {
    return {
      ...restNews,
      creationDate: restNews.creationDate ? dayjs(restNews.creationDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestNews>): HttpResponse<INews> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestNews[]>): HttpResponse<INews[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
