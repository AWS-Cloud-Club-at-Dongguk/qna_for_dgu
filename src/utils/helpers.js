import { CORS_HEADERS } from '../config/index.js';

/**
 * Lambda 응답 객체를 생성하는 유틸리티 함수
 */
export const createResponse = (statusCode, body, headers = {}) => {
  return {
    statusCode,
    headers: {
      ...CORS_HEADERS,
      ...headers
    },
    body: typeof body === 'string' ? body : JSON.stringify(body)
  };
};

/**
 * 성공 응답 생성
 */
export const successResponse = (data, statusCode = 200) => {
  return createResponse(statusCode, {
    success: true,
    data
  });
};

/**
 * 에러 응답 생성
 */
export const errorResponse = (message, statusCode = 500, error = null) => {
  const body = {
    success: false,
    message
  };
  
  if (error && process.env.NODE_ENV !== 'production') {
    body.error = error.message;
  }
  
  return createResponse(statusCode, body);
};

/**
 * 요청 본문 파싱
 */
export const parseBody = (event) => {
  try {
    return JSON.parse(event.body || '{}');
  } catch (error) {
    throw new Error('Invalid JSON in request body');
  }
};

/**
 * 입력 값 검증
 */
export const validateRequired = (obj, requiredFields) => {
  const missing = requiredFields.filter(field => !obj[field]);
  if (missing.length > 0) {
    throw new Error(`Missing required fields: ${missing.join(', ')}`);
  }
};

/**
 * UUID 형식 검증
 */
export const isValidUUID = (str) => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
};

/**
 * 로그 헬퍼
 */
export const logger = {
  info: (message, data = {}) => {
    console.log(JSON.stringify({ level: 'INFO', message, ...data }));
  },
  error: (message, error = {}) => {
    console.error(JSON.stringify({ level: 'ERROR', message, error: error.message || error }));
  },
  debug: (message, data = {}) => {
    if (process.env.NODE_ENV !== 'production') {
      console.log(JSON.stringify({ level: 'DEBUG', message, ...data }));
    }
  }
};