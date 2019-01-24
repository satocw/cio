export interface SearchResults {
  query: string;
  //   results: SearchResult[];
  results: any;
}

interface SearchResult {
  path: string;
  title: string;
  type: string;
  titleWords: string;
  keywords: string;
}
