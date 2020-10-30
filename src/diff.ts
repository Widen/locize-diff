import { getInput } from '@actions/core'
import { ResourceCollection } from './types'

interface ResourceDiff {
  key: string
  diffs: Record<string, { left: string; right: string }>
}

function getKeys(left: ResourceCollection, right: ResourceCollection) {
  const keys = Object.keys(right.resources)

  // When including deleted keys, we need to also include the keys from the left
  // side of the comparison. Otherwise, we only include keys from the right side.
  if (getInput('ignoreDeletedKeys') !== 'true') {
    keys.push(...Object.keys(left.resources))
  }

  return keys
}

function diffCollection(
  left: ResourceCollection,
  right: ResourceCollection
): ResourceDiff {
  const diffs = getKeys(left, right)
    .filter((key) => left.resources[key] !== right.resources[key])
    .reduce((acc, key) => {
      acc[key] = {
        left: left.resources[key],
        right: right.resources[key],
      }

      return acc
    }, {} as ResourceDiff['diffs'])

  return { key: left.key, diffs }
}

export function diffResources(
  left: ResourceCollection[],
  right: ResourceCollection[]
): ResourceDiff[] {
  return left.map((leftItem) =>
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    diffCollection(leftItem, right.find((item) => leftItem.key === item.key)!)
  )
}
