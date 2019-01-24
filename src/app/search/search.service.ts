import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { concatMap } from 'rxjs/operators';
import { SearchResults } from 'app/search/interfaces';

import server_setup from '_doc/server/setup';
import server_config from '_doc/server/pages/config';

import { DOCUMENTS } from 'app/shared/docs';

@Injectable()
export class SearchService {
  private ready: Observable<boolean>;
  search(query: string): Observable<SearchResults> {
    // return this.ready.pipe(
    //   concatMap(() =>
    //     this.worker.sendMessage<SearchResults>('query-index', query)
    //   )
    // );

    this.ready = of(true);
    return this.ready.pipe(concatMap(() => this.grepSearch(query)));
  }

  // grep型の単純な検索
  private grepSearch(query: string): Observable<SearchResults> {
    function _search() {
      // return DOCUMENTS.map((doc, idx) =>
      //   doc.includes(query) ? { path: idx, result: true } : {}
      // );
    }
    return new Observable(subscriber => {
      subscriber.next({
        query,
        results: _search()
      });
      subscriber.complete();
    });
  }
}
