import { APIGatewayProxyEvent } from 'aws-lambda'
import { IncomingWebhookSendArguments } from '@slack/webhook'

export const parseEvent = (
  event: APIGatewayProxyEvent,
): IncomingWebhookSendArguments | null => {
  const eventJson = JSON.parse(event.body || '')
  // pull_request_review
  if (eventJson.review) {
    return {
      attachments: [
        {
          color: 'good',
          title: eventJson.repository.name,
          title_link: eventJson.repository.html_url, // eslint-disable-line @typescript-eslint/camelcase
          text: 'review',
        },
      ],
    }
  }
  return null
}
