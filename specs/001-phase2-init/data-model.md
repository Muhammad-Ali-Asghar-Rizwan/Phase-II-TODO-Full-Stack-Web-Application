# Data Model: Phase II

## Entities

### User
*Managed by Better Auth (Frontend) & Mirrored/Referenced in Backend*

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | String (UUID) | Yes | Primary Key |
| `email` | String | Yes | Unique, Indexed |
| `name` | String | No | User display name |
| `created_at` | DateTime | Yes | |
| `updated_at` | DateTime | Yes | |

### Todo (Task)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | Integer | Yes | Primary Key, Auto-increment |
| `title` | String | Yes | Task summary |
| `description` | String | No | Detailed notes |
| `is_completed` | Boolean | Yes | Default: False |
| `owner_id` | String | Yes | Foreign Key -> User.id |
| `created_at` | DateTime | Yes | |
| `updated_at` | DateTime | Yes | |

## Validation Rules

1.  **User**: Email must be valid format.
2.  **Todo**: Title cannot be empty/whitespace only.
3.  **Todo**: `owner_id` must match the authenticated user's ID (Isolation).

## Relationships

- **User** 1 -- * **Todo** (One-to-Many)
- **Cascade**: Deleting a User deletes all their Todos.
