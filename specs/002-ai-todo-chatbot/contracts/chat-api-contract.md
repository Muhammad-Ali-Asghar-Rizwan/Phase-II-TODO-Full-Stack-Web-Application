# Chat API Contract

## Overview
This document defines the API contract for the stateless chat endpoint that connects the frontend to the AI agent and MCP tools.

## Base URL
`/api/chat`

## Authentication
All endpoints require authentication via Better Auth session cookies or Bearer token.

## Endpoints

### POST /api/chat/conversation
Initiates a new conversation or continues an existing one.

#### Request
```json
{
  "message": "User's message to the AI",
  "conversation_id": "Optional UUID of existing conversation",
  "metadata": {
    "user_timezone": "IANA timezone identifier",
    "client_info": "Additional client information"
  }
}
```

#### Response
```json
{
  "conversation_id": "UUID of the conversation",
  "response": "AI's response to the user",
  "actions_taken": [
    {
      "action": "create_task|update_task|delete_task|get_tasks",
      "status": "success|failed|pending_confirmation",
      "details": "Additional information about the action taken"
    }
  ],
  "requires_confirmation": false,
  "timestamp": "ISO 8601 timestamp"
}
```

#### Error Responses
- `400 Bad Request`: Invalid request format
- `401 Unauthorized`: Missing or invalid authentication
- `429 Too Many Requests`: Rate limiting applied
- `500 Internal Server Error`: Unexpected server error

### GET /api/chat/conversations
Retrieves a list of user's conversations.

#### Request
```
GET /api/chat/conversations?page=1&limit=20&active_only=false
```

#### Response
```json
{
  "conversations": [
    {
      "id": "UUID",
      "title": "Conversation title",
      "created_at": "ISO 8601 timestamp",
      "updated_at": "ISO 8601 timestamp",
      "is_active": true
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 15,
    "has_more": false
  }
}
```

### GET /api/chat/conversations/{conversation_id}/messages
Retrieves messages for a specific conversation.

#### Request
```
GET /api/chat/conversations/{conversation_id}/messages?limit=50
```

#### Response
```json
{
  "messages": [
    {
      "id": "UUID",
      "role": "user|assistant|system",
      "content": "Message content",
      "timestamp": "ISO 8601 timestamp",
      "metadata": {}
    }
  ]
}
```

## Rate Limiting
- Per-user: 100 requests per minute
- Per-IP: 1000 requests per minute

## Security Considerations
- All requests must be authenticated
- Input sanitization applied to prevent injection attacks
- Sensitive information filtered from responses
- Conversation isolation enforced (users can only access their own conversations)