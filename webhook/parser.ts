import { APIGatewayProxyEvent } from 'aws-lambda'
import { IncomingWebhookSendArguments } from '@slack/webhook'

export const parseEvent = (
  event: APIGatewayProxyEvent,
): IncomingWebhookSendArguments | null => {
  const eventJson = JSON.parse(event.body || '')
  // pull_request_review
  if (eventJson.review) {
    const repository = eventJson.repository
    const pullRequest = eventJson.pull_request
    const review = eventJson.review
    let color = ''
    if (review.state === 'approved') color = 'good'
    if (review.state === 'changes_requested') color = 'warning'
    const text = `${review.user.login} ${review.state} pull request`
    const fields = [{ title: pullRequest.title, value: pullRequest.html_url }]
    return {
      attachments: [
        {
          color,
          title: repository.name,
          title_link: repository.html_url, // eslint-disable-line @typescript-eslint/camelcase
          text,
          fields,
        },
      ],
    }
  }
  return null
}
