# Data Model (Phase 1)

This scaffold focuses on repository and contract examples rather than full domain implementation. Below are the primary domain entities extracted from `docs/petstore-spec.md` for reference and for any example implementations.

- Entity: Pet
  - Fields: `id: integer`, `name: string`, `category: Category | null`, `photoUrls: string[]`, `tags: Tag[]`, `status: enum {AVAILABLE,PENDING,SOLD}`, `created_at: datetime`, `updated_at: datetime`, `version: int`
  - Validation: `name` non-empty, `status` in enum, `photoUrls` are valid URIs, `tags` limited to reasonable count (e.g., <= 50)

- Entity: Category
  - Fields: `id: integer`, `name: string`

- Entity: Tag
  - Fields: `id: integer`, `name: string`

- Entity: Order
  - Fields: `id: integer`, `petId: integer`, `userId: integer`, `quantity: integer >= 1`, `shipDate: datetime`, `status: enum {PLACED,APPROVED,DELIVERED,CANCELLED}`, `complete: boolean`
  - Business rules: `pet.status` must be AVAILABLE for creation (or handled per business rule), creation occurs within DB transaction and emits `OrderCreated` event

- Entity: User
  - Fields: `id: integer`, `username: string`, `email: string`, `passwordHash: string`, `firstName?: string`, `lastName?: string`, `phone?: string`, `userStatus: enum {ACTIVE,INACTIVE,BANNED}`

Validation rules above should be enforced in request validators (Zod) and in unit tests. For the scaffold, include these as reference; full DB schema and migrations are out of scope for initial tasks but are documented in `docs/petstore-spec.md`.
