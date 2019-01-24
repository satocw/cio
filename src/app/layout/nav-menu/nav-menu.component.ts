import { Component, Input } from '@angular/core';
import { CurrentNode, NavigationNode } from 'app/navigation/navigation.model';

@Component({
  selector: 'cio-nav-menu',
  template: `
    <cio-nav-item
      *ngFor="let node of filteredNodes"
      [node]="node"
      [selectedNodes]="currentNode?.nodes"
      [isWide]="isWide"
    >
    </cio-nav-item>
  `
})
export class NavMenuComponent {
  @Input() currentNode: CurrentNode;
  @Input() isWide = false;
  @Input() nodes: NavigationNode[];
  get filteredNodes() {
    return this.nodes ? this.nodes.filter(n => !n.hidden) : [];
  }
}
