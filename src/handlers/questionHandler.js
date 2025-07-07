import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { v4 as uuidv4 } from 'uuid';

const client = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(client);

const QUESTIONS_TABLE = process.env.QUESTIONS_TABLE || 'slido-questions';
const ROOMS_TABLE = process.env.ROOMS_TABLE || 'slido-rooms';

export const submitQuestion = async (event, context) => {
  try {
    const body = JSON.parse(event.body || '{}');
    const { roomId, question, authorName } = body;

    if (!roomId || !question) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: 'Room ID and question are required' })
      };
    }

    const questionId = uuidv4();
    const now = new Date();

    const questionItem = {
      questionId,
      roomId,
      question: question.trim(),
      authorName: authorName || 'Anonymous',
      submittedAt: now.toISOString(),
      upvotes: 0,
      isAnswered: false,
      isVisible: true
    };

    // 질문을 데이터베이스에 저장
    await ddbDocClient.send(new PutCommand({
      TableName: QUESTIONS_TABLE,
      Item: questionItem
    }));

    // 방의 질문 카운트 증가
    try {
      await ddbDocClient.send(new UpdateCommand({
        TableName: ROOMS_TABLE,
        Key: { roomId },
        UpdateExpression: 'ADD questionCount :inc',
        ExpressionAttributeValues: {
          ':inc': 1
        }
      }));
    } catch (updateError) {
      console.warn('Failed to update room question count:', updateError);
      // 질문 저장은 성공했으므로 계속 진행
    }

    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: 'Question submitted successfully',
        question: {
          questionId: questionItem.questionId,
          roomId: questionItem.roomId,
          question: questionItem.question,
          authorName: questionItem.authorName,
          submittedAt: questionItem.submittedAt,
          upvotes: questionItem.upvotes
        }
      })
    };
  } catch (error) {
    console.error('Error submitting question:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        message: 'Failed to submit question',
        error: error.message 
      })
    };
  }
};