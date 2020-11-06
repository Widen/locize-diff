import { context } from '@actions/github'
import { getComment } from '../utils/comments'
import { getDiffs, updateDiffComment } from '../utils/diff'
import { createMessage } from '../utils/message'

export async function runCopy() {
  const diffs = await getDiffs()
  const comment = await getComment()

  if (!diffs.length) {
    return `I'd like to help, but I didn't find any diffs in Locize to copy. Did you already copy your changes?`
  }

  if (!comment) {
    const issueType = context.payload.pull_request ? 'pull request' : 'issue'

    return createMessage(
      diffs,
      `It looks like you haven't checked for diffs in this ${issueType} yet. Please check the diffs in this comment and then run \`@locize-diff copy\` again.`
    )
  }

  const body = createMessage(diffs)

  if (comment.body !== body) {
    await updateDiffComment(comment, body)
    return 'Looks like the diffs have changed since you lasted checked. Please review the diffs and then run `@locize-diff copy` again.'
  }

  throw new Error('copy not implemented')
}
