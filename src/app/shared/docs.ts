import { DocumentContents } from 'app/documents/document-contents';
import index from '_doc/index';

// サーバー
import s_setup from '_doc/server/setup';
import s_pages_config from '_doc/server/pages/config';
import s_api_reschedule from '_doc/server/api/reschedule';
import s_api_reset from '_doc/server/api/reset';

// クライアント
import c_setup from '_doc/client/setup';
import c_setup_windows from '_doc/client/setup-windows';
import c_custom_layout from '_doc/client/custom-layout';

// GP
import g_how_to_use from '_doc/gp/how-to-use';
import g_io_gp from '_doc/gp/io-gp';

// その他
import o_upgrade_from_v2 from '_doc/others/upgrade-from-v2';

// prettier-ignore
export const DOCUMENTS: {
  [id: string]: DocumentContents & { title: string };
} = {
  // トップページ
  index: { ...index, title: 'トップページ' },

  // サーバー
  'server/setup': { ...s_setup, title: 'セットアップ方法と動作環境' },
  'server/pages/config': { ...s_pages_config, title: 'サーバー設定 ページ' },
  'server/api/reschedule': { ...s_api_reschedule, title: 'リスケジュール' },
  'server/api/reset': { ...s_api_reset, title: 'リセット' },

  // クライアント
  'client/setup': { ...c_setup, title: 'インストール方法と動作環境' },
  'client/setup-windows': { ...c_setup_windows, title: 'Windows版のインストール' },
  'client/custom-layout': { ...c_custom_layout, title: '画面レイアウトのカスタマイズ' },

  // GP
  'gp/how-to-use': { ...g_how_to_use, title: 'FLEXSCHE CarryOutの使用方法' },
  'gp/io-gp': { ...g_io_gp, title: 'FLEXSCHE GPとのデータ連携' },

  // その他
  'upgrade-from-v2': { ...o_upgrade_from_v2, title: 'バージョン２からバージョン３への移行方法' }
};
