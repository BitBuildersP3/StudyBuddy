import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
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
  // @Input() outterAction: any = 'hide';

  // ngOnChanges(changes: SimpleChanges): void {
  //   if ('outterAction' in changes) {
  //     // Only execute this code if the 'myInput' input property has changed
  //     console.log('changes');
  //     console.log(changes);
  //   }
  //   this.isOpen = false;
  // }

  setIsOpen(): void {
    this.isOpen = !this.isOpen;
  }

  constructor() {}
  ngOnInit(): void {}
}
