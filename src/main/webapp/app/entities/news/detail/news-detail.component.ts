import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { INews } from '../news.model';

@Component({
  selector: 'jhi-news-detail',
  templateUrl: './news-detail.component.html',
})
export class NewsDetailComponent implements OnInit {
  news: INews | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ news }) => {
      this.news = news;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
