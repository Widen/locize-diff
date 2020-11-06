import { context } from '@actions/github'
import { getComment } from '../utils/comments'
import { getDiffs } from '../utils/diff'
import { createMessage } from '../utils/message'

export async function runCopy() {
  const diffs = await getDiffs()
  const comment = await getComment()

  if (!comment && diffs.length) {
    const issueType = context.payload.pull_request ? 'pull request' : 'issue'

    return createMessage(
      diffs,
      `It looks like you haven't checked for diffs in this ${issueType} yet. Please check the diffs in this comment and then run \`@locize-diff copy\` again.`
    )
  }
}
