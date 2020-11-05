import { getInput } from '@actions/core'
import { context, getOctokit } from '@actions/github'
import { collectResources } from '../api'
import { getComment, minimizeComment } from '../utils/comments'
import { diffResources } from '../utils/diff'
import { createMessage } from '../utils/message'

export async function runDiff() {
  const projectId = getInput('projectId')
  const leftVersion = getInput('leftVersion')
  const rightVersion = getInput('rightVersion')

  const octokit = getOctokit(getInput('token'))
  const left = await collectResources(projectId, leftVersion)
  const right = await collectResources(projectId, rightVersion)
  const diffs = diffResources(left, right)
  const comment = await getComment()

  if (diffs.length) {
    const req = {
      ...context.repo,
      body: createMessage(diffs),
      issue_number: context.issue.number,
    }

    if (comment) {
      if (comment.body !== req.body) {
        await octokit.issues.updateComment({ ...req, comment_id: comment.id })
      }
    } else {
      await octokit.issues.createComment(req)
    }
  }

  // If the comment exists and there are no longer any diffs, we minimize the
  // comment so it no longer shows in the GitHub UI.
  if (comment && !diffs.length) {
    await minimizeComment(comment.node_id)
  }
}
