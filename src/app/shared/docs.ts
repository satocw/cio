import { DocumentContents } from 'app/documents/document-contents';
import index from '_doc/index';
import server_setup from '_doc/server/setup';
import server_pages_config from '_doc/server/pages/config';
import server_api_reschedule from '_doc/server/api/reschedule';

export const DOCUMENTS: {
  [id: string]: DocumentContents;
} = {
  // トップページ
  index,

  // サーバー
  'server/setup': server_setup,
  'server/pages/config': server_pages_config,
  'server/api/reschedule': server_api_reschedule

  // クライアント
};
