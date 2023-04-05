import { Component, OnInit, Input } from '@angular/core';
import { IconName, IconProp } from '@fortawesome/fontawesome-svg-core';

@Component({
  selector: 'jhi-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent implements OnInit {
  isOpen = false;
  @Input() btnLabel = 'Agregar';
  @Input() icon: any = '';
  @Input() typeBtn = '';

  setIsOpen(): void {
    this.isOpen = !this.isOpen;
  }

  constructor() {}
  ngOnInit(): void {}
}
