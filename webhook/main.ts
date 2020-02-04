import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Handler,
} from 'aws-lambda'
import { verifySignature } from './auth'
import { parseEvent } from './parser'
import { postSlackMessage } from './slack'

export const handler: Handler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  console.log(event.body)
  if (verifySignature(event)) {
    const message = parseEvent(event)
    if (message) {
      await postSlackMessage(message).catch(err => {
        console.error(err)
      })
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'ok' }),
      }
    } else {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'not ok' }),
      }
    }
  } else {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'not ok' }),
    }
  }
}
