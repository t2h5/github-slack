import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Handler,
} from 'aws-lambda'
import { verifySignature } from './auth'

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
