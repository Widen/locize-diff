import { context } from '@actions/github'
import { runCopy } from './copy'
import { runDiff } from './diff'

export function runCommand() {
  const comment = context.payload.comment?.body ?? ''
  const match = comment.match(/@locize\s(diff|copy)/)

  // If the comment is invalid, there is nothing for us to do so we can exit early
  if (!match) return

  switch (match[1]) {
    case 'diff':
      return runDiff()

    case 'copy':
      return runCopy()
  }
}
