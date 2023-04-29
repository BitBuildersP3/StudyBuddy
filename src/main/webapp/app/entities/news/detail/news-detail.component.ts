import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { INews } from '../news.model';
import { NewsService } from '../service/news.service';

@Component({
  selector: 'jhi-news-detail',
  templateUrl: './news-detail.component.html',
  styleUrls: ['./news-detail.component.scss'],
})
export class NewsDetailComponent implements OnInit {
  @Input() news: INews | null = null;
  @Input() newId: number = 0;

  constructor(protected activatedRoute: ActivatedRoute, private newsService: NewsService) {}

  ngOnInit(): void {
    console.log('pasa');
    this.newsService.find(this.newId).subscribe(response => {
      this.news = response.body;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
