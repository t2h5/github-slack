# webhook

1. receive GitHub Repository webhooks
    - https://developer.github.com/v3/activity/events/types/
2. send notification to Slack using Incoming Webhooks
    - https://api.slack.com/messaging/webhooks

## setup

Install dependencies using yarn.

```bash
$ yarn install
```

Create `config.yml`.

```yaml
aws_profile:       # aws profile name
webhook_secret:    # see https://developer.github.com/webhooks/securing/
slack_webhook_url: # see https://api.slack.com/incoming-webhooks
```

Deploy Lambda function using [serverless](https://serverless.com/).

```sh
$ yarn deploy
# aws resouces will be created or updated
```

## add webhook

Open your repository Settings > Webhooks > Add webhook.

- Payload URL: API Gateway endpoint
- Content Type: `application/json`
- Secret: your `webhook_secret`
- Events: select events as you wish
  - see `parser.ts` for available events
