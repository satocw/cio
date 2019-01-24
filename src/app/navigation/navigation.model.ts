export interface NavigationNode {
  url?: string;
  title?: string;
  tooltip?: string;
  hidden?: boolean;
  children?: NavigationNode[];
}

export interface NavigationViews {
  [name: string]: NavigationNode[];
}

/**
 *  Navigation information about a node at specific URL
 *  url: the current URL
 *  view: 'SideNav' | 'TopBar' | 'Footer' | etc
 *  nodes: the current node and its ancestor nodes within that view
 */
export interface CurrentNode {
  url: string;
  view: string;
  nodes: NavigationNode[];
}
