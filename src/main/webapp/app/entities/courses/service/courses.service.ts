import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ICourses, NewCourses } from '../courses.model';
import { map } from 'rxjs/operators';
import { RestExtraUserInfo } from '../../extra-user-info/service/extra-user-info.service';
export type PartialUpdateCourses = Partial<ICourses> & Pick<ICourses, 'id'>;
export type EntityResponseType = HttpResponse<ICourses>;
export type EntityArrayResponseType = HttpResponse<ICourses[]>;

@Injectable({ providedIn: 'root' })
export class CoursesService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/courses');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(courses: NewCourses): Observable<EntityResponseType> {
    return this.http.post<ICourses>(this.resourceUrl, courses, { observe: 'response' });
  }

  getCoursesByPrompt(prompt: string): Observable<EntityArrayResponseType> {
    return this.http.get<ICourses[]>(`${this.resourceUrl}/findByPrompt/${prompt}`, { observe: 'response' });
  }

  update(courses: ICourses): Observable<EntityResponseType> {
    return this.http.put<ICourses>(`${this.resourceUrl}/${this.getCoursesIdentifier(courses)}`, courses, { observe: 'response' });
  }

  partialUpdate(courses: PartialUpdateCourses): Observable<EntityResponseType> {
    return this.http.patch<ICourses>(`${this.resourceUrl}/${this.getCoursesIdentifier(courses)}`, courses, { observe: 'response' });
  }

  getFiveOwner(): Observable<EntityArrayResponseType> {
    return this.http.get<ICourses[]>(`${this.resourceUrl}/getFiveByOwner`, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ICourses>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  findOwner(ownerName: string): Observable<EntityArrayResponseType> {
    return this.http.get<ICourses[]>(`${this.resourceUrl}/${ownerName}`, { observe: 'response' });
  }

  getTopTenCourses(): Observable<EntityArrayResponseType> {
    return this.http.get<ICourses[]>(`${this.resourceUrl}/topTen`, { observe: 'response' });
  }

  getFiveCourseById(id: number | undefined): Observable<EntityArrayResponseType> {
    return this.http.get<ICourses[]>(`${this.resourceUrl}/fiveEnrolled/${id}`, { observe: 'response' });
  }

  getCouseDataById(id: number): Observable<EntityResponseType> {
    return this.http.get<ICourses>(`${this.resourceUrl}/getAllData/${id}`, { observe: 'response' });
  }

  getByOwner(ownerName: string): Observable<EntityArrayResponseType> {
    return this.http.get<ICourses[]>(`${this.resourceUrl}/owner/${ownerName}`, { observe: 'response' });
  }

  getRegisteredCoursesByUserId(user: number): Observable<EntityArrayResponseType> {
    return this.http.get<ICourses[]>(`${this.resourceUrl}/enrolled/${user}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ICourses[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getCoursesIdentifier(courses: Pick<ICourses, 'id'>): number {
    return courses.id;
  }

  getIsRegister(id: string): Observable<any> {
    return this.http.get<any>(`${this.resourceUrl}/isRegistered/${id}`, { observe: 'response' });
  }

  getIsOwner(id: number): Observable<any> {
    return this.http.get<any>(`${this.resourceUrl}/isOwner/${id}`, { observe: 'response' });
  }

  compareCourses(o1: Pick<ICourses, 'id'> | null, o2: Pick<ICourses, 'id'> | null): boolean {
    return o1 && o2 ? this.getCoursesIdentifier(o1) === this.getCoursesIdentifier(o2) : o1 === o2;
  }

  addCoursesToCollectionIfMissing<Type extends Pick<ICourses, 'id'>>(
    coursesCollection: Type[],
    ...coursesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const courses: Type[] = coursesToCheck.filter(isPresent);
    if (courses.length > 0) {
      const coursesCollectionIdentifiers = coursesCollection.map(coursesItem => this.getCoursesIdentifier(coursesItem)!);
      const coursesToAdd = courses.filter(coursesItem => {
        const coursesIdentifier = this.getCoursesIdentifier(coursesItem);
        if (coursesCollectionIdentifiers.includes(coursesIdentifier)) {
          return false;
        }
        coursesCollectionIdentifiers.push(coursesIdentifier);
        return true;
      });
      return [...coursesToAdd, ...coursesCollection];
    }
    return coursesCollection;
  }
}
