import { getInput, setFailed } from '@actions/core'
import { context, getOctokit } from '@actions/github'
import { createMessage } from './comments'
import { diffResources } from './diff'
import { collectResources } from './utils'

async function main() {
  const projectId = getInput('projectId')
  const leftVersion = getInput('leftVersion')
  const rightVersion = getInput('rightVersion')
  const includeDrafts = getInput('includeDrafts') !== 'true'

  if (includeDrafts && context.payload.pull_request?.draft) {
    return
  }

  try {
    const octokit = getOctokit(getInput('token'))
    const left = await collectResources(projectId, leftVersion)
    const right = await collectResources(projectId, rightVersion)
    const diffs = diffResources(left, right)

    // const [changelogMissing, comment] = await Promise.all([
    //   await isChangelogMissing(),
    //   await getComment(),
    // ])

    // TODO: Only add when necessary
    if (true) {
      await octokit.issues.createComment({
        ...context.repo,
        body: createMessage(diffs),
        issue_number: context.issue.number,
      })
    }

    // If the comment exists and there are no longer any diffs, we minimize the
    // comment so it no longer shows in the GitHub UI.
    // if (comment && !changelogMissing) {
    //   await minimizeComment(comment.node_id)
    // }
  } catch (err) {
    setFailed(err.message)
  }
}

main()
