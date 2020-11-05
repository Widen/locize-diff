import { getInput } from '@actions/core'
import { context, getOctokit } from '@actions/github'
import { runCopy } from './copy'
import { runDiff, DiffResult } from './diff'

async function reportResult<T extends string>(
  result: T,
  messages: Record<T, string>
) {
  const octokit = getOctokit(getInput('token'))
  const body = messages[result]

  await octokit.issues.createComment({
    ...context.repo,
    body,
    issue_number: context.issue.number,
  })
}

export async function runCommand() {
  console.log(context)
  const comment = context.payload.comment?.body ?? ''
  const match = comment.match(/@locize-diff\s(check|copy)/)
  const command = match?.[1]

  switch (command) {
    case 'check': {
      const result = await runDiff()

      return reportResult<DiffResult>(result, {
        'comment-created': '',
        'comment-resolved': '',
        'comment-unresolved': '',
        'comment-updated': '',
        'no-diffs': '',
      })
    }

    case 'copy': {
      return runCopy()
    }
  }
}
