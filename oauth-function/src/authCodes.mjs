import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DeleteCommand, DynamoDBDocumentClient, GetCommand, PutCommand } from '@aws-sdk/lib-dynamodb';
import { randomBytes } from 'crypto';

import { AUTH_CODES_TABLE_NAME, AUTH_CODES_TTL } from './constants.mjs';

const dynamoDbClient = new DynamoDBClient();
const dynamoDbDocumentClient = DynamoDBDocumentClient.from(dynamoDbClient);

const generateCode = () => randomBytes(32).toString('hex');

export const createCode = async (studentId, codeChallenge) => {
  const code = generateCode();

  const now = Math.floor(Date.now() / 1000); //data.now 毫秒时间戳
  const expiration = now + AUTH_CODES_TTL;

  const item = {
    code,
    codeChallenge,
    expiration,
    studentId,
  };

  const putCommand = new PutCommand({
    Item: item,
    TableName: AUTH_CODES_TABLE_NAME,
  });

  try {
    await dynamoDbDocumentClient.send(putCommand);  //数据库里一条都没写进去,不是没写进去,是写进去就删了. 
    console.log('用于测试authCodes', 'Code created successfully:', { code, studentId, tableName: AUTH_CODES_TABLE_NAME });
  } catch (error) {
    console.error('用于测试authCodes', 'Failed to write to DynamoDB:', error);
    throw error;
  }
  return code;
 };

export const deleteCode = (code) => {
  const deleteCommand = new DeleteCommand({
    Key: { code },
    TableName: AUTH_CODES_TABLE_NAME,
  });

  return dynamoDbDocumentClient.send(deleteCommand);
}

export const findCode = async (code) => {
  const getCommand = new GetCommand({
    Key: { code },
    TableName: AUTH_CODES_TABLE_NAME,
  });

  const getCommandOutput = await dynamoDbDocumentClient.send(getCommand);

  if (!getCommandOutput || !getCommandOutput.Item) {
    return null;
  }

  return getCommandOutput.Item;
};
