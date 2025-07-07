# API Documentation

## HTTP API Endpoints

### POST /rooms
방을 생성합니다.

**Request Body:**
```json
{
  "title": "회의 제목",
  "description": "회의 설명 (선택사항)",
  "duration": 3600
}
```

**Response:**
```json
{
  "message": "Room created successfully",
  "room": {
    "roomId": "uuid",
    "title": "회의 제목",
    "description": "회의 설명",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "expiresAt": "2024-01-01T01:00:00.000Z"
  }
}
```

### POST /questions
질문을 제출합니다.

**Request Body:**
```json
{
  "roomId": "room-uuid",
  "question": "질문 내용",
  "authorName": "작성자명 (선택사항)"
}
```

**Response:**
```json
{
  "message": "Question submitted successfully",
  "question": {
    "questionId": "uuid",
    "roomId": "room-uuid",
    "question": "질문 내용",
    "authorName": "Anonymous",
    "submittedAt": "2024-01-01T00:00:00.000Z",
    "upvotes": 0
  }
}
```

## WebSocket API

### Connection
```
wss://your-api-id.execute-api.region.amazonaws.com/stage?roomId=room-uuid
```

### Messages

#### Ping
```json
{
  "action": "ping"
}
```

#### Join Room
```json
{
  "action": "joinRoom",
  "data": {
    "roomId": "room-uuid"
  }
}
```

## DynamoDB Tables

### slido-rooms
방 정보를 저장합니다.
- `roomId` (String, Primary Key)
- `title` (String)
- `description` (String)
- `createdAt` (String, ISO 8601)
- `expiresAt` (String, ISO 8601)
- `isActive` (Boolean)
- `questionCount` (Number)

### slido-questions
질문 정보를 저장합니다.
- `questionId` (String, Primary Key)
- `roomId` (String, GSI)
- `question` (String)
- `authorName` (String)
- `submittedAt` (String, ISO 8601)
- `upvotes` (Number)
- `isAnswered` (Boolean)
- `isVisible` (Boolean)

### slido-connections
WebSocket 연결 정보를 저장합니다.
- `connectionId` (String, Primary Key)
- `roomId` (String)
- `connectedAt` (String, ISO 8601)
- `ttl` (Number, TTL for automatic cleanup)