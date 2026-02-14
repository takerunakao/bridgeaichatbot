# AI Chatbot — Bridge to Practice Challenge

プレミアムなダークテーマ UI を備えた AI チャットアプリケーションです。  
OpenAI の最新モデル（GPT-5.2 / 5.1 / 4.1 など）とリアルタイムで会話できます。

## ✨ 主な機能

| 機能 | 説明 |
|------|------|
| **マルチモデル選択** | GPT-5.2, GPT-5.1, GPT-5, GPT-4.1, GPT-4o, o4-mini, o3-mini をドロップダウンで切り替え |
| **スタンプ送信** | 7 カテゴリ（人気・顔・手・動物・食べ物・活動・記号）の絵文字スタンプを LINE 風に送信 |
| **メッセージリアクション** | Slack 風のホバーリアクション（👍😊🎉❤️😂🔥 + 拡張ピッカー） |
| **マルチスレッド** | 複数チャットの切り替え・管理 |
| **Markdown 表示** | AI 応答のコードブロック・テーブル・リスト等をリッチに描画 |
| **ストリーミング** | リアルタイム文字送出 |
| **テーマ切替** | ダーク / ライトモード |
| **レスポンシブ** | モバイル対応サイドバー |

## 🛠 技術スタック

- **フレームワーク**: [Next.js 14](https://nextjs.org/) (App Router)
- **言語**: TypeScript
- **AI SDK**: [Vercel AI SDK](https://sdk.vercel.ai/) (`ai@3` + `@ai-sdk/openai`)
- **UI**: React 18, Lucide Icons, CSS Custom Properties
- **Markdown**: react-markdown + remark-gfm

## 🚀 セットアップ

### 前提条件

- **Node.js** 18.18 以上
- **OpenAI API キー** — [取得はこちら](https://platform.openai.com/api-keys)

### インストール

```bash
# リポジトリをクローン
git clone https://github.com/<your-username>/bridgeaichatbot.git
cd bridgeaichatbot

# 依存関係をインストール
npm install

# 環境変数を設定
cp .env.example .env.local
# .env.local を編集して OPENAI_API_KEY にキーを設定
```

### 起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開きます。

### ビルド

```bash
npm run build
npm start
```

## 📁 プロジェクト構成

```
src/
├── app/
│   ├── api/chat/route.ts    # OpenAI ストリーミング API
│   ├── globals.css          # デザインシステム（CSS 変数）
│   ├── layout.tsx           # ルートレイアウト
│   └── page.tsx             # メインページ
├── components/
│   ├── ChatWindow.tsx       # チャット画面本体
│   ├── ChatInput.tsx        # メッセージ入力
│   ├── MessageBubble.tsx    # メッセージ表示
│   ├── Sidebar.tsx          # サイドバー（スレッド管理）
│   ├── ModelSelector.tsx    # モデル選択ドロップダウン
│   ├── StampPicker.tsx      # スタンプパレット
│   ├── StampMessage.tsx     # スタンプメッセージ表示
│   ├── ReactionBar.tsx      # メッセージリアクション
│   └── ThemeToggle.tsx      # テーマ切替
├── hooks/
│   └── useChatThreads.ts    # スレッド管理フック
└── lib/
    └── types.ts             # 型定義
```

## 📝 環境変数

| 変数名 | 必須 | 説明 |
|--------|------|------|
| `OPENAI_API_KEY` | ✅ | OpenAI API キー |

## ▲ Vercel へデプロイ

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2F<your-username>%2Fbridgeaichatbot&env=OPENAI_API_KEY&envDescription=OpenAI%20API%20Key%20%E2%80%94%20https%3A%2F%2Fplatform.openai.com%2Fapi-keys)

### 手動デプロイ

1. [Vercel](https://vercel.com) にログインし、**New Project** → GitHub リポジトリを選択
2. **Environment Variables** に `OPENAI_API_KEY` を追加
3. **Deploy** をクリック — 自動でビルド＆デプロイされます

> [!TIP]
> `vercel.json` でリージョンを **東京 (`hnd1`)** に設定済みです。日本からのアクセスに最適化されています。

## ライセンス

MIT
