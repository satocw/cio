import { DocumentContents } from 'app/documents/document-contents';
import index from '_doc/index';
import server_setup from '_doc/server/setup';

export const DOCUMENTS: {
  [id: string]: DocumentContents;
} = {
  index,
  'server/setup': server_setup
};
