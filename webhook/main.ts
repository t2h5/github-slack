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
  console.log(JSON.stringify(JSON.parse(event.body || '""'), null, 2))
  if (verifySignature(event)) {
    const message = parseEvent(event)
    if (message) {
      await postSlackMessage(message).catch(err => {
        console.error(err)
      })
    } else {
      console.warn('no message')
    }
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'ok' }),
    }
  } else {
    return {
      statusCode: 401,
      body: JSON.stringify({ message: 'unauthorized' }),
    }
  }
}
