/**
 * Room 데이터 모델
 */
export class Room {
  constructor(data) {
    this.roomId = data.roomId;
    this.title = data.title;
    this.description = data.description || '';
    this.createdAt = data.createdAt;
    this.expiresAt = data.expiresAt;
    this.isActive = data.isActive !== undefined ? data.isActive : true;
    this.questionCount = data.questionCount || 0;
  }

  /**
   * 방이 만료되었는지 확인
   */
  isExpired() {
    return new Date() > new Date(this.expiresAt);
  }

  /**
   * 클라이언트로 전송할 공개 데이터만 반환
   */
  toPublicObject() {
    return {
      roomId: this.roomId,
      title: this.title,
      description: this.description,
      createdAt: this.createdAt,
      expiresAt: this.expiresAt,
      isActive: this.isActive,
      questionCount: this.questionCount
    };
  }
}

/**
 * Question 데이터 모델
 */
export class Question {
  constructor(data) {
    this.questionId = data.questionId;
    this.roomId = data.roomId;
    this.question = data.question;
    this.authorName = data.authorName || 'Anonymous';
    this.submittedAt = data.submittedAt;
    this.upvotes = data.upvotes || 0;
    this.isAnswered = data.isAnswered || false;
    this.isVisible = data.isVisible !== undefined ? data.isVisible : true;
  }

  /**
   * 클라이언트로 전송할 공개 데이터만 반환
   */
  toPublicObject() {
    return {
      questionId: this.questionId,
      roomId: this.roomId,
      question: this.question,
      authorName: this.authorName,
      submittedAt: this.submittedAt,
      upvotes: this.upvotes,
      isAnswered: this.isAnswered
    };
  }
}

/**
 * WebSocket Connection 데이터 모델
 */
export class Connection {
  constructor(data) {
    this.connectionId = data.connectionId;
    this.roomId = data.roomId;
    this.connectedAt = data.connectedAt;
    this.ttl = data.ttl;
  }

  /**
   * TTL이 만료되었는지 확인
   */
  isExpired() {
    return Date.now() / 1000 > this.ttl;
  }
}