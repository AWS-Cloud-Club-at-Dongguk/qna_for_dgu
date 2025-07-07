// AWS 리전 설정
export const AWS_REGION = process.env.AWS_REGION || 'ap-northeast-2';

// DynamoDB 테이블 이름
export const TABLES = {
  ROOMS: process.env.ROOMS_TABLE || 'slido-rooms',
  QUESTIONS: process.env.QUESTIONS_TABLE || 'slido-questions',
  CONNECTIONS: process.env.CONNECTIONS_TABLE || 'slido-connections'
};

// WebSocket API 설정
export const WEBSOCKET_CONFIG = {
  STAGE: process.env.STAGE || 'dev',
  DOMAIN: process.env.WEBSOCKET_DOMAIN || 'localhost:3001'
};

// 방 설정
export const ROOM_CONFIG = {
  DEFAULT_DURATION: 3600, // 1시간 (초)
  MAX_DURATION: 24 * 60 * 60, // 24시간 (초)
  MAX_QUESTIONS_PER_ROOM: 1000
};

// CORS 설정
export const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
  'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
  'Content-Type': 'application/json'
};