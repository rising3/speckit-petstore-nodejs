# Petstore アプリケーション 仕様書（移植向け）

目的: Java EE 実装（agoncal/agoncal-application-petstore-ee7）を、生成AI/開発者が Java 以外の言語（例: JavaScript/TypeScript, Python, Go, C# など）へ移植するために必要な情報を一式記述する。

---

## 1. 概要と範囲

- 対象: ペット管理（Pet）、ユーザー（User）、注文（Order）、カテゴリ（Category）などの CRUD とそれらに関連する業務ロジック。
- 優先事項: API 契約（エンドポイント / リクエスト / レスポンス）、データモデル、永続化スキーマ、ビジネスルール、認証/認可、イベント定義、エラー仕様。
- 非対象（明示）: UI の細かなワイヤーフレーム。UI は移植時に各フレームワーク固有で実装。

---

## 2. 高レベルアーキテクチャ

- クライアント <-> REST API（JSON）: 主な通信方式は HTTPS/JSON の同期 REST。
- 永続化: RDBMS（推奨: PostgreSQL / MySQL）。ORM を用いたエンティティマッピング。
- 認証: JWT ベースのアクセストークン（Bearer token）。
- 非同期イベント: メッセージブローカー（例: Kafka / RabbitMQ / AWS SNS）へ OrderCreated 等のイベントを発行。
- トランザクション: 注文作成などは DB トランザクションで整合性を保証。分散トランザクションは避け、補償パターンを検討。

---

## 3. ドメインモデル（概念説明）

- Pet
  - 概要: 販売/表示対象のペット。
  - 属性（主要）: id, name, category, photoUrls[], tags[], status
  - status: enum { AVAILABLE, PENDING, SOLD }
- Category
  - id, name
- Tag
  - id, name
- Order
  - id, petId, quantity, shipDate (ISO8601), status, complete (boolean)
  - status: enum { PLACED, APPROVED, DELIVERED, CANCELLED }
- User
  - id, username, firstName, lastName, email, passwordHash, phone, userStatus
  - userStatus: enum { ACTIVE, INACTIVE, BANNED }
- Address (optional, Customer 用に拡張する場合)
  - id, userId, line1, line2, city, postalCode, country
- Audit 共通フィールド（全テーブル推奨）
  - created_at, updated_at, created_by, updated_by, version（楽観ロック）

関係:

- Pet 1:N Tag (多対多なら中間テーブル)
- Pet N:1 Category
- Order N:1 Pet
- User 1:N Order (注文したユーザー)

---

## 4. API エンドポイント一覧（主要）

すべて JSON 入力/出力。認証なしで公開できるもの、認証必須のものを示す。

注意: path, method, 説明, 認可 を記載。各エンドポイントで共通するエラーレスポンスは仕様書後半を参照。

- Pets
  - GET /api/pets
    - 概要: ペット一覧（ページネーション、フィルタ）
    - 認可: public
    - クエリ:
      - page (int, default 1)
      - size (int, default 20, max 100)
      - status (enum)
      - name (partial match)
    - レスポンス: { items: Pet[], total: int, page: int, size: int }
  - GET /api/pets/{petId}
    - 認可: public
    - レスポンス: Pet
  - POST /api/pets
    - 認可: ADMIN
    - リクエスト: PetCreate
    - レスポンス: Pet (201)
  - PUT /api/pets/{petId}
    - 認可: ADMIN
    - リクエスト: PetUpdate
  - DELETE /api/pets/{petId}
    - 認可: ADMIN
- Orders
  - POST /api/orders
    - 概要: 注文作成
    - 認可: authenticated (USER/ADMIN)
    - トランザクション: DB トランザクション必須
    - リクエスト: OrderCreate
    - レスポンス: Order (201)
    - 副作用: OrderCreated イベント発行
  - GET /api/orders/{orderId}
    - 認可: authenticated (order 所有者 or ADMIN)
  - GET /api/orders
    - 認可: ADMIN (全件), USER (自身の注文)
    - クエリ: page,size,status
  - PUT /api/orders/{orderId}/status
    - 認可: ADMIN
    - リクエスト: { status: string }
