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
          .map((reviewer) => {
            return reviewer.login
          })
          .join(', ')
        attachment.color = 'good'
        attachment.title = repository.name
        attachment.title_link = repository.html_url
        attachment.text = 'review requested'
        attachment.fields = [
          {
            title: pullRequest.title,
            value: pullRequest.html_url,
          },
          {
            title: 'assigned reviewers',
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
      attachment.title_link = pullRequest.html_url
      attachment.text = `${review.user.login} ${review.state}`
      if (review.body !== null && review.body.length > 0) {
        attachment.text = [attachment.text, review.body].join('\n')
        attachment.fields = [{ title: 'link', value: review.html_url }]
        return { attachments: [attachment] }
      }
      return null
    }
    case 'pull_request_review_comment': {
      const pullRequest = eventJson.pull_request
      const comment = eventJson.comment
      if (eventJson.action === 'created') {
        attachment.title = pullRequest.title
        attachment.title_link = pullRequest.html_url
        attachment.text = `${comment.user.login} commented`
        if (comment.body !== null && comment.body.length > 0) {
          attachment.text = [attachment.text, comment.body].join('\n')
          attachment.fields = [{ title: 'link', value: comment.html_url }]
          return { attachments: [attachment] }
        }
        return null
      }
      break
    }
    default:
      break
  }
  return null
}
