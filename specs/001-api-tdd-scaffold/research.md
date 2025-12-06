# Research: Clarifications and Decisions (Phase 0)

Decision: 開発言語は TypeScript を採用する

Rationale:
- `spec.md` とプロジェクト方針（憲法）が TypeScript を想定しているため整合性が高い。
- 型チェックによりテスト/契約検証の信頼性が向上し、移植リポジトリとしての可搬性が高まる。
- CI やローカルでの再現性が高く、既存の Node.js / Next.js 開発フローに適合する。

Alternatives considered:
- JavaScript: シンプルだが型安全性がなく、テストの品質やリファクタ耐性が下がるため非推奨。
- 混在（JS+TS）: 柔軟だがビルド・テスト構成が複雑になる。現段階では追加の複雑さを避ける。

Decision: テストツールは Jest + Supertest + jest-openapi を採用

Rationale:
- Jest は Node.js のエコシステムで広く使われており、TypeScript との相性も良い（ts-jest 等）。
- Supertest は HTTP 層の統合テストに最適で、簡単にエンドポイントを叩ける。
- jest-openapi は OpenAPI に基づいたアサーションを提供し、契約テストを簡潔に書ける。

Alternatives considered:
- Pact や Dredd 等の契約テストツール: 強力だが初期導入コストがやや高く、まずはシンプルな jest-openapi ベースで開始する。

DevDependencies recommendation (initial):
- typescript, ts-node
- jest, ts-jest, @types/jest
- supertest, jest-openapi
- eslint, @typescript-eslint/parser, @typescript-eslint/eslint-plugin
- prettier, eslint-config-prettier
- zod (request validation)

Follow-up tasks produced by research:
- Add `package.json` with scripts and devDependencies (Phase 1)
- Add example failing contract test under `tests/contract/` (Phase 1)
- Add example minimal endpoint and implementation that makes the contract test pass (Phase 1)
