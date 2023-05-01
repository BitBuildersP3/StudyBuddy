import { Component, OnInit, Input } from '@angular/core';
import { INews } from '../../entities/news/news.model';

@Component({
  selector: 'jhi-news-component',
  templateUrl: './news-component.component.html',
  styleUrls: ['./news-component.component.scss'],
})
export class NewsComponentComponent implements OnInit {
  @Input() news: any = [];

  constructor() {}

  ngOnInit(): void {}
}
