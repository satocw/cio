import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchResultsComponent } from './search-results/search-results.component';

@NgModule({
  imports: [CommonModule],
  exports: [SearchResultsComponent],
  declarations: [SearchResultsComponent]
})
export class SharedModule {}
