import { createRoom } from './handlers/roomHandler.js';
import { submitQuestion } from './handlers/questionHandler.js';
import { connectWebSocket, disconnectWebSocket, handleMessage } from './handlers/websocketHandler.js';

// HTTP API 엔드포인트를 위한 통합 핸들러
export const httpHandler = async (event, context) => {
  const { httpMethod, path } = event;
  
  console.log(`HTTP ${httpMethod} ${path}`, JSON.stringify(event, null, 2));

  try {
    // CORS 헤더 설정
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
      'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
      'Content-Type': 'application/json'
    };

    // OPTIONS 요청 처리 (CORS preflight)
    if (httpMethod === 'OPTIONS') {
      return {
        statusCode: 200,
        headers: corsHeaders,
        body: ''
      };
    }

    // 라우팅
    switch (`${httpMethod} ${path}`) {
      case 'POST /rooms':
        return await createRoom(event, context);
      
      case 'POST /questions':
        return await submitQuestion(event, context);
      
      default:
        return {
          statusCode: 404,
          headers: corsHeaders,
          body: JSON.stringify({ message: 'Endpoint not found' })
        };
    }
  } catch (error) {
    console.error('Error in HTTP handler:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        message: 'Internal server error',
        error: error.message 
      })
    };
  }
};

// WebSocket API를 위한 핸들러
export const websocketHandler = async (event, context) => {
  const { requestContext } = event;
  const { routeKey, connectionId } = requestContext;
  
  console.log(`WebSocket ${routeKey} for connection ${connectionId}`, JSON.stringify(event, null, 2));

  try {
    switch (routeKey) {
      case '$connect':
        return await connectWebSocket(event, context);
      
      case '$disconnect':
        return await disconnectWebSocket(event, context);
      
      case '$default':
      default:
        return await handleMessage(event, context);
    }
  } catch (error) {
    console.error('Error in WebSocket handler:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        message: 'Internal server error',
        error: error.message 
      })
    };
  }
};