import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { CoursesFormService, CoursesFormGroup } from './courses-form.service';
import { ICourses } from '../courses.model';
import { CoursesService } from '../service/courses.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { ICategory } from 'app/entities/category/category.model';
import { CategoryService } from 'app/entities/category/service/category.service';
import { EntityResponseType, ExtraUserInfoService } from 'app/entities/extra-user-info/service/extra-user-info.service';

@Component({
  selector: 'jhi-courses-update',
  templateUrl: './courses-update.component.html',
})
export class CoursesUpdateComponent implements OnInit {
  isSaving = false;
  courses: ICourses | null = null;
  idUser: number = 0;
  ownerName: string;
  usersSharedCollection: IUser[] = [];
  categoriesSharedCollection: ICategory[] = [];
  previewURL: string = '';
  editForm: CoursesFormGroup = this.coursesFormService.createCoursesFormGroup();
  users?: Pick<IUser, 'id' | 'login'>[] | null;
  constructor(
    protected coursesService: CoursesService,
    protected coursesFormService: CoursesFormService,
    protected userService: UserService,
    protected categoryService: CategoryService,
    protected activatedRoute: ActivatedRoute,
    protected extraUser: ExtraUserInfoService
  ) {
    this.ownerName = '';
  }

  compareUser = (o1: IUser | null, o2: IUser | null): boolean => this.userService.compareUser(o1, o2);

  compareCategory = (o1: ICategory | null, o2: ICategory | null): boolean => this.categoryService.compareCategory(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ courses }) => {
      this.courses = courses;
      if (courses) {
        this.updateForm(courses);
      }

      this.loadRelationshipsOptions();
    });

    this.extraUser.getInfoByCurrentUser().subscribe({
      next: (res: EntityResponseType) => {
        // @ts-ignore
        this.idUser = res.body?.user.id;
        const login = res.body?.user?.login;
        if (login != null) {
          this.ownerName = login;
        }

        console.log(res.body);
      },
    });
  }

  saveUrl(URL: string): void {
    this.previewURL = URL;
  }
  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const courses = this.coursesFormService.getCourses(this.editForm);

    if (this.previewURL !== '') courses.previewImg = this.previewURL;

    if (courses.id !== null) {
      courses.users?.push({ id: this.idUser, login: this.ownerName });
      this.subscribeToSaveResponse(this.coursesService.partialUpdate(courses));
    } else {
      courses.ownerName = this.ownerName;
      courses.userId = this.idUser;
      this.subscribeToSaveResponse(this.coursesService.create(courses));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICourses>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(courses: ICourses): void {
    this.courses = courses;
    this.coursesFormService.resetForm(this.editForm, courses);
    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing<IUser>(this.usersSharedCollection, ...(courses.users ?? []));
    this.categoriesSharedCollection = this.categoryService.addCategoryToCollectionIfMissing<ICategory>(
      this.categoriesSharedCollection,
      courses.category
    );
  }

  protected loadRelationshipsOptions(): void {
    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing<IUser>(users, ...(this.courses?.users ?? []))))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));

    this.categoryService
      .query()
      .pipe(map((res: HttpResponse<ICategory[]>) => res.body ?? []))
      .pipe(
        map((categories: ICategory[]) =>
          this.categoryService.addCategoryToCollectionIfMissing<ICategory>(categories, this.courses?.category)
        )
      )
      .subscribe((categories: ICategory[]) => (this.categoriesSharedCollection = categories));
  }
}
