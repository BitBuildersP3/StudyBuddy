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
      image: 'https://res.cloudinary.com/dwxpyowvn/image/upload/v1680045268/home_ajor4j.jpg',
      slideTitle: 'First slide label',
      slideExerpt: 'Nulla vitae elit libero, a pharetra augue mollis interdum.',
      redirect: '1',
    },
    {
      image: 'https://res.cloudinary.com/dwxpyowvn/image/upload/v1680045450/peter-gombos-8y3e2M6APy4-unsplash_dgh1ui.jpg',
      slideTitle: 'Second slide label',
      slideExerpt: 'Nulla vitae elit libero, a pharetra augue mollis interdum.',
      redirect: '2',
    },
  ];

  news = [
    {
      image: 'https://res.cloudinary.com/dwxpyowvn/image/upload/v1679364349/samples/animals/kitten-playing.gif',
      title: 'First slide label',
      exerpt: 'Nulla vitae elit libero, a pharetra augue mollis interdum.',
      redirect: '1',
    },
    {
      image: 'https://res.cloudinary.com/dwxpyowvn/image/upload/v1679364349/samples/animals/kitten-playing.gif',
      title: 'Second slide label',
      exerpt: 'Nulla vitae elit libero, a pharetra augue mollis interdum.',
      redirect: '2',
    },
    {
      image: 'https://res.cloudinary.com/dwxpyowvn/image/upload/v1679364349/samples/animals/kitten-playing.gif',
      title: 'Third slide label',
      exerpt: 'Nulla vitae elit libero, a pharetra augue mollis interdum.',
      redirect: '3',
    },
  ];

  instructors = [
    {
      image: 'https://res.cloudinary.com/dwxpyowvn/image/upload/v1679364359/cld-sample.jpg',
      name: 'First slide label',
      about: 'Nulla vitae elit libero, a pharetra augue mollis interdum.',
      redirect: '1',
    },
    {
      image: 'https://res.cloudinary.com/dwxpyowvn/image/upload/v1679364359/cld-sample.jpg',
      name: 'First slide label',
      about: 'Nulla vitae elit libero, a pharetra augue mollis interdum.',
      redirect: '1',
    },
    {
      image: 'https://res.cloudinary.com/dwxpyowvn/image/upload/v1679364359/cld-sample.jpg',
      name: 'First slide label',
      about: 'Nulla vitae elit libero, a pharetra augue mollis interdum.',
      redirect: '1',
    },
    {
      image: 'https://res.cloudinary.com/dwxpyowvn/image/upload/v1679364359/cld-sample.jpg',
      name: 'First slide label',
      about: 'Nulla vitae elit libero, a pharetra augue mollis interdum.',
      redirect: '1',
    },
  ];

  constructor() {}

  ngOnInit(): void {}
}