- Users / Authentication
  - POST /api/auth/register
    - 概要: ユーザー登録
    - リクエスト: UserRegister
    - 処理: email 重複チェック、パスワードハッシュ化
    - レスポンス: User (without password)
  - POST /api/auth/login
    - リクエスト: { username, password }
    - レスポンス: { accessToken, tokenType: "Bearer", expiresInSeconds, refreshToken? }
  - GET /api/users/{userId}
    - 認可: authenticated (自身 or ADMIN)
  - PUT /api/users/{userId}
    - 認可: authenticated (自身 or ADMIN)
  - DELETE /api/users/{userId}
    - 認可: ADMIN

---

## 5. リクエスト/レスポンス JSON スキーマ（主要）

以下は移植用にそのまま使える JSON スキーマ（OpenAPI コンポーネント風）例。

- Pet

```json
{
  "Pet": {
    "type": "object",
    "required": ["id", "name", "status"],
    "properties": {
      "id": { "type": "integer", "format": "int64" },
      "name": { "type": "string" },
      "category": { "$ref": "#/components/schemas/Category" },
      "photoUrls": { "type": "array", "items": { "type": "string", "format": "uri" } },
      "tags": { "type": "array", "items": { "$ref": "#/components/schemas/Tag" } },
      "status": { "type": "string", "enum": ["AVAILABLE", "PENDING", "SOLD"] },
      "created_at": { "type": "string", "format": "date-time" },
      "updated_at": { "type": "string", "format": "date-time" }
    }
  }
}
```

- Order

```json
{
  "Order": {
    "type": "object",
    "required": ["id", "petId", "quantity", "status"],
    "properties": {
      "id": { "type": "integer", "format": "int64" },
      "petId": { "type": "integer", "format": "int64" },
      "quantity": { "type": "integer", "minimum": 1 },
      "shipDate": { "type": "string", "format": "date-time" },
      "status": { "type": "string", "enum": ["PLACED", "APPROVED", "DELIVERED", "CANCELLED"] },
      "complete": { "type": "boolean" }
    }
  }
}
```

- UserRegister

```json
{
  "UserRegister": {
    "type": "object",
    "required": ["username", "password", "email"],
    "properties": {
      "username": { "type": "string", "minLength": 3, "maxLength": 50 },
      "password": { "type": "string", "minLength": 8 },
      "email": { "type": "string", "format": "email" },
      "firstName": { "type": "string" },
      "lastName": { "type": "string" },
      "phone": { "type": "string" }
    }
  }
}
```

（注: 仕様書では全スキーマを詳細に列挙することを推奨。ここでは主要スキーマのみ記載。）

---

## 6. データベース設計（RDBMS 推奨：PostgreSQL）

DDL（抜粋）

- pets

```sql
CREATE TABLE pets (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  category_id BIGINT,
  status VARCHAR(20) NOT NULL CHECK (status IN ('AVAILABLE','PENDING','SOLD')),
  photo_urls JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  version INT DEFAULT 0
);
CREATE INDEX idx_pets_status ON pets(status);
```

- categories

```sql
CREATE TABLE categories (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE
);
```

- tags

```sql
CREATE TABLE tags (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE
);
```

- pet_tags (many-to-many)

```sql
CREATE TABLE pet_tags (
  pet_id BIGINT REFERENCES pets(id) ON DELETE CASCADE,
  tag_id BIGINT REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (pet_id, tag_id)
);
```

- orders

```sql
CREATE TABLE orders (
  id BIGSERIAL PRIMARY KEY,
  pet_id BIGINT REFERENCES pets(id),
  user_id BIGINT REFERENCES users(id),
  quantity INT NOT NULL CHECK (quantity > 0),
  ship_date TIMESTAMP WITH TIME ZONE,
  status VARCHAR(20) NOT NULL CHECK (status IN ('PLACED','APPROVED','DELIVERED','CANCELLED')),
  complete BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
CREATE INDEX idx_orders_status ON orders(status);
```

- users

