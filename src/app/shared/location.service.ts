import { Injectable } from '@angular/core';
import { Location } from '@angular/common';

import { ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';

import { BASE_URL } from 'app/app.module';

@Injectable()
export class LocationService {
  private readonly urlParser = document.createElement('a');
  private urlSubject = new ReplaySubject<string>(1);

  currentUrl = this.urlSubject.pipe(map(url => this.stripSlashes(url)));

  currentPath = this.currentUrl.pipe(
    map(url => (url.match(/[^?#]*/) || [])[0]) // strip query and hash
  );

  constructor(private location: Location) {
    this.urlSubject.next(location.path(true));

    this.location.subscribe(state => {
      return this.urlSubject.next(state.url || '');
    });
  }

  // TODO: ignore if url-without-hash-or-search matches current location?
  go(url: string | null | undefined) {
    if (!url) {
      return;
    }
    url = this.stripSlashes(url);
    // if (/^http/.test(url) || this.swUpdateActivated) {
    //   // Has http protocol so leave the site
    //   // (or do a "full page navigation" if a ServiceWorker update has been activated)
    //   this.goExternal(url);
    // } else {
    this.location.go(url);
    this.urlSubject.next(url);
    // }
  }

  private stripSlashes(url: string) {
    return url.replace(/^\/+/, '').replace(/\/+(\?|#|$)/, '$1');
  }

  /**
   * Handle user's anchor click
   *
   * @param anchor {HTMLAnchorElement} - the anchor element clicked
   * @param button Number of the mouse button held down. 0 means left or none
   * @param ctrlKey True if control key held down
   * @param metaKey True if command or window key held down
   * @return false if service navigated with `go()`; true if browser should handle it.
   *
   * Since we are using `LocationService` to navigate between docs, without the browser
   * reloading the page, we must intercept clicks on links.
   * If the link is to a document that we will render, then we navigate using `Location.go()`
   * and tell the browser not to handle the event.
   *
   * In most apps you might do this in a `LinkDirective` attached to anchors but in this app
   * we have a special situation where the `DocViewerComponent` is displaying semi-static
   * content that cannot contain directives. So all the links in that content would not be
   * able to use such a `LinkDirective`. Instead we are adding a click handler to the
   * `AppComponent`, whose element contains all the of the application and so captures all
   * link clicks both inside and outside the `DocViewerComponent`.
   */
  handleAnchorClick(
    anchor: HTMLAnchorElement,
    button = 0,
    ctrlKey = false,
    metaKey = false
  ) {
    // Check for modifier keys and non-left-button, which indicate the user wants to control navigation
    if (button !== 0 || ctrlKey || metaKey) {
      return true;
    }

    // If there is a target and it is not `_self` then we take this
    // as a signal that it doesn't want to be intercepted.
    // TODO: should we also allow an explicit `_self` target to opt-out?
    const anchorTarget = anchor.target;
    if (anchorTarget && anchorTarget !== '_self') {
      return true;
    }

    if (anchor.getAttribute('download') != null) {
      return true; // let the download happen
    }

    const { pathname, search, hash } = anchor;

    function toRelativePath(abs: string) {
      const idx = abs.indexOf(BASE_URL);
      if (idx > -1) {
        return abs.slice(idx + BASE_URL.length);
      } else {
        return abs;
      }
    }
    const _pathname = toRelativePath(pathname);

    const relativeUrl = _pathname + search + hash;
    this.urlParser.href = relativeUrl;

    // don't navigate if external link or has extension
    if (anchor.href !== this.urlParser.href || !/\/[^/.]*$/.test(pathname)) {
      return true;
    }

    // approved for navigation
    this.go(relativeUrl);
    return false;
  }
}
