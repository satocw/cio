import { Component, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';

import { SearchBoxComponent } from 'app/search/search-box/search-box.component';
import { SearchResults } from 'app/search/interfaces';
import { SearchService } from 'app/search/search.service';

import { Observable } from 'rxjs';

@Component({
  selector: 'cio-shell',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  isSideBySide = true;
  private isSideNavDoc = false;
  get isOpened() {
    return true;
    // return this.isSideBySide && this.isSideNavDoc;
  }

  @ViewChild(MatSidenav)
  sidenav: MatSidenav;

  // Search related properties
  showSearchResults = false;
  searchResults: Observable<SearchResults>;
  @ViewChild(SearchBoxComponent)
  searchBox: SearchBoxComponent;

  constructor(private searchService: SearchService) {}

  // Search related methods and handlers

  doSearch(query: string) {
    this.searchResults = this.searchService.search(query);
    this.showSearchResults = !!query;
  }
}
