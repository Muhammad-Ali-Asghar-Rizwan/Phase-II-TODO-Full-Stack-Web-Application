# Implementation Plan: Todo AI Chatbot

**Branch**: `002-ai-todo-chatbot` | **Date**: 2026-02-07 | **Spec**: [Todo AI Chatbot Spec](spec.md)
**Input**: Feature specification from `/specs/002-ai-todo-chatbot/spec.md`

**Note**: This template is filled in by the `/sp.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

The Todo AI Chatbot extends the existing Todo application by adding an AI-powered conversational interface. The implementation follows an MCP-first architecture where the AI agent interacts with existing task logic through standardized MCP tools. The solution includes a stateless chat API, conversation persistence in the database, and integration with the existing frontend using OpenAI ChatKit.

## Technical Context

**Language/Version**: Python 3.11, JavaScript/TypeScript
**Primary Dependencies**: FastAPI, OpenAI Agents SDK, MCP SDK, SQLModel, Neon PostgreSQL, Better Auth, OpenAI ChatKit
**Storage**: Neon PostgreSQL (reusing existing Task table with extensions for conversations)
**Testing**: pytest for backend, Jest for frontend components
**Target Platform**: Web application (browser-based)
**Project Type**: Web (extending existing backend/frontend)
**Performance Goals**: <500ms response time for AI interactions, support 1000 concurrent users
**Constraints**: Must reuse existing task CRUD logic, maintain statelessness, follow MCP-first architecture
**Scale/Scope**: Extend existing Todo app for 10k+ users with AI chatbot functionality

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- ✅ Extension Over Rewrite: Plan explicitly extends existing system without rewriting
- ✅ MCP-First Architecture: AI interactions will occur exclusively through MCP tools
- ✅ Agentic Development Stack: Implementation will leverage AI-assisted development
- ✅ Statelessness Requirement: Backend services will remain stateless
- ✅ Database-Centric State Management: Conversation state will be persisted in database
- ✅ Graceful Error Handling: Comprehensive error handling will be implemented

## Project Structure

### Documentation (this feature)

```text
specs/002-ai-todo-chatbot/
├── plan.md              # This file (/sp.plan command output)
├── research.md          # Phase 0 output (/sp.plan command)
├── data-model.md        # Phase 1 output (/sp.plan command)
├── quickstart.md        # Phase 1 output (/sp.plan command)
├── contracts/           # Phase 1 output (/sp.plan command)
└── tasks.md             # Phase 2 output (/sp.tasks command - NOT created by /sp.plan)
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── models/
│   │   ├── task.py          # Existing task model (reused)
│   │   ├── conversation.py  # New: conversation state model
│   │   └── message.py       # New: message model
│   ├── services/
│   │   ├── task_service.py  # Existing task service (reused/wrapped)
│   │   └── mcp_server.py    # New: MCP server implementation
│   ├── tools/
│   │   ├── task_tools.py    # New: MCP tools wrapping task operations
│   │   └── conversation_tools.py # New: MCP tools for conversation management
│   ├── agents/
│   │   └── todo_agent.py    # New: AI agent implementation
│   ├── api/
│   │   └── chat_api.py      # New: Stateless chat API endpoint
│   └── main.py
└── tests/

frontend/
├── src/
│   ├── components/
│   │   └── ChatInterface.jsx  # New: ChatKit integration
│   ├── pages/
│   │   └── TodoPage.jsx       # Existing page with chat integration
│   └── services/
│       └── chatService.js     # New: Service for chat API communication
└── tests/
```

**Structure Decision**: Web application structure selected to extend existing backend/frontend. New components will be added to both backend (MCP server, AI agent, chat API) and frontend (ChatKit integration) while reusing existing task models and services.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [None] | [N/A] | [N/A] |

## Phase 0: Research & Unknown Resolution

### Research Tasks

1. **Review existing Todo backend and database models**
   - Understand current task model and CRUD operations
   - Identify authentication mechanism with Better Auth
   - Map out existing API endpoints

2. **Investigate MCP SDK integration patterns**
   - Best practices for wrapping existing logic in MCP tools
   - State management approaches for conversations
   - Error handling patterns in MCP implementations

3. **Explore OpenAI Agents SDK capabilities**
   - Understand how to define custom tools for task operations
   - Study conversation state management options
   - Review confirmation and error handling mechanisms

### Expected Outcomes
- Complete understanding of existing task models and services
- Clear mapping of how to wrap existing CRUD in MCP tools
- Identification of necessary database extensions for conversation state

## Phase 1: Design & Contracts

### Data Model Design
- Extend database with Conversation and Message entities
- Define relationships between tasks, conversations, and messages
- Plan for authentication integration with existing system

### API Contract Design
- Design stateless chat API endpoint
- Define request/response schemas for chat interactions
- Plan authentication flow for chat endpoints

### Quickstart Guide
- Setup instructions for MCP server
- Configuration for AI agent
- Integration steps for ChatKit frontend

## Phase 2: Implementation Plan (Future)

The implementation will follow these sequential phases:

### Phase 1: Backend Infrastructure
1. Implement MCP server to wrap existing task logic
2. Create MCP tools for task operations (CRUD)
3. Design conversation state persistence
4. Build AI agent with task management capabilities

### Phase 2: API Layer
1. Create stateless chat API endpoint
2. Implement authentication alignment with Better Auth
3. Connect API to AI agent and MCP tools

### Phase 3: Frontend Integration
1. Integrate OpenAI ChatKit with existing frontend
2. Connect to chat API endpoint
3. Ensure seamless UX with existing task UI

### Phase 4: Testing & Deployment
1. Implement comprehensive tests for AI interactions
2. Verify MCP-first architecture compliance
3. Prepare deployment configurations
