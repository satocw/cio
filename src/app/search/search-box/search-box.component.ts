import { Component } from '@angular/core';

@Component({
  selector: 'cio-search-box',
  template: `
    <input #searchBox type="search" aria-label="search" placeholder="Search" />
  `
})
export class SearchBoxComponent {}
