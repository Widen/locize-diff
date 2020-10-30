import { ResourceDiff } from './diff'

export function createMessage(diffs: ResourceDiff[]): string {
  return 'Here are the diffs'

  // ## `en-US/translation`

  // | Key | `latest` | `production` |
  // | --- | --- | --- |
  // | accept | Accept | Accepted |
  // | product-history | Product History | Product history |
  // | product-history | Product History | _No value_ |
}
