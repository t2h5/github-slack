import { IncomingWebhook, IncomingWebhookSendArguments } from '@slack/webhook'

const slackWebhookUrl = process.env.SLACK_WEBHOOK_URL || ''
const slackWebhook = new IncomingWebhook(slackWebhookUrl)

export const postSlackMessage = async (
  message: IncomingWebhookSendArguments,
): Promise<boolean> => {
  return await slackWebhook
    .send(message)
    .then(() => {
      return true
    })
    .catch(err => {
      console.error(err)
      return false
    })
}
