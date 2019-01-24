import { Component, ViewChild, OnInit } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';

import { NavigationNode } from 'app/navigation/navigation.model';
import { NavigationService } from 'app/navigation/navigation.service';
import { SearchBoxComponent } from 'app/search/search-box/search-box.component';
import { SearchResults } from 'app/search/interfaces';
import { SearchService } from 'app/search/search.service';

import { Observable } from 'rxjs';

@Component({
  selector: 'cio-shell',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  isSideBySide = false;
  private isSideNavDoc = false;

  sideNavNodes: NavigationNode[];

  get isOpened() {
    return this.isSideBySide && this.isSideNavDoc;
  }
  get mode() {
    return this.isSideBySide ? 'side' : 'over';
  }

  @ViewChild(MatSidenav)
  sidenav: MatSidenav;

  // Search related properties
  showSearchResults = false;
  searchResults: Observable<SearchResults>;
  @ViewChild(SearchBoxComponent)
  searchBox: SearchBoxComponent;

  constructor(
    private navigationService: NavigationService,
    private searchService: SearchService
  ) {}

  ngOnInit() {
    this.navigationService.navigationViews.subscribe(views => {
      this.sideNavNodes = views['SideNav'] || [];
    });
  }

  // Search related methods and handlers

  doSearch(query: string) {
    this.searchResults = this.searchService.search(query);
    this.showSearchResults = !!query;
  }
}
