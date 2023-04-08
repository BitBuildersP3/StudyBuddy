import { AfterViewInit, Directive, EventEmitter, Input, OnInit } from '@angular/core';
import { Output } from '@angular/core';

@Directive({
  selector: '[jhiUrlChange]',
})
export class UrlChangeDirective implements OnInit, AfterViewInit {
  @Input('url') url: string | undefined;
  @Output('onUrlReady') onUrlReady: EventEmitter<string> = new EventEmitter<string>();

  pattern = /v=([A-Za-z0-9_-]+)/;

  constructor() {}

  ngAfterViewInit(): void {
    if (this.url != undefined) {
      let match = this.url.match(this.pattern);
      // @ts-ignore
      this.onUrlReady.emit(match[1]);
    }
  }

  ngOnInit(): void {}
}
