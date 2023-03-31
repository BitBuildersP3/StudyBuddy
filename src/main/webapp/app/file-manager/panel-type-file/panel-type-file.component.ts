import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'jhi-panel-type-file',
  templateUrl: './panel-type-file.component.html',
  styleUrls: ['./panel-type-file.component.scss']
})
export class PanelTypeFileComponent implements OnInit {

  selected: string = 'video';
  constructor() { }

  ngOnInit(): void {
  }

  setSelected(type: string) {
    this.selected = type;
  }


}
