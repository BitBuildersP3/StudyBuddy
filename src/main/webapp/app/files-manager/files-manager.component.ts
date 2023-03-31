import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'jhi-files-manager',
  templateUrl: './files-manager.component.html',
  styleUrls: ['./files-manager.component.scss'],
})
export class FilesManagerComponent implements OnInit {

  selectedFileComponent: string = 'video';
  constructor() {}

  ngOnInit(): void {}

  showVideoFile() {
    this.selectedFileComponent = 'video';
  }

  showIndexedFile() {
    this.selectedFileComponent = 'indexed';
  }

  showOwnFile() {
    this.selectedFileComponent = 'own';
  }
}
