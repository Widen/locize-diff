import { getInput } from '@actions/core'
import { context, getOctokit } from '@actions/github'
import {
  createComment,
  getComment,
  minimizeComment,
  runGraphql,
  unminimizeComment,
} from '../utils/comments'
import { getDiffs } from '../utils/diff'
import { createMessage } from '../utils/message'

const messages = {
  commentMinimized:
    'Looks like there are no longer any diffs, so I went ahead and resolved the outdated comment.',
  commentUpdated:
    'I found some new diffs since the last time I checked. Take a look at the comment to see what changed.',
  noDiffs:
    "Good news! I didn't find any diffs so everything in Locize is up to date!",
}

export async function runDiff() {
  const octokit = getOctokit(getInput('token'))
  const diffs = await getDiffs()
  const comment = await getComment()

  if (diffs.length) {
    const body = createMessage(diffs)

    if (comment) {
      if (comment.body !== body) {
        await runGraphql(unminimizeComment, comment.node_id)
        await octokit.issues.updateComment({
          ...context.repo,
          body,
          issue_number: context.issue.number,
          comment_id: comment.id,
        })

        return messages.commentUpdated
      }
    } else {
      await createComment(body)
      return
    }
  }

  // If the comment exists and there are no longer any diffs, we minimize the
  // comment so it no longer shows in the GitHub UI.
  if (comment) {
    await runGraphql(minimizeComment, comment.node_id)
    return messages.commentMinimized
  }

  return messages.noDiffs
}
