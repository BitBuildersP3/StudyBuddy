import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Data, ParamMap, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { combineLatest, filter, finalize, Observable, switchMap, tap } from 'rxjs';

import { ASC, DEFAULT_SORT_DATA, DESC, ITEM_DELETED_EVENT, SORT } from 'app/config/navigation.constants';
import { ExtraUserInfoService } from 'app/entities/extra-user-info/service/extra-user-info.service';
import { EntityResponseType } from 'app/entities/news/service/news.service';
import { SortService } from 'app/shared/sort/sort.service';
import { ICourses } from '../courses.model';
import { CoursesDeleteDialogComponent } from '../delete/courses-delete-dialog.component';
import { CoursesService, EntityArrayResponseType } from '../service/courses.service';
import { CoursesFormGroup, CoursesFormService } from '../update/courses-form.service';
import { HttpResponse } from '@angular/common/http';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'jhi-courses',
  templateUrl: './courses.component.Enrolled.html',
  styleUrls: ['./courses.css'],
})
export class CoursesComponentEnrolled implements OnInit {
  courses?: ICourses[];
  isSaving = false;

  isLoading = false;
  ownerName: string = '';
  predicate = 'id';
  ascending = true;
  editForm: CoursesFormGroup = this.coursesFormService.createCoursesFormGroup();
  previewURL: string = '';
  idUser: number = 0;
  constructor(
    protected coursesService: CoursesService,
    protected activatedRoute: ActivatedRoute,
    public router: Router,
    protected coursesFormService: CoursesFormService,

    protected sortService: SortService,
    protected modalService: NgbModal,
    protected extraUser: ExtraUserInfoService,
    private titleService: Title
  ) {}

  trackId = (_index: number, item: ICourses): number => this.coursesService.getCoursesIdentifier(item);

  ngOnInit(): void {
    this.titleService.setTitle('Cursos Matriculados');

    this.extraUser.getInfoByCurrentUser().subscribe({
      next: (res: EntityResponseType) => {
        // @ts-ignore
        this.idUser = res.body?.user.id;
        const login = res.body?.user?.login;
        if (login != null) {
          this.ownerName = login;
          console.log(this.ownerName);
        }
        this.load();
      },
    });

    this.courses?.sort(this.comparation);
  }
  saveUrl(URL: string): void {
    this.previewURL = URL;
  }
  previousState(): void {
    window.history.back();
  }
  enrolled(idCourse: ICourses): void {
    this.isSaving = true;

    if (idCourse.id !== null) {
      idCourse.users?.push({ id: this.idUser, login: this.ownerName });
      this.subscribeToSaveResponse(this.coursesService.update(idCourse));
    }
  }
  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICourses>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: e => this.onSaveError(e),
    });
  }
  protected onSaveSuccess(): void {
    // TODO: Agregar sweetAlert
  }

  protected onSaveError(e: any): void {
    console.log(e);

    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected findOwnerName(ownerName: string) {
    if (ownerName != null) {
      this.coursesService.findOwner(ownerName);
    }
  }

  delete(courses: ICourses): void {
    const modalRef = this.modalService.open(CoursesDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.courses = courses;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed
      .pipe(
        filter(reason => reason === ITEM_DELETED_EVENT),
        switchMap(() => this.loadFromBackendWithRouteInformations())
      )
      .subscribe({
        next: (res: EntityArrayResponseType) => {
          this.onResponseSuccess(res);
        },
      });
  }

  comparation(courseOne: ICourses, courseTwo: ICourses): number {
    // @ts-ignore
    return courseOne.score < courseTwo.score ? 1 : 0;
  }

  load(): void {
    this.loadFromBackendWithRouteInformations().subscribe({
      next: (res: EntityArrayResponseType) => {
        this.onResponseSuccess(res);
      },
    });
  }

  navigateToWithComponentValues(): void {
    this.handleNavigation(this.predicate, this.ascending);
  }

  protected loadFromBackendWithRouteInformations(): Observable<EntityArrayResponseType> {
    return combineLatest([this.activatedRoute.queryParamMap, this.activatedRoute.data]).pipe(
      tap(([params, data]) => this.fillComponentAttributeFromRoute(params, data)),
      switchMap(() => this.queryBackend(this.predicate, this.ascending))
    );
  }

  protected fillComponentAttributeFromRoute(params: ParamMap, data: Data): void {
    const sort = (params.get(SORT) ?? data[DEFAULT_SORT_DATA]).split(',');
    this.predicate = sort[0];
    this.ascending = sort[1] === ASC;
  }

  protected onResponseSuccess(response: EntityArrayResponseType): void {
    const dataFromBody = this.fillComponentAttributesFromResponseBody(response.body);
    this.courses = this.refineData(dataFromBody);
    this.courses = this.courses.filter(course => course.status === 'active');
  }

  protected refineData(data: ICourses[]): ICourses[] {
    return data.sort(this.sortService.startSort(this.predicate, this.ascending ? 1 : -1));
  }

  protected fillComponentAttributesFromResponseBody(data: ICourses[] | null): ICourses[] {
    return data ?? [];
  }

  protected queryBackend(predicate?: string, ascending?: boolean): Observable<EntityArrayResponseType> {
    this.isLoading = true;
    const queryObject = {
      eagerload: true,
      sort: this.getSortQueryParam(predicate, ascending),
    };
    return this.coursesService.getRegisteredCoursesByUserId(this.idUser).pipe(tap(() => (this.isLoading = false)));
  }

  protected handleNavigation(predicate?: string, ascending?: boolean): void {
    const queryParamsObj = {
      sort: this.getSortQueryParam(predicate, ascending),
    };
    this.router.navigate(['./'], {
      relativeTo: this.activatedRoute,
      queryParams: queryParamsObj,
    });
  }

  protected getSortQueryParam(predicate = this.predicate, ascending = this.ascending): string[] {
    const ascendingQueryParam = ascending ? ASC : DESC;
    if (predicate === '') {
      return [];
    } else {
      return [predicate + ',' + ascendingQueryParam];
    }
  }
}
