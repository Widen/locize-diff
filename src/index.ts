import { getInput, setFailed } from '@actions/core'
import { context, getOctokit } from '@actions/github'
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
    const diff = diffResources(left, right)

    console.log(diff)

    // const [changelogMissing, comment] = await Promise.all([
    //   await isChangelogMissing(),
    //   await getComment(),
    // ])
    // if (changelogMissing && !comment) {
    //   await octokit.issues.createComment({
    //     ...context.repo,
    //     body: getInput('message'),
    //     issue_number: context.issue.number,
    //   })
    // }
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
