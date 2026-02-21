<!-- 
Sync Impact Report:
- Version change: N/A -> 1.0.0
- Modified principles: None (new constitution)
- Added sections: All principles and sections for Todo AI Chatbot project
- Removed sections: None
- Templates requiring updates: N/A
- Follow-up TODOs: None
-->

# Todo AI Chatbot Constitution

## Core Principles

### I. Extension Over Rewrite
Existing Todo application functionality must be preserved and extended, not rewritten. All new AI features must integrate seamlessly with the current system without disrupting existing workflows.

### II. MCP-First Architecture
AI agent interactions with tasks must occur exclusively through MCP (Model Context Protocol) tools. All task operations must be wrapped in standardized MCP interfaces to ensure consistent communication between AI and backend services.

### III. Agentic Development Stack
All implementation must leverage agentic development tools and AI-assisted coding. Manual coding should be minimized in favor of AI-assisted generation and refinement of code.

### IV. Statelessness Requirement
Backend services must remain stateless, with all conversation state persisted in the database. No session-based state should be maintained on the server side.

### V. Database-Centric State Management
Conversation state, AI context, and all related metadata must be persisted in the Neon PostgreSQL database using existing table structures where possible, with extensions only when necessary.

### VI. Graceful Error Handling
AI interactions must include comprehensive error handling with clear user-facing messages. All operations must provide appropriate fallbacks and confirmations before executing destructive actions.

## Technology Stack Requirements

- Backend: FastAPI (Python) with SQLModel ORM
- AI: OpenAI Agents SDK for chatbot functionality
- MCP: Official MCP SDK for tool integrations
- Database: Neon PostgreSQL (leveraging existing schema)
- Frontend: OpenAI ChatKit for user interface
- Authentication: Better Auth for secure access

## Development Workflow

- All features must begin with specification and task breakdown
- MCP tools must wrap existing CRUD operations for tasks
- AI agent capabilities must be tested through conversation flows
- Integration tests must validate AI-to-database communication paths
- Code reviews must verify compliance with MCP-first architecture

## Governance

This constitution governs all development activities for Phase III: Todo AI Chatbot. All implementations must comply with these principles. Amendments require documentation of impact on existing architecture and approval from project stakeholders.

**Version**: 1.0.0 | **Ratified**: 2026-02-07 | **Last Amended**: 2026-02-07