```sql
CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  user_status VARCHAR(20) DEFAULT 'ACTIVE' CHECK (user_status IN ('ACTIVE','INACTIVE','BANNED')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

注意点:

- パスワードは必ずハッシュ保存（bcrypt/argon2 等）。
- photo_urls は JSONB（配列の URL）で簡易に扱えるようにしている。
- 楽観ロック用に version (INT) を利用することを推奨。

---

## 7. バリデーションとビジネスルール

- Pet
  - name は空でないこと。
  - status は定義済み enum のみ。
  - photoUrls は有効な URL の配列（最大数制限：50 など）
- Order
  - quantity は 1 以上。
  - 注文時に pet.status が AVAILABLE でなければ注文不可（ビジネスルール。必要なら PENDING を許容）。
  - 注文作成はトランザクションで実行。注文作成後に OrderCreated イベントを発行。
- User
  - username/email はユニーク。
  - パスワードは強度チェック（最低長、英数字混在など）。
- 状態遷移
  - Order: PLACED -> APPROVED -> DELIVERED (CANCELLED へは一定条件で可)
  - Pet.status の変更は ADMIN のみが行える（在庫管理ポリシーによる）
- 副作用・整合性
  - 削除操作は論理削除（deleted_at タイムスタンプ）を推奨。物理削除は監査要件を満たす場合に限る。

---

## 8. 認証・認可（推奨）

- 認証方式
  - OAuth2 の Password Grant もしくはシンプルに JWT 発行（POST /api/auth/login）で Access Token を返却。
  - Access Token は Authorization: Bearer <token> で送る。
  - Token は短期間（例 15 分）で失効、Refresh Token を別途発行（セキュアストレージに保管）。
- 認可
  - Role ベース: ADMIN, USER
  - エンドポイントごとに Role をチェック（例: POST /api/pets は ADMIN のみ）
  - 所有権チェック（USER は自分の注文のみ閲覧可能）
- セキュリティ対策
  - パスワードハッシュ化（bcrypt/argon2）
  - TLS 終端（HTTPS）
  - レート制限（IP とユーザー単位）
  - ブルートフォース対策（ログイン試行制限）
  - 入出力のバリデーション（SQL インジェクション・XSS 対策はサーバ側で厳格に）

---

## 9. エラー仕様（共通フォーマット）

- HTTP ステータスとボディ（JSON）例:

共通エラーボディ:

```json
{
  "error": {
    "code": "USER_NOT_FOUND",
    "message": "User not found",
    "details": "User with id 123 does not exist",
    "timestamp": "2025-01-01T12:00:00Z"
  }
}
```

主要ステータス:

- 400 Bad Request: 入力バリデーションエラー（コード: VALIDATION_ERROR）
  - details にフィールド別エラー配列を含める
- 401 Unauthorized: 認証失敗（INVALID_CREDENTIALS / TOKEN_EXPIRED）
- 403 Forbidden: 権限不足（FORBIDDEN）
- 404 Not Found: リソース未検出（NOT_FOUND）
- 409 Conflict: 競合（例: ユニーク制約違反 → DUPLICATE_RESOURCE）
- 500 Internal Server Error: サーバ内部エラー（INTERNAL_ERROR）

---

## 10. 非同期イベント（メッセージ定義）

メッセージは JSON。バージョン管理のために "specVersion" と "eventId" を含める。

- topic: order.created

```json
{
  "specVersion": "1.0",
  "eventId": "uuid-v4",
  "eventType": "order.created",
  "timestamp": "2025-01-01T12:00:00Z",
  "data": {
    "orderId": 123,
    "petId": 456,
    "userId": 789,
    "quantity": 1,
    "status": "PLACED",
    "shipDate": "2025-01-05T10:00:00Z"
  }
}
```

- topic: pet.updated

```json
{
  "specVersion": "1.0",
  "eventId": "uuid-v4",
  "eventType": "pet.updated",
  "timestamp": "2025-01-02T09:00:00Z",
  "data": {
    "petId": 456,
    "status": "SOLD"
  }
}
```

イベント設計の要点:

- 冪等性: consumer は eventId で冪等に処理できるようにする。
- スキーマ: JSON Schema で管理、互換性を保つ（バージョニング）。
- 配信保証: at-least-once を想定、consumer 側で重複処理に耐えること。

---

## 11. トランザクションと同時実行（整合性）

- 注文作成など整合性が必要な操作は単一 DB トランザクションで行う。
- 高競合箇所（在庫や状態更新）は楽観ロック（version カラム）を採用。更新時に version チェック、失敗時はクライアントに 409 を返す。
- 分散処理: マイクロサービス間で整合性が必要な場合は Saga パターン（補償トランザクション）を採用。

---

## 12. API 例（サンプル）

- ペット作成（Admin）
  curl:

```bash
curl -X POST "https://api.example.com/api/pets" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name":"ふわふわ犬",
    "category": {"id":2,"name":"犬"},
    "photoUrls":["https://cdn.example.com/1.jpg"],
    "tags":[{"id":5,"name":"small"}],
    "status":"AVAILABLE"
  }'
