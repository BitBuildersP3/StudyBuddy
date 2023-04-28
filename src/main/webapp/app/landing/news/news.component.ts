import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'jhi-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss'],
})
export class NewsComponent implements OnInit {
  @Input()
  news: any[] = [];
  @Input()
  redirect: any = '';
  @Input()
  coursesRed: boolean = false;

  constructor() {}

  ngOnInit(): void {}
}
