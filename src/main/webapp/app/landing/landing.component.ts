import { Component, OnInit } from '@angular/core';
import { NgbCarousel } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'jhi-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
})
export class LandingComponent implements OnInit {
  slides = [
    {
      image: 'https://picsum.photos/900/500?random=1',
      slideTitle: 'First slide label',
      slideExerpt: 'Nulla vitae elit libero, a pharetra augue mollis interdum.',
      redirect: '1',
    },
    {
      image: 'https://picsum.photos/900/500?random=2',
      slideTitle: 'Second slide label',
      slideExerpt: 'Nulla vitae elit libero, a pharetra augue mollis interdum.',
      redirect: '2',
    },
  ];

  constructor() {}

  ngOnInit(): void {}
}
