import { DocumentContents } from 'app/documents/document-contents';
import index from '_doc/index';
import server_setup from '_doc/server/setup';
import server_pages_config from '_doc/server/pages/config';
import server_api_reschedule from '_doc/server/api/reschedule';

export const DOCUMENTS: {
  [id: string]: DocumentContents & { title: string };
} = {
  // トップページ
  index: { ...index, title: 'トップページ' },

  // サーバー
  'server/setup': { ...server_setup, title: 'セットアップ方法と動作環境' },
  'server/pages/config': {
    ...server_pages_config,
    title: 'サーバー設定 ページ'
  },
  'server/api/reschedule': { ...server_api_reschedule, title: 'リスケジュール' }

  // クライアント
};
