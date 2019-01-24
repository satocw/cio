import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { NavigationViews } from './navigation.model';

const CONTENT_URL_PREFIX = 'assets/';
const navigationPath = CONTENT_URL_PREFIX + 'navigation.json';

@Injectable()
export class NavigationService {
  /**
   * An observable collection of NavigationNode trees, which can be used to render navigational menus
   */
  navigationViews: Observable<NavigationViews>;

  constructor(private http: HttpClient) {
    this.navigationViews = this.getNavigationViews();
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
}
