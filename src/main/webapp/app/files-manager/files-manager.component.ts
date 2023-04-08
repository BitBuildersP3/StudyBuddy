import { Component, Input, OnInit } from '@angular/core';
@Component({
  selector: 'jhi-files-manager',
  templateUrl: './files-manager.component.html',
  styleUrls: ['./files-manager.component.scss'],
})
export class FilesManagerComponent implements OnInit {
  @Input() idSection: any;
  @Input() idCourse: any;

  activeButton: string = 'video';

  selectedFileComponent: string = 'video';
  constructor() {}

  ngOnInit(): void {}

  showVideoFile() {
    this.selectedFileComponent = 'video';
    this.activeButton = 'video';
  }

  showIndexedFile() {
    this.selectedFileComponent = 'indexed';
    this.activeButton = 'indexed';
  }

  showOwnFile() {
    this.selectedFileComponent = 'own';
    this.activeButton = 'own';
  }
}
