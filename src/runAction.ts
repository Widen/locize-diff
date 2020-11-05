import { getInput, setFailed } from '@actions/core'
import { context } from '@actions/github'
import { runCommand } from './commands'
import { runDiff } from './commands/diff'

export async function runAction() {
  try {
    if (context.eventName === 'issue_comment') {
      await runCommand()
    }

    const includeDrafts = getInput('includeDrafts') !== 'true'
    if (includeDrafts || !context.payload.pull_request?.draft) {
      await runDiff()
    }
  } catch (err) {
    console.log(err)
    setFailed(err.message)
  }
}