```

- 注文作成

```bash
curl -X POST "https://api.example.com/api/orders" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "petId": 123,
    "quantity": 1,
    "shipDate": "2025-12-10T10:00:00Z"
  }'
```

---

## 13. ロギング・監視・テスト

- ロギング: 機密情報（パスワード, トークン）を絶対にログに出さない。リクエストID（X-Request-Id）を付与して相関ログを可能に。
- メトリクス: /metrics エンドポイント（Prometheus 用）や APDEX, レイテンシ分布を計測。
- テスト:
  - ユニットテスト: ビジネスロジックとバリデータ
  - 統合テスト: DB を使ったテスト（テスト用 DB/コンテナ）
  - API 契約テスト: OpenAPI を用いた契約テスト
  - E2E: 注文フロー、注文->イベント->消費側の連携

---

## 14. 移植時の言語/フレームワークマッピング指針

以下は Java EE の一般的コンポーネントと、移植先での推奨対応例。

- JAX-RS (REST) → Node.js: Express / Fastify、TypeScript: NestJS、Python: FastAPI / Flask、Go: Gin / Echo、C#: ASP.NET Core
- JPA (Entity) → ORM:
  - Node.js: TypeORM / Sequelize / Prisma
  - Python: SQLAlchemy / Django ORM / Tortoise ORM
  - Go: GORM / ent
  - C#: Entity Framework Core
- EJB/Transactional → DB トランザクション API / ORMs のトランザクション機能
  - 例: SQLAlchemy session.begin(), Prisma transaction(), EF Core TransactionScope
- CDI（依存性注入）→ DI ライブラリ
  - Node: InversifyJS / NestJS の DI、Python: dependency-injector、Go: 明示的コンストラクタ注入（DI ライブラリは稀）
- Bean Validation (javax.validation) → JSON Schema + バリデーションライブラリ
  - Node: ajv / class-validator
  - Python: pydantic / marshmallow
- Security (JAAS) → JWT ミドルウェア / OAuth ライブラリ
- メッセージング（JMS）→ Kafka client / RabbitMQ client（言語別クライアントを利用）

移植ポイント:

- DTO と エンティティを明確に分離する（API スキーマと DB スキーマを分離し、変換処理を組み込む）。
- トランザクション境界をはっきりさせる（サービス層で開始/コミット/ロールバック）。
- 並行更新対策: 楽観ロック実装（version）を必ず移植する。
- 例外ハンドリング: 言語固有の例外を API エラー形式にマッピングする共通ハンドラを実装。
- ミドルウェア: 認証（JWT）、バリデーション、ロギング、エラー処理を共通ミドルウェアとして実装する。

---

## 15. デプロイ・運用に関する推奨

- コンテナ化（Docker）を推奨。Kubernetes 上でのデプロイを想定。
- 環境ごとの設定は環境変数（12-factor 準拠）。
- シークレットは Vault / KMS に保存。
- DB マイグレーション: Flyway / Liquibase / Prisma Migrate / Alembic 等を利用して管理。
- Blue/Green デプロイや Canary を活用して安全にリリース。

---

## 16. 開発・移植用チェックリスト（短縮）

- [ ] OpenAPI（または Swagger）で API を厳密に定義
- [ ] JSON Schema を全スキーマに対して用意
- [ ] DB スキーマ（DDL）を移植先 DB 向けに調整
- [ ] 認証/認可フローの実装（JWT）
- [ ] 楽観ロック（version）実装
- [ ] イベント仕様（JSON Schema）をブローカー向けに整備
- [ ] エラーハンドリング共通化
- [ ] テスト（単体・統合・契約）スイート整備
- [ ] CI/CD にマイグレーション・マイグレーション検証を含める

---

## 17. 付録

- OpenAPI仕様: petstore-openai.yaml
