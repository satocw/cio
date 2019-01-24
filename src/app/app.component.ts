import { Component, ViewChild, OnInit, HostListener } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';

import { CurrentNodes, NavigationNode } from 'app/navigation/navigation.model';
import { NavigationService } from 'app/navigation/navigation.service';
import {
  DocumentService,
  DocumentContents
} from 'app/documents/document.service';
import { LocationService } from 'app/shared/location.service';
import { SearchBoxComponent } from 'app/search/search-box/search-box.component';
import { SearchResults } from 'app/search/interfaces';
import { SearchService } from 'app/search/search.service';

import { Observable } from 'rxjs';

@Component({
  selector: 'cio-shell',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  currentDocument: DocumentContents;
  currentDocVersion: NavigationNode;
  currentNodes: CurrentNodes = {};
  currentPath: string;
  docVersions: NavigationNode[];

  /**
   * An HTML friendly identifier for the currently displayed page.
   * This is computed from the `currentDocument.id` by replacing `/` with `-`
   */
  pageId: string;
  /**
   * An HTML friendly identifer for the "folder" of the currently displayed page.
   * This is computed by taking everything up to the first `/` in the `currentDocument.id`
   */
  folderId: string;

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
    private documentService: DocumentService,
    private locationService: LocationService,
    private navigationService: NavigationService,
    private searchService: SearchService
  ) {}

  ngOnInit() {
    /* No need to unsubscribe because this root component never dies */

    this.documentService.currentDocument.subscribe(
      doc => (this.currentDocument = doc)
    );

    this.navigationService.navigationViews.subscribe(views => {
      this.sideNavNodes = views['SideNav'] || [];
    });
  }

  @HostListener('click', [
    '$event.target',
    '$event.button',
    '$event.ctrlKey',
    '$event.metaKey',
    '$event.altKey'
  ])
  onClick(
    eventTarget: HTMLElement,
    button: number,
    ctrlKey: boolean,
    metaKey: boolean,
    altKey: boolean
  ): boolean {
    // // Hide the search results if we clicked outside both the "search box" and the "search results"
    // if (!this.searchElements.some(element => element.nativeElement.contains(eventTarget))) {
    //   this.hideSearchResults();
    // }

    // // Show developer source view if the footer is clicked while holding the meta and alt keys
    // if (eventTarget.tagName === 'FOOTER' && metaKey && altKey) {
    //   this.dtOn = !this.dtOn;
    //   return false;
    // }

    // Deal with anchor clicks; climb DOM tree until anchor found (or null)
    let target: HTMLElement | null = eventTarget;
    while (target && !(target instanceof HTMLAnchorElement)) {
      target = target.parentElement;
    }
    if (target instanceof HTMLAnchorElement) {
      return this.locationService.handleAnchorClick(
        target,
        button,
        ctrlKey,
        metaKey
      );
    }

    // Allow the click to pass through
    return true;
  }

  // Search related methods and handlers

  doSearch(query: string) {
    this.searchResults = this.searchService.search(query);
    this.showSearchResults = !!query;
  }
}
