import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RefreshService {
  private refreshNeed = new Subject<void>();

  refresh$ = this.refreshNeed.asObservable();

  refresh() {
    this.refreshNeed.next();
  }

  constructor() {}
}
