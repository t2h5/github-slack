import {APIGatewayProxyEvent, Context, APIGatewayProxyResult, Handler} from 'aws-lambda'

export const handler: Handler = async (event: APIGatewayProxyEvent, _context: Context): Promise<APIGatewayProxyResult> => {
  console.log(event)
  return {
    statusCode: 200,
    body: JSON.stringify({ message: "ok", })
  }
}
