import {
  Component,
  ViewChild,
  ElementRef,
  EventEmitter,
  Output
} from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'cio-search-box',
  template: `
    <input
      #searchBox
      type="search"
      aria-label="search"
      placeholder="検索"
      (input)="doSearch()"
      (focus)="doFocus()"
      (keyup)="doSearch()"
      (click)="doSearch()"
    />
  `
})
export class SearchBoxComponent {
  private searchDebounce = 300;
  private searchSubject = new Subject<string>();

  @ViewChild('searchBox') searchBox: ElementRef;
  @Output() onSearch = this.searchSubject.pipe(
    distinctUntilChanged(),
    debounceTime(this.searchDebounce)
  );
  @Output() onFocus = new EventEmitter<string>();

  doSearch() {
    this.searchSubject.next(this.query);
  }

  doFocus() {
    this.onFocus.emit(this.query);
  }

  private get query() {
    return this.searchBox.nativeElement.value;
  }
}
