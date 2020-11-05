jest.mock('@actions/core')
jest.mock('@actions/github')
jest.mock('@actions/http-client')

import { mocks } from '@actions/core'
import { contextMock, createCommentMock } from '@actions/github'
import { runAction } from '../src/runAction'
import { mockFetchResource, mockListResources } from './utils'

beforeEach(() => {
  jest.resetAllMocks()

  contextMock.mockReturnValue({
    eventName: 'pull_request',
    payload: { pull_request: { draft: true } },
    issue: { number: 123 },
  })
  mockListResources((version) => [`projectId/${version}/en-US/translation`])
  mockFetchResource(
    { 'en-US/translation': { foo: 'bar' } },
    { 'en-US/translation': { foo: 'baz' } }
  )
})

it('should not run on draft PRs when includeDrafts is false', async () => {
  mocks.includeDrafts.mockReturnValue('false')
  await runAction()
  expect(createCommentMock).not.toHaveBeenCalled()
})

it('should run on draft PRs when includeDrafts is true', async () => {
  mocks.includeDrafts.mockReturnValue('true')
  await runAction()
  expect(createCommentMock).toHaveBeenCalled()
})
