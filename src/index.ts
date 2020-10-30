import { getInput, setFailed } from '@actions/core'
import { context } from '@actions/github'

async function main() {
  // Don't run the action on draft PRs
  if (context.payload.pull_request?.draft) {
    return
  }

  try {
    console.log(getInput('projectId'))
    console.log(getInput('leftVersion'))
    console.log(getInput('rightVersion'))
    console.log(getInput('ignoreDeletedKeys'))

    // const octokit = new GitHub(getInput('token'))
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
    // // If the comment exists and the changelog is not missing then the user
    // // must have pushed a commit to add the changelog entry. When this happens
    // // we can hide the now outdated comment.
    // if (comment && !changelogMissing) {
    //   await minimizeComment(comment.node_id)
    // }
  } catch (err) {
    setFailed(err.message)
  }
}

main()
