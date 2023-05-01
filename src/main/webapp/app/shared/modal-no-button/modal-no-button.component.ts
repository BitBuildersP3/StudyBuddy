import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { IconName, IconProp } from '@fortawesome/fontawesome-svg-core';

@Component({
  selector: 'jhi-modal-no-button',
  templateUrl: './modal-no-button.component.html',
  styleUrls: ['./modal-no-button.component.scss'],
})
export class ModalNoButtonComponent implements OnInit {
  @Input() setIsOpen!: () => boolean;
  @Input() isOpen: any = '';

  // ngOnChanges(changes: SimpleChanges): void {
  //   if (changes.isOpen && !changes.isOpen.firstChange) {
  //     console.log(this.isOpen);
  //   }
  // }

  state = true;

  setOpen(): void {
    this.setIsOpen();
    console.log(this.state);
  }

  constructor() {}

  ngOnInit(): void {}
}
