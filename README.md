# Digital Agri-Pedia 🌱 農作物デジタル図鑑

農作物の育て方・旬の時期・栽培カレンダーを網羅したデジタル図鑑サイトです。

## 技術スタック

| 項目 | 技術 |
|------|------|
| フロントエンド | Next.js 16 (App Router), TypeScript |
| スタイリング | Tailwind CSS v4, カスタム農園テーマ |
| アイコン | Lucide React |
| バックエンド | Firebase Firestore (データ), Firebase Storage (画像) |
| デプロイ | Vercel |

## 主な機能

- **図鑑一覧**: カード型グリッドレイアウト、季節・カテゴリフィルター
- **詳細ページ**: 栽培カレンダー（タイムライン）、5段階難易度表示、育て方コツ
- **インクリメンタルサーチ**: 和名・英名・学名に対応
- **マイ図鑑**: ローカルストレージを使ったお気に入り機能

## セットアップ

### 1. 依存関係インストール

```bash
npm install
```

### 2. Firebase プロジェクト設定

`.env.local.example` をコピーして `.env.local` を作成し、Firebase プロジェクトの値を設定します。

```bash
cp .env.local.example .env.local
```

> **Note:** Firebase を設定しない場合でも、組み込みのサンプルデータ（12種類の農作物）で動作します。

### 3. 開発サーバー起動

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000) で確認できます。

### 4. Firestore へサンプルデータを投入（オプション）

```bash
npm run seed
```

> 実行前に `.env.local` に Firebase Admin SDK の認証情報を設定してください。

## ディレクトリ構造

```
src/
├── app/
│   ├── api/crops/          # REST API（検索・詳細取得）
│   ├── crops/[id]/         # 農作物詳細ページ
│   ├── favorites/          # マイ図鑑ページ
│   ├── layout.tsx          # ルートレイアウト
│   └── page.tsx            # 図鑑一覧ページ（ホーム）
├── components/
│   ├── crops/              # 農作物関連コンポーネント
│   ├── layout/             # Header, Footer
│   └── search/             # 検索バー
├── hooks/
│   └── useFavorites.ts     # お気に入り状態管理
├── lib/
│   ├── cropData.ts         # サンプルデータ（フォールバック用）
│   ├── cropsRepository.ts  # Firestore アクセス層
│   └── firebase.ts         # Firebase クライアント設定
├── scripts/
│   └── seedFirestore.ts    # Firestore シードスクリプト
└── types/
    └── crop.ts             # TypeScript 型定義
```

## Vercel へのデプロイ

1. Vercel にリポジトリをインポート
2. 環境変数（`NEXT_PUBLIC_FIREBASE_*`）を Vercel のプロジェクト設定に追加
3. デプロイ

## デザインコンセプト

- **テーマ**: 温かみのある農園スタイル
- **メインカラー**: セージグリーン `#87a96b`
- **アクセント**: 土のブラウン、実りのオレンジ
- **質感**: 紙のようなテクスチャ、手書き風の親しみある「図鑑」の雰囲気
