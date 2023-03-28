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

  news = [
    {
      image: 'https://picsum.photos/900/500?random=1',
      title: 'First slide label',
      exerpt: 'Nulla vitae elit libero, a pharetra augue mollis interdum.',
      redirect: '1',
    },
    {
      image: 'https://picsum.photos/900/500?random=2',
      title: 'Second slide label',
      exerpt: 'Nulla vitae elit libero, a pharetra augue mollis interdum.',
      redirect: '2',
    },
    {
      image: 'https://picsum.photos/900/500?random=3',
      title: 'Third slide label',
      exerpt: 'Nulla vitae elit libero, a pharetra augue mollis interdum.',
      redirect: '3',
    },
  ];

  instructors = [
    {
      image: 'https://picsum.photos/900/500?random=8',
      name: 'First slide label',
      about: 'Nulla vitae elit libero, a pharetra augue mollis interdum.',
      redirect: '1',
    },
    {
      image: 'https://picsum.photos/900/500?random=9',
      name: 'First slide label',
      about: 'Nulla vitae elit libero, a pharetra augue mollis interdum.',
      redirect: '1',
    },
    {
      image: 'https://picsum.photos/900/500?random=10',
      name: 'First slide label',
      about: 'Nulla vitae elit libero, a pharetra augue mollis interdum.',
      redirect: '1',
    },
    {
      image: 'https://picsum.photos/900/500?random=11',
      name: 'First slide label',
      about: 'Nulla vitae elit libero, a pharetra augue mollis interdum.',
      redirect: '1',
    },
  ];

  constructor() {}

  ngOnInit(): void {}
}
