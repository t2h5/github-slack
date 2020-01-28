import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Handler,
} from 'aws-lambda'
import { createHmac } from 'crypto'

const verifySignature = (event: APIGatewayProxyEvent): boolean => {
  const webhookSecret = process.env.WEBHOOK_SECRET
  if (!webhookSecret) {
    console.warn('webhook secret not found')
    return false
  }
  const signature = event.headers['X-Hub-Signature']
  if (!signature) {
    console.warn('signature not found in request header')
    return false
  }
  const expectedSignature = `sha1=${createHmac('sha1', webhookSecret).update(
    event.body || '',
  ).digest('hex')}`
  if (signature != expectedSignature) {
    console.warn('invalid signature')
    return false
  }
  return true
}

export const handler: Handler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  console.log(event.body)
  if (verifySignature(event)) {
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
}
