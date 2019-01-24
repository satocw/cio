import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  Output
} from '@angular/core';

import { Observable, of, timer } from 'rxjs';
import { catchError, switchMap, takeUntil, tap } from 'rxjs/operators';

import {
  DocumentContents,
  FILE_NOT_FOUND_ID,
  FETCHING_ERROR_ID
} from 'app/documents/document.service';
import { Logger } from 'app/shared/logger.service';

// Constants
export const NO_ANIMATIONS = 'no-animations';

// Initialization prevents flicker once pre-rendering is on
const initialDocViewerElement = document.querySelector('aio-doc-viewer');
const initialDocViewerContent = initialDocViewerElement
  ? initialDocViewerElement.innerHTML
  : '';

@Component({
  selector: 'cio-doc-viewer',
  template: ''
})
export class DocViewerComponent implements OnDestroy {
  // Enable/Disable view transition animations.
  static animationsEnabled = true;

  private hostElement: HTMLElement;

  private void$ = of<void>(undefined);
  private onDestroy$ = new EventEmitter<void>();
  private docContents$ = new EventEmitter<DocumentContents>();

  protected currViewContainer: HTMLElement = document.createElement('div');
  protected nextViewContainer: HTMLElement = document.createElement('div');

  @Input()
  set doc(newDoc: DocumentContents) {
    // Ignore `undefined` values that could happen if the host component
    // does not initially specify a value for the `doc` input.
    if (newDoc) {
      this.docContents$.emit(newDoc);
    }
  }

  // The new document is ready to be inserted into the viewer.
  // (Embedded components have been loaded and instantiated, if necessary.)
  @Output() docReady = new EventEmitter<void>();

  // The previous document has been removed from the viewer.
  // (The leaving animation (if any) has been completed and the node has been removed from the DOM.)
  @Output() docRemoved = new EventEmitter<void>();

  // The new document has been inserted into the viewer.
  // (The node has been inserted into the DOM, but the entering animation may still be in progress.)
  @Output() docInserted = new EventEmitter<void>();

  // The new document has been fully rendered into the viewer.
  // (The entering animation has been completed.)
  @Output() docRendered = new EventEmitter<void>();

  constructor(elementRef: ElementRef, private logger: Logger) {
    this.hostElement = elementRef.nativeElement;
    // Security: the initialDocViewerContent comes from the prerendered DOM and is considered to be secure
    this.hostElement.innerHTML = initialDocViewerContent;

    if (this.hostElement.firstElementChild) {
      this.currViewContainer = this.hostElement
        .firstElementChild as HTMLElement;
    }
    this.docContents$.pipe(
      switchMap(newDoc => this.render(newDoc)),
      takeUntil(this.onDestroy$)
    );
  }

  ngOnDestroy() {
    this.onDestroy$.emit();
  }

  /**
   * Prepare for setting the window title and ToC.
   * Return a function to actually set them.
   */
  protected prepareTitleAndToc(
    targetElem: HTMLElement,
    docId: string
  ): () => void {
    // TODO: Implement
    return () => {};
  }

  /**
   * Add doc content to host element and build it out with embedded components.
   */
  protected render(doc: DocumentContents): Observable<void> {
    let addTitleAndToc: () => void;

    this.setNoIndex(
      doc.id === FILE_NOT_FOUND_ID || doc.id === FETCHING_ERROR_ID
    );

    return this.void$.pipe(
      // Security: `doc.contents` is always authored by the documentation team
      //           and is considered to be safe.
      tap(() => (this.nextViewContainer.innerHTML = doc.contents || '')),
      tap(
        () =>
          (addTitleAndToc = this.prepareTitleAndToc(
            this.nextViewContainer,
            doc.id
          ))
      ),
      //   switchMap(() =>
      //     this.elementsLoader.loadContainingCustomElements(this.nextViewContainer)
      //   ),
      tap(() => this.docReady.emit()),
      switchMap(() => this.swapViews(addTitleAndToc)),
      tap(() => this.docRendered.emit()),
      catchError(err => {
        const errorMessage = err instanceof Error ? err.stack : err;
        this.logger.error(
          new Error(
            `[DocViewer] Error preparing document '${doc.id}': ${errorMessage}`
          )
        );
        this.nextViewContainer.innerHTML = '';
        this.setNoIndex(true);
        return this.void$;
      })
    );
  }

  /**
   * Tell search engine crawlers whether to index this page
   */
  private setNoIndex(val: boolean) {
    // TODO: Implement metaService
    // if (val) {
    //   this.metaService.addTag({ name: 'robots', content: 'noindex' });
    // } else {
    //   this.metaService.removeTag('name="robots"');
    // }
  }

  /**
   * Swap the views, removing `currViewContainer` and inserting `nextViewContainer`.
   * (At this point all content should be ready, including having loaded and instantiated embedded
   *  components.)
   *
   * Optionally, run a callback as soon as `nextViewContainer` has been inserted, but before the
   * entering animation has been completed. This is useful for work that needs to be done as soon as
   * the element has been attached to the DOM.
   */
  protected swapViews(onInsertedCb = () => {}): Observable<void> {
    const done$ = this.void$;
    return done$;
  }
}
