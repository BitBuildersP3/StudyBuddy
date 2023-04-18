import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ICourseVotes, NewCourseVotes } from '../course-votes.model';

export type PartialUpdateCourseVotes = Partial<ICourseVotes> & Pick<ICourseVotes, 'id'>;

export type EntityResponseType = HttpResponse<ICourseVotes>;
export type EntityArrayResponseType = HttpResponse<ICourseVotes[]>;

@Injectable({ providedIn: 'root' })
export class CourseVotesService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/course-votes');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(courseVotes: NewCourseVotes): Observable<EntityResponseType> {
    return this.http.post<ICourseVotes>(this.resourceUrl, courseVotes, { observe: 'response' });
  }

  update(courseVotes: ICourseVotes): Observable<EntityResponseType> {
    return this.http.put<ICourseVotes>(`${this.resourceUrl}/${this.getCourseVotesIdentifier(courseVotes)}`, courseVotes, {
      observe: 'response',
    });
  }

  partialUpdate(courseVotes: PartialUpdateCourseVotes): Observable<EntityResponseType> {
    return this.http.patch<ICourseVotes>(`${this.resourceUrl}/${this.getCourseVotesIdentifier(courseVotes)}`, courseVotes, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ICourseVotes>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  saveCoursesVotes(id: number | undefined): Observable<EntityResponseType> {
    return this.http.get<ICourseVotes>(`${this.resourceUrl}/createByProxy/${id}`, { observe: 'response' });
  }

  getUserVotes(id: number | undefined): Observable<HttpResponse<string>> {
    return this.http.get<string>(`${this.resourceUrl}/getCurrentUserVotes/${id}`, { observe: 'response' });
  }

  getByCourse(id: number | undefined): Observable<HttpResponse<ICourseVotes>> {
    return this.http.get<ICourseVotes>(`${this.resourceUrl}/getByCourse/${id}`, { observe: 'response' });
  }

  addVote(id: string | undefined): Observable<HttpResponse<ICourseVotes>> {
    return this.http.get<ICourseVotes>(`${this.resourceUrl}/addVote/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ICourseVotes[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getCourseVotesIdentifier(courseVotes: Pick<ICourseVotes, 'id'>): number {
    return courseVotes.id;
  }

  compareCourseVotes(o1: Pick<ICourseVotes, 'id'> | null, o2: Pick<ICourseVotes, 'id'> | null): boolean {
    return o1 && o2 ? this.getCourseVotesIdentifier(o1) === this.getCourseVotesIdentifier(o2) : o1 === o2;
  }

  addCourseVotesToCollectionIfMissing<Type extends Pick<ICourseVotes, 'id'>>(
    courseVotesCollection: Type[],
    ...courseVotesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const courseVotes: Type[] = courseVotesToCheck.filter(isPresent);
    if (courseVotes.length > 0) {
      const courseVotesCollectionIdentifiers = courseVotesCollection.map(
        courseVotesItem => this.getCourseVotesIdentifier(courseVotesItem)!
      );
      const courseVotesToAdd = courseVotes.filter(courseVotesItem => {
        const courseVotesIdentifier = this.getCourseVotesIdentifier(courseVotesItem);
        if (courseVotesCollectionIdentifiers.includes(courseVotesIdentifier)) {
          return false;
        }
        courseVotesCollectionIdentifiers.push(courseVotesIdentifier);
        return true;
      });
      return [...courseVotesToAdd, ...courseVotesCollection];
    }
    return courseVotesCollection;
  }
}
