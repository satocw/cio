import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { concatMap } from 'rxjs/operators';
import { SearchResults } from 'app/search/interfaces';

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
      return Object.keys(DOCUMENTS)
        .map(id => {
          const doc = DOCUMENTS[id];
          const contents = doc.contents;
          const idx = contents.toLowerCase().indexOf(query.toLowerCase()); // 小文字大文字を区別せずに検索
          if (idx > -1) {
            const startTagEnd = contents.lastIndexOf('>', idx);
            const startTagStart = contents.lastIndexOf('<', idx);
            const endTagStart = contents.indexOf('<', idx);
            const endTagEnd = contents.indexOf('>', idx);

            if (startTagStart > startTagEnd || endTagStart > endTagEnd) {
              // タグ内の文字列にひっかかった
              return null;
            }

            return {
              path: id,
              title: doc.title,
              keywords: contents.slice(startTagEnd + 1, endTagStart) // 見つかった文字列の直前の「>」から直後の「<」までを切り出す
              // idx: idx,  // For Debug
              // start: startTagIdx,  // For Debug
              // end: endTagIdx // For Debug
            };
          }
          return null;
        })
        .filter(val => !!val);
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
