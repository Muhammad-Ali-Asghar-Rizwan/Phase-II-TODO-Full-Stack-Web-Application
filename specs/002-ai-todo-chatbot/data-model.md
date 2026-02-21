# Data Model: Todo AI Chatbot

## Overview
This document defines the data models needed for the Todo AI Chatbot feature. It extends the existing Todo application by adding conversation and message entities while reusing the existing Task model.

## Entity Definitions

### Task (Reused)
**Description**: Represents a user's to-do item with properties like description, status, due date, and priority.
**Fields**:
- id: UUID (primary key)
- title: String (required)
- description: String (optional)
- status: Enum (pending, in-progress, completed)
- due_date: DateTime (optional)
- priority: Enum (low, medium, high)
- created_at: DateTime
- updated_at: DateTime
- user_id: UUID (foreign key to user)

**Validation Rules**:
- Title must be between 1-255 characters
- Status must be one of the allowed enum values
- Due date must be in the future if provided

### Conversation
**Description**: Represents a sequence of interactions between user and AI chatbot, including context and state.
**Fields**:
- id: UUID (primary key)
- user_id: UUID (foreign key to user)
- title: String (auto-generated from first message or user-provided)
- created_at: DateTime
- updated_at: DateTime
- is_active: Boolean (indicates if conversation is ongoing)

**Validation Rules**:
- User_id must reference an existing user
- Title must be between 1-255 characters if provided

### Message
**Description**: Represents individual messages within a conversation, including both user inputs and AI responses.
**Fields**:
- id: UUID (primary key)
- conversation_id: UUID (foreign key to conversation)
- role: Enum (user, assistant, system)
- content: String (the actual message content)
- timestamp: DateTime
- metadata: JSON (additional data like intent classification, tool calls, etc.)

**Validation Rules**:
- Conversation_id must reference an existing conversation
- Role must be one of the allowed enum values
- Content must not be empty

## Relationships

### Task Relationships
- Task belongs to a User (many-to-one)

### Conversation Relationships
- Conversation belongs to a User (many-to-one)
- Conversation has many Messages (one-to-many)

### Message Relationships
- Message belongs to a Conversation (many-to-one)

## State Transitions

### Task State Transitions
- pending → in-progress → completed
- completed → pending (for recurring tasks or corrections)

### Conversation State Transitions
- active → inactive (when conversation is concluded)
- inactive → active (if resumed)

## Indexes
- Task.user_id (for efficient user-specific queries)
- Conversation.user_id (for efficient user-specific queries)
- Conversation.is_active (for filtering active conversations)
- Message.conversation_id (for efficient conversation-specific queries)
- Message.timestamp (for chronological ordering)