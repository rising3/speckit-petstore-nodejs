<!--
Sync Impact Report
- Version change: none -> 1.0.0
- Modified principles: (added) API-First → Test-First → Code Quality & Observability → Performance & Scalability → Simplicity & Versioning
- Added sections: Additional Constraints; Development Workflow
- Removed sections: none
- Templates requiring updates: ✅ .specify/templates/plan-template.md
												 ✅ .specify/templates/spec-template.md
												 ✅ .specify/templates/tasks-template.md
- Follow-up TODOs: RATIFICATION_DATE is unknown and marked TODO(RATIFICATION_DATE)
-->

# Speckit Petstore (Node.js) 憲法

## コア原則

### 1. API-First と契約駆動開発（非交渉）
外部に公開される振る舞いは、実装前に必ず OpenAPI 契約で定義されなければなりません。
API の変更は必ず更新された OpenAPI ドキュメントと、それに対応する契約テストを含めること。
クライアントや統合は CI 上で実行される OpenAPI ベースの自動契約テストによって検証されます。

理由: 本リポジトリは多言語への移植用リファレンスを目的としているため、明確な契約が移植時の曖昧さを排し
後方互換性を確保します。

### 2. テストファースト（TDD）（非交渉）
実装前にテストを作成することを必須とします。変更ごとに最低限含めるべきテストは以下です。
- ビジネスロジックのユニットテスト
- 永続化やトランザクションを含む統合テスト（テスト用 DB / コンテナを利用）
- API 表面に対する契約テスト（OpenAPI ベース）

Red-Green-Refactor のサイクルを順守してください: 失敗するテストを書く → 実装 → テストを通す → リファクタ。

理由: 振る舞いの正当性を担保し、フレームワークや言語の移植時にリグレッションを防ぎ、複数貢献者と自動化ツール
による保守性を確保します。

### 3. コード品質と可観測性
すべてのコード変更はリポジトリに設定されたリンターとフォーマッターを通過しなければなりません。可能な場合は
TypeScript 等で型チェックを行います。ロギングは構造化（JSON）で行い、機密情報のログ出力を避け、リクエスト相関
ID（例: `X-Request-Id`）を含めてください。アプリケーションはメトリクス（例: `/metrics`）を公開し、監査用フィールド
（created_by/updated_by/version）を適切に出力すること。

理由: 可観測性と一貫したコードスタイルはデバッグ時間を短縮し、運用時の対応品質を高めます。

### 4. パフォーマンスとスケーラビリティ（測定可能）
パフォーマンス目標は各プランで定義すること。実装時に検証するデフォルト目標例:
- API の P95 レイテンシ <= 300ms（ベースライン負荷時、プランで調整可能）
- スループット目標はプランに記載（例: リスト系エンドポイントで 500 req/s）

パフォーマンス作業にはベンチマークと、可能であれば CI に組み込まれた自動的な回帰テストを含めてください。

理由: Petstore はリファレンス実装として使われる想定があるため、明確かつ測定可能な目標により各実装を比較可能にします。

### 5. 単純性、セマンティックバージョニング、互換性
単純で監査可能な設計を優先します。YAGNI の原則を適用し、根拠のないインフラや機能追加は行わないこと。
公開 API の変更やガバナンス方針にはセマンティックバージョニングを適用します:
- API 変更: MAJOR.MINOR.PATCH（OpenAPI 互換性解析を活用）

- 憲法の変更: 原則の互換性を破る再定義は MAJOR、原則の追加や実質的ガイダンスの追加は MINOR、
  文言の明確化や誤字修正は PATCH とする。

理由: 予測可能なバージョニングは移植や依存関係のアップグレード判断を容易にします。

## 追加制約と標準

- 技術基盤: Node.js 24.x、TypeScript、Next.js（app server / API routes）、Prisma ORM（永続化）
  （ローカル開発は SQLite、本番は PostgreSQL 想定）。これは `docs/` にある移植ガイダンスと整合します。
- セキュリティ: 認証は JWT Bearer を想定。シークレットは Vault/KMS 等に保管し、パスワードハッシュは
  bcrypt/argon2 を使用すること。TLS を強制し、レート制限やブルートフォース対策を実装してください。
- データ整合性: 注文など複数ステップの操作は DB トランザクションで実行し、楽観ロック（`version`）を採用、
  競合時は `409 Conflict` を返却すること。
- テスト: ユニットおよび統合テストは Jest + Supertest（または言語固有の同等ツール）を推奨。
  OpenAPI（`docs/petstore-openai.yaml`）に基づく契約テストは API 表面に対して必須です。
- CI ゲート: `npm run all`（tests → fmt → lint → build）をマージ前に通すこと。

## 開発ワークフロー、レビュー手順、品質ゲート

- ブランチ運用: `feature/<short-name>` などの分かりやすい命名規則を採用してください。
- Pull Request: すべての PR はプラン/仕様へのリンク、OpenAPI の更新（該当する場合）、および CI の通過結果を含めること。
  API インターフェースを変更する PR は契約テストの差分と互換性に関する説明を添付してください。
- レビュー: マージには最低 1 名のコードレビュワーと 1 名のメンテナ（またはコードオーナー）による承認を要します。
- 必須 CI チェック:
  - Lint とフォーマット
  - 型チェック
  - ユニットテスト
  - 統合テスト（永続化/トランザクションに影響する変更時）
  - 契約テスト（OpenAPI）
  - 任意: セキュリティスキャン / SCA
- リリース: すべての公開 API 変更は changelog に記載し、セマンティックバージョニングに従うこと。

## ガバナンス

本憲法の改定は以下の手順で行います。

1. 提案者が Issue を作成し、変更案、理由、移行影響を記載する。
2. `.specify/memory/constitution.md` への変更を含む PR を作成し、以下を含めること:
   - 提案するバージョンの種類（MAJOR/MINOR/PATCH）とその根拠
   - 必要なリポジトリ/テンプレート変更の実施計画
3. PR は少なくとも 2 名の承認を得ること（そのうち 1 名はメンテナであること）。
4. マージ後、`Last Amended` 日付をマージ日で更新し、新バージョンを有効化する。

コンプライアンスとレビューの期待値:
- 実質的な変更を含む PR は、該当する原則（TDD、OpenAPI 契約更新、CI チェック、可観測性、パフォーマンス等）を参照する
  `Constitution Compliance` チェックリストを含めること。
- コアチームは四半期ごとに憲法準拠のレビューを行い、その結果を公開する。

**バージョン**: 1.0.0 | **承認日**: TODO(RATIFICATION_DATE) | **最終改定日**: 2025-12-06
