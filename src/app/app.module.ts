import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {
  Location,
  LocationStrategy,
  PathLocationStrategy
} from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';

import { AppComponent } from 'app/app.component';
import { CustomIconRegistry, SVG_ICONS } from 'app/shared/custom-icon-registry';
import { DocViewerComponent } from 'app/layout/doc-viewer/doc-viewer.component';
import { Logger } from 'app/shared/logger.service';
import { LocationService } from 'app/shared/location.service';
import { NavigationService } from 'app/navigation/navigation.service';
import { DocumentService } from 'app/documents/document.service';
import { SearchService } from 'app/search/search.service';
import { SearchBoxComponent } from 'app/search/search-box/search-box.component';
import { NavMenuComponent } from 'app/layout/nav-menu/nav-menu.component';
import { NavItemComponent } from 'app/layout/nav-item/nav-item.component';

import { SharedModule } from 'app/shared/shared.module';

export const BASE_URL = 'application/CarryOut/_test/';

// These are the hardcoded inline svg sources to be used by the `<mat-icon>` component
export const svgIconProviders = [
  {
    provide: SVG_ICONS,
    useValue: {
      name: 'keyboard_arrow_right',
      svgSource:
        '<svg xmlns="http://www.w3.org/2000/svg" focusable="false" ' +
        'viewBox="0 0 24 24"><path d="M8.59 16.34l4.58-4.59-4.58-4.59L10 5.75l6 6-6 6z"/></svg>'
    },
    multi: true
  },
  {
    provide: SVG_ICONS,
    useValue: {
      name: 'menu',
      svgSource:
        '<svg xmlns="http://www.w3.org/2000/svg" focusable="false" ' +
        'viewBox="0 0 24 24"><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/></svg>'
    },
    multi: true
  },
  {
    provide: SVG_ICONS,
    useValue: {
      name: 'insert_comment',
      svgSource:
        '<svg fill="#FFFFFF" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">' +
        '<path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>' +
        '<path d="M0 0h24v24H0z" fill="none"/>' +
        '</svg>'
    },
    multi: true
  },
  {
    provide: SVG_ICONS,
    useValue: {
      name: 'close',
      svgSource:
        '<svg fill="#ffffff" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">' +
        '<path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>' +
        '<path d="M0 0h24v24H0z" fill="none"/>' +
        '</svg>'
    },
    multi: true
  }
];

@NgModule({
  declarations: [
    AppComponent,
    DocViewerComponent,
    NavMenuComponent,
    NavItemComponent,
    SearchBoxComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    MatSidenavModule,
    MatToolbarModule,
    SharedModule
  ],
  providers: [
    DocumentService,
    Logger,
    Location,
    { provide: LocationStrategy, useClass: PathLocationStrategy },
    LocationService,
    { provide: MatIconRegistry, useClass: CustomIconRegistry },
    NavigationService,
    SearchService,
    svgIconProviders
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
