# Quickstart Guide: Todo AI Chatbot

## Overview
This guide provides instructions for setting up and running the Todo AI Chatbot feature. The implementation follows an MCP-first architecture where the AI agent interacts with existing task logic through standardized MCP tools.

## Prerequisites
- Python 3.11+
- Node.js 18+ (for frontend)
- PostgreSQL-compatible database (Neon recommended)
- Better Auth configured
- OpenAI API key
- MCP SDK

## Backend Setup

### 1. Environment Configuration
```bash
# Copy the example environment file
cp .env.example .env

# Update the following variables in .env:
OPENAI_API_KEY=your_openai_api_key
DATABASE_URL=postgresql://username:password@host:port/database
BETTER_AUTH_SECRET=your_auth_secret
MCP_SERVER_PORT=8001
```

### 2. Install Dependencies
```bash
cd backend
pip install -r requirements.txt
```

### 3. Run Migrations
```bash
# Apply database migrations to add conversation/message tables
python -m src.database.migrate
```

### 4. Start MCP Server
```bash
# Start the MCP server that wraps existing task operations
python -m src.services.mcp_server
```

### 5. Start Main Application
```bash
# Start the main FastAPI application
uvicorn src.main:app --reload
```

## Frontend Setup

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Configure Environment
```bash
# Copy the example environment file
cp .env.example .env

# Update the following variables in .env:
VITE_CHAT_API_URL=http://localhost:8000/api/chat
VITE_BETTER_AUTH_URL=http://localhost:8000/api/auth
```

### 3. Start Frontend
```bash
npm run dev
```

## MCP Tools Configuration

The following MCP tools are available for the AI agent:

### Task Operations
- `create_task(title, description, due_date, priority)`: Creates a new task
- `get_tasks(status=None)`: Retrieves tasks with optional status filter
- `update_task(task_id, title=None, description=None, status=None, due_date=None, priority=None)`: Updates task properties
- `delete_task(task_id)`: Deletes a task (with confirmation)
- `complete_task(task_id)`: Marks a task as completed

### Conversation Operations
- `start_conversation(title)`: Begins a new conversation
- `get_conversation_history(conversation_id)`: Retrieves message history
- `store_message(conversation_id, role, content)`: Stores a message in conversation

## AI Agent Configuration

The AI agent is configured with the following system prompt:

```
You are a helpful assistant that manages todo tasks. You can create, read, update, and delete tasks using the provided tools. 
Always confirm destructive actions like deleting tasks before proceeding.
If a user asks about tasks without being specific, offer to show their current tasks.
```

## Authentication Integration

The chatbot respects the existing Better Auth authentication. All operations are tied to the authenticated user's tasks only.

## Testing the Setup

1. Visit the frontend application
2. Log in with your existing credentials
3. Navigate to the chat interface
4. Try commands like:
   - "Add a task to buy groceries"
   - "Show me my tasks"
   - "Mark the first task as completed"
   - "Delete the task to buy groceries"

## Troubleshooting

### Common Issues
- **MCP Server not connecting**: Ensure the MCP server is running on the configured port
- **Authentication errors**: Verify Better Auth is properly configured and accessible
- **Database connection issues**: Check DATABASE_URL in your environment variables
- **OpenAI API errors**: Verify your OPENAI_API_KEY is valid and has sufficient quota

### Logs
- Backend logs: Check the terminal where uvicorn is running
- MCP server logs: Check the terminal where mcp_server is running
- Frontend logs: Check browser console