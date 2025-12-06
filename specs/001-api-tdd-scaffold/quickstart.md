# Quickstart — 開発者向け最小手順

このスキャフォールドは TypeScript ベースで、OpenAPI を単一の真実（`docs/petstore-openai.yaml`）として扱います。以下はローカルで素早く動かすための手順です。

前提: Node.js 24.x, `npm` がインストールされていること。

1. 依存関係をインストール

```bash
npm ci
```

2. すべてのチェックを実行（テスト → 形式チェック → lint → build）

```bash
npm run all
```

3. 契約テストの実行例（初期は jest-openapi を利用する想定）

```bash
npm test -- tests/contract/example.contract.test.ts
```

4. 開発サーバの起動（例: Next.js の場合）

```bash
npm run dev
```

5. 例示: API の叩き方

```bash
curl http://localhost:3000/api/pets
```

ドキュメント:
- 仕様: `specs/001-api-tdd-scaffold/spec.md`
- 研究メモ: `specs/001-api-tdd-scaffold/research.md`
- データモデル: `specs/001-api-tdd-scaffold/data-model.md`
- 契約ファイル（ローカルコピー）: `specs/001-api-tdd-scaffold/contracts/petstore-openapi.yaml`
