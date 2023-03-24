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

@Component({
  selector: 'jhi-courses-update',
  templateUrl: './courses-update.component.html',
})
export class CoursesUpdateComponent implements OnInit {
  isSaving = false;
  courses: ICourses | null = null;

  usersSharedCollection: IUser[] = [];
  categoriesSharedCollection: ICategory[] = [];

  editForm: CoursesFormGroup = this.coursesFormService.createCoursesFormGroup();

  constructor(
    protected coursesService: CoursesService,
    protected coursesFormService: CoursesFormService,
    protected userService: UserService,
    protected categoryService: CategoryService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareUser = (o1: IUser | null, o2: IUser | null): boolean => this.userService.compareUser(o1, o2);

  compareCategory = (o1: ICategory | null, o2: ICategory | null): boolean => this.categoryService.compareCategory(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ courses }) => {
      this.courses = courses;
      const elemento = window.localStorage.getItem('UploadFile');

      console.log('ESTE ES EL ELMENTO' + elemento);
      if (courses) {
        this.updateForm(courses);
      }

      this.loadRelationshipsOptions();
    });
  }

  obtenerElemento() {
    const elemento = localStorage.getItem('image');
    console.log(elemento);
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const courses = this.coursesFormService.getCourses(this.editForm);
    if (courses.id !== null) {
      const elemento = window.localStorage.getItem('UploadFile');
      console.log('ESTE ES EL ELMENTO' + elemento);
      courses.previewImg = elemento;
      this.subscribeToSaveResponse(this.coursesService.update(courses));
    } else {
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
