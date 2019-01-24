import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { CurrentNodes, NavigationViews } from './navigation.model';

const CONTENT_URL_PREFIX = 'assets/';
const navigationPath = CONTENT_URL_PREFIX + 'navigation.json';

@Injectable()
export class NavigationService {
  /**
   * An observable collection of NavigationNode trees, which can be used to render navigational menus
   */
  navigationViews: Observable<NavigationViews>;

  /**
   * An observable of the current node with info about the
   * node (if any) that matches the current URL location
   * including its navigation view and its ancestor nodes in that view
   */
  currentNodes: Observable<CurrentNodes>;

  constructor(private http: HttpClient) {
    this.navigationViews = this.getNavigationViews();

    // this.currentNodes = this.getCurrentNodes(this.navigationViews);
  }

  private getNavigationViews() {
    const navigationViews = this.http.get(navigationPath).pipe(
      map(response => {
        const views = Object.assign({}, response);
        Object.keys(views).forEach(key => {
          if (key[0] === '_') {
            delete views[key];
          }
        });
        return views as NavigationViews;
      })
    );
    return navigationViews;
  }

  /**
   * Get an observable of the current nodes (the ones that match the current URL)
   * We use `publishReplay(1)` because otherwise subscribers will have to wait until the next
   * URL change before they receive an emission.
   * See above for discussion of using `connect`.
   */
  // private getCurrentNodes(
  //   navigationViews: Observable<NavigationViews>
  // ): Observable<CurrentNodes> {
  //   const currentNodes = combineLatest(
  //     navigationViews.pipe(map(views => this.computeUrlToNavNodesMap(views))),
  //     this.location.currentPath,
  //     (navMap, url) => {
  //       const urlKey = url.startsWith('api/') ? 'api' : url;
  //       return (
  //         navMap.get(urlKey) || { '': { view: '', url: urlKey, nodes: [] } }
  //       );
  //     }
  //   ).pipe(publishReplay(1));
  //   (currentNodes as ConnectableObservable<CurrentNodes>).connect();
  //   return currentNodes;
  // }
}
