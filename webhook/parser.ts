import { APIGatewayProxyEvent } from 'aws-lambda'
import { IncomingWebhookSendArguments } from '@slack/webhook'

export const parseEvent = (
  event: APIGatewayProxyEvent,
): IncomingWebhookSendArguments | null => {
  const eventType = event.headers['X-GitHub-Event']
  console.log(`received ${eventType}`)
  const eventJson = JSON.parse(event.body || '')
  const date = new Date()
  const ts = date.getTime().toString()
  // pull_request
  if (eventType === 'pull_request') {
    // review_requested
    if (eventJson.action === 'review_requested') {
      const repository = eventJson.repository
      const pullRequest = eventJson.pull_request
      const reviewers = pullRequest.requested_reviewers
        .map(reviewer => {
          return reviewer.login
        })
        .join(', ')
      const color = 'good'
      const text = 'review requested'
      const fields = [
        {
          title: pullRequest.title,
          value: pullRequest.html_url,
        },
        {
          title: 'reviewers',
          value: reviewers,
        },
      ]
      return {
        attachments: [
          {
            color,
            title: repository.name,
            title_link: repository.html_url, // eslint-disable-line @typescript-eslint/camelcase
            text,
            fields,
            ts,
          },
        ],
      }
    }
  }
  // pull_request_review
  if (eventType === 'pull_request_review') {
    const pullRequest = eventJson.pull_request
    const review = eventJson.review
    let color = ''
    if (review.state === 'approved') color = 'good'
    if (review.state === 'changes_requested') color = 'warning'
    let text = `${review.user.login} ${review.state} pull request`
    if (review.body) {
      text = [text, review.body].join('\n')
    }
    const fields = [{ title: 'link', value: review.html_url }]
    return {
      attachments: [
        {
          color,
          title: pullRequest.title,
          title_link: pullRequest.html_url, // eslint-disable-line @typescript-eslint/camelcase
          text,
          fields,
          ts,
        },
      ],
    }
  }
  return null
}
