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

import { Observable, combineLatest } from 'rxjs';
import { first } from 'rxjs/operators';

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

  isSideBySide = true;
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

    // Generally, we want to delay updating the shell (e.g. host classes, sidenav state) for the new
    // document, until after the leaving document has been removed (to avoid having the styles for
    // the new document applied prematurely).
    // For the first document, though, (when we know there is no previous document), we want to
    // ensure the styles are applied as soon as possible to avoid flicker.
    combineLatest(
      this.documentService.currentDocument // ...needed to determine host classes
      // this.navigationService.currentNodes // ...needed to determine `sidenav` state
    )
      .pipe(first())
      .subscribe(() => this.updateShell());
  }

  onDocReady() {}
  onDocRemoved() {}
  onDocInserted() {
    // Update the shell (host classes, sidenav state) to match the new document.
    // This may be called as a result of actions initiated by view updates.
    // In order to avoid errors (e.g. `ExpressionChangedAfterItHasBeenChecked`), updating the view
    // (e.g. sidenav, host classes) needs to happen asynchronously.
    setTimeout(() => this.updateShell());
  }
  onDocRendered() {}

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

  setPageId(id: string) {
    // Special case the home page
    this.pageId = id === 'index' ? 'home' : id.replace('/', '-');
  }

  setFolderId(id: string) {
    // Special case the home page
    this.folderId = id === 'index' ? 'home' : id.split('/', 1)[0];
  }

  updateShell() {
    // Update the SideNav state (if necessary).
    // this.updateSideNav();

    // Update the host classes.
    this.setPageId(this.currentDocument.id);
    this.setFolderId(this.currentDocument.id);
    // this.updateHostClasses();
  }

  // Search related methods and handlers

  doSearch(query: string) {
    this.searchResults = this.searchService.search(query);
    this.showSearchResults = !!query;
  }
}
