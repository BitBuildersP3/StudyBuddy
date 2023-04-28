import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { NewsFormService, NewsFormGroup } from './news-form.service';
import { INews } from '../news.model';
import { NewsService } from '../service/news.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

@Component({
  selector: 'jhi-news-update',
  templateUrl: './news-update.component.html',
})
export class NewsUpdateComponent implements OnInit {
  isSaving = false;
  news: INews | null = null;
  previewURL: string = '';

  usersSharedCollection: IUser[] = [];

  editForm: NewsFormGroup = this.newsFormService.createNewsFormGroup();

  constructor(
    protected newsService: NewsService,
    protected newsFormService: NewsFormService,
    protected userService: UserService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareUser = (o1: IUser | null, o2: IUser | null): boolean => this.userService.compareUser(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ news }) => {
      this.news = news;
      if (news) {
        this.updateForm(news);
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
      this.subscribeToSaveResponse(this.newsService.create(news));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<INews>>): void {
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
