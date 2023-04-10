import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'jhi-instructors',
  templateUrl: './instructors.component.html',
  styleUrls: ['./instructors.component.scss'],
})
export class InstructorsComponent implements OnInit {
  @Input()
  instructors: any[] = [];
  constructor() {}

  ngOnInit(): void {}
}
