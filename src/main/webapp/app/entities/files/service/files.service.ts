import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IFiles, NewFiles } from '../files.model';

export type PartialUpdateFiles = Partial<IFiles> & Pick<IFiles, 'id'>;

type RestOf<T extends IFiles | NewFiles> = Omit<T, 'publishDate'> & {
  publishDate?: string | null;
};

export type RestFiles = RestOf<IFiles>;

export type NewRestFiles = RestOf<NewFiles>;

export type PartialUpdateRestFiles = RestOf<PartialUpdateFiles>;

export type EntityResponseType = HttpResponse<IFiles>;
export type EntityArrayResponseType = HttpResponse<IFiles[]>;

@Injectable({ providedIn: 'root' })
export class FilesService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/files');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(files: NewFiles): Observable<EntityResponseType> {
    // Siempre se pone la fecha en la que se modifico
    files.publishDate = dayjs();
    const copy = this.convertDateFromClient(files);
    return this.http.post<RestFiles>(this.resourceUrl, copy, { observe: 'response' }).pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(files: IFiles): Observable<EntityResponseType> {
    // Siempre se pone la fecha en la que se modifico
    files.publishDate = dayjs();
    const copy = this.convertDateFromClient(files);
    return this.http
      .put<RestFiles>(`${this.resourceUrl}/${this.getFilesIdentifier(files)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(files: PartialUpdateFiles): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(files);
    return this.http
      .patch<RestFiles>(`${this.resourceUrl}/${this.getFilesIdentifier(files)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestFiles>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestFiles[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getFilesIdentifier(files: Pick<IFiles, 'id'>): number {
    return files.id;
  }

  compareFiles(o1: Pick<IFiles, 'id'> | null, o2: Pick<IFiles, 'id'> | null): boolean {
    return o1 && o2 ? this.getFilesIdentifier(o1) === this.getFilesIdentifier(o2) : o1 === o2;
  }

  addFilesToCollectionIfMissing<Type extends Pick<IFiles, 'id'>>(
    filesCollection: Type[],
    ...filesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const files: Type[] = filesToCheck.filter(isPresent);
    if (files.length > 0) {
      const filesCollectionIdentifiers = filesCollection.map(filesItem => this.getFilesIdentifier(filesItem)!);
      const filesToAdd = files.filter(filesItem => {
        const filesIdentifier = this.getFilesIdentifier(filesItem);
        if (filesCollectionIdentifiers.includes(filesIdentifier)) {
          return false;
        }
        filesCollectionIdentifiers.push(filesIdentifier);
        return true;
      });
      return [...filesToAdd, ...filesCollection];
    }
    return filesCollection;
  }

  protected convertDateFromClient<T extends IFiles | NewFiles | PartialUpdateFiles>(files: T): RestOf<T> {
    return {
      ...files,
      publishDate: files.publishDate?.format(DATE_FORMAT) ?? null,
    };
  }

  protected convertDateFromServer(restFiles: RestFiles): IFiles {
    return {
      ...restFiles,
      publishDate: restFiles.publishDate ? dayjs(restFiles.publishDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestFiles>): HttpResponse<IFiles> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestFiles[]>): HttpResponse<IFiles[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
