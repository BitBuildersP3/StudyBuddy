import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'jhi-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent implements OnInit {
  isOpen = false;
  @Input() btnLabel = 'Agregar';

  setIsOpen(): void {
    this.isOpen = !this.isOpen;
  }

  constructor() {}
  ngOnInit(): void {}
}
