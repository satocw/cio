import { Component, ViewChild } from '@angular/core';
import { SearchBoxComponent } from './search/search-box/search-box.component';

@Component({
  selector: 'cio-shell',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @ViewChild(SearchBoxComponent)
  searchBox: SearchBoxComponent;
}
