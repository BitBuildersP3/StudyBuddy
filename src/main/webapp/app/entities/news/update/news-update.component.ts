import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Data, ParamMap } from '@angular/router';
import { combineLatest, filter, Observable, switchMap, tap } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { NewsFormService, NewsFormGroup } from './news-form.service';
import { INews } from '../news.model';
import { EntityArrayResponseType, NewsService } from '../service/news.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { NewsDeleteDialogComponent } from '../delete/news-delete-dialog.component';
import { ASC, DEFAULT_SORT_DATA, DESC, ITEM_DELETED_EVENT, SORT } from '../../../config/navigation.constants';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import dayjs from 'dayjs';
@Component({
  selector: 'jhi-news-update',
  templateUrl: './news-update.component.html',
})
export class NewsUpdateComponent implements OnInit {
  isSaving = false;
  news: INews | null = null;
  previewURL: string = '';
  isUpdate: boolean = false;

  usersSharedCollection: IUser[] = [];

  editForm: NewsFormGroup = this.newsFormService.createNewsFormGroup();

  constructor(
    protected newsService: NewsService,
    protected newsFormService: NewsFormService,
    protected userService: UserService,
    protected activatedRoute: ActivatedRoute,
    protected modalService: NgbModal
  ) {}

  compareUser = (o1: IUser | null, o2: IUser | null): boolean => this.userService.compareUser(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ news }) => {
      this.news = news;
      if (news) {
        this.updateForm(news);
        this.isUpdate = true;
      }
      this.previewURL = news.image;
      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  saveImage(url: string) {
    this.previewURL = url;
  }

  save(): void {
    this.isSaving = true;
    const news = this.newsFormService.getNews(this.editForm);
    if (this.previewURL === '') {
      news.image = 'https://res.cloudinary.com/dwxpyowvn/image/upload/v1681166198/default-image_ltck0i.webp';
    } else {
      news.image = this.previewURL;
    }
    if (news.id !== null) {
      this.subscribeToSaveResponse(this.newsService.update(news));
    } else {
      // @ts-ignore
      news.creationDate = dayjs();
      this.subscribeToSaveResponse(this.newsService.create(news));
    }
  }

  delete(news: INews | null): void {
    const modalRef = this.modalService.open(NewsDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.news = news;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe({
      next: (res: EntityArrayResponseType) => {
        this.onResponseSuccess();
      },
    });
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<INews>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onResponseSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onResponseSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(news: INews): void {
    this.news = news;
    this.newsFormService.resetForm(this.editForm, news);

    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing<IUser>(this.usersSharedCollection, news.user);
  }

  protected loadRelationshipsOptions(): void {
    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing<IUser>(users, this.news?.user)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));
  }
}
