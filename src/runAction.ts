import { getInput, setFailed } from '@actions/core'
import { context } from '@actions/github'
import { runCommand } from './commands'
import { runDiff } from './commands/diff'

export async function runAction() {
  const includeDrafts = getInput('includeDrafts') === 'true'

  try {
    if (context.eventName === 'issue_comment') {
      return runCommand()
    }

    if (includeDrafts || !context.payload.pull_request?.draft) {
      await runDiff()
    }
  } catch (err) {
    setFailed(err.message)
  }
}
