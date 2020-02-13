import { APIGatewayProxyEvent } from 'aws-lambda'
import { MessageAttachment } from '@slack/types'
import { IncomingWebhookSendArguments } from '@slack/webhook'

export const parseEvent = (
  event: APIGatewayProxyEvent,
): IncomingWebhookSendArguments | null => {
  const eventType = event.headers['X-GitHub-Event']
  console.log(`received ${eventType}`)
  const eventJson = JSON.parse(event.body || '')
  const date = new Date()
  const ts = date.getTime().toString()
  const attachment: MessageAttachment = { color: '', ts }
  switch (eventType) {
    case 'pull_request': {
      const repository = eventJson.repository
      const pullRequest = eventJson.pull_request
      // review_requested
      if (eventJson.action === 'review_requested') {
        const reviewers = pullRequest.requested_reviewers
          .map(reviewer => {
            return reviewer.login
          })
          .join(', ')
        attachment.color = 'good'
        attachment.title = repository.name
        attachment.title_link = repository.html_url // eslint-disable-line @typescript-eslint/camelcase
        attachment.text = 'review requested'
        attachment.fields = [
          {
            title: pullRequest.title,
            value: pullRequest.html_url,
          },
          {
            title: 'reviewers',
            value: reviewers,
          },
        ]
        return { attachments: [attachment] }
      }
      break
    }
    case 'pull_request_review': {
      const pullRequest = eventJson.pull_request
      const review = eventJson.review
      if (review.state === 'approved') attachment.color = 'good'
      if (review.state === 'changes_requested') attachment.color = 'warning'
      attachment.title = pullRequest.title
      attachment.title_link = pullRequest.html_url // eslint-disable-line @typescript-eslint/camelcase
      attachment.text = `${review.user.login} ${review.state} pull request`
      if (review.body) {
        attachment.text = [attachment.text, review.body].join('\n')
      }
      attachment.fields = [{ title: 'link', value: review.html_url }]
      return { attachments: [attachment] }
    }
    default:
      break
  }
  return null
}
