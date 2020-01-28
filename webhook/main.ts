import { APIGatewayEvent, Context} from 'aws-lambda'

export function handler(event: APIGatewayEvent, _: Context) {
  console.log(event.body)
}
