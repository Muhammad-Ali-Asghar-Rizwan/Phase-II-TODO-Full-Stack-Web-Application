<!-- SYNC IMPACT REPORT:
Version change: 1.0.0 → 1.0.0 (initial constitution for Phase III)
Modified principles: None (new constitution)
Added sections: All sections (new constitution for Phase III)
Removed sections: None
Templates requiring updates: ⚠ pending - specs/constitution.md
Follow-up TODOs: None
-->

# Todo AI Chatbot Constitution

## Core Principles

### I. Stateless Server Behavior
AI chatbot backend must maintain no in-memory state between requests; All conversation state must be persisted to and retrieved from database; Request handlers must be idempotent and independent of server-side session data.

### II. MCP-Only Task Management
All task creation, modification, and management must occur through MCP tools exclusively; Manual task creation, modification, or deletion via direct coding is prohibited; Agentic development stack enforces zero manual coding for task execution.

### III. AI-Agent Database Isolation
OpenAI Agents must not access database directly; All database operations must be performed through MCP tools and registered handlers; Conversation state, user data, and task information must be managed through controlled interfaces.

### IV. Persistent Conversation State
Conversation context must be stored in Neon PostgreSQL database upon request completion; Previous conversation state must be restored from database at beginning of each interaction; State restoration ensures continuity across server restarts and scaling events.

### V. Safe Tool Usage
All MCP tools must implement proper error handling and validation; Tools must be deterministic and side-effect-free where possible; Tool parameters must be validated before execution to prevent injection or harmful operations.

### VI. Friendly Confirmation & Error Handling
All actions must provide clear, user-friendly confirmations before executing changes; Graceful error messages must be provided when operations fail; Recovery options must be offered when possible to maintain conversation flow.

## Additional Constraints

### Technology Stack Requirements
- Backend: FastAPI (Python) with proper async support for AI workloads
- AI Framework: OpenAI Agents SDK for conversation management
- MCP Server: Official MCP SDK for tool orchestration
- Database: Neon PostgreSQL with SQLModel ORM for type safety
- Frontend: OpenAI ChatKit for consistent chat experience
- Authentication: Better Auth for secure user management

### Security Requirements
- AI agents must not expose sensitive data or system internals
- All database queries must use parameterized statements
- Authentication must be validated for all protected operations
- Conversation privacy must be maintained between users

## Development Workflow

### Agentic Development Enforcement
- All code changes must be performed through MCP tools and agents
- Manual coding is strictly prohibited - agentic stack must handle all implementations
- Task creation and execution must follow Spec-Driven Development flow
- Human intervention limited to specification, planning, and approval phases

### MCP Tool Requirements
- All functionality must be exposed through MCP-compliant tools
- Tools must follow standardized input/output contracts
- Tool registration must include proper error handling and documentation
- Tools must be testable in isolation and integration

## Governance

All development activities must comply with this constitution. Amendments require formal approval process with migration planning. All MCP tool implementations must be reviewed for constitution compliance before merging. Code reviews must verify adherence to stateless behavior, database isolation, and agentic development principles.

**Version**: 1.0.0 | **Ratified**: 2026-02-07 | **Last Amended**: 2026-02-07