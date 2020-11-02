import { getInput } from '@actions/core'
import { ResourceDiff } from './diff'

export const credits =
  '_Generated by [Locize Diff](https://github.com/Widen/locize-diff)._'

const leftVersion = getInput('leftVersion')
const rightVersion = getInput('rightVersion')

function createDiffRow([key, value]: [string, ResourceDiff['diffs'][number]]) {
  return `| \`${key}\` | ${value.left || ''} | ${value.right || ''} |`
}

function createDiffMessage(diff: ResourceDiff) {
  const rows = Object.entries(diff.diffs)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(createDiffRow)
    .join('\n')

  return `### \`${diff.key}\`

| Key | \`${leftVersion}\` | \`${rightVersion}\` |
| --- | --- | --- |
${rows}`
}

export function createMessage(diffs: ResourceDiff[]) {
  return `Heads up! Looks like there are some differences between your two Locize versions.

${diffs.map(createDiffMessage).join('\n\n')}

${credits}`
}
