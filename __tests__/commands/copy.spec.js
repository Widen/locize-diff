jest.mock('@actions/core')
jest.mock('@actions/github')
jest.mock('@actions/http-client')

import { contextMock, createCommentMock, prComment } from '@actions/github'
import { putMock } from '@actions/http-client'
import { runAction } from '../../src/runAction'
import { mockFetchResource, mockListResources } from '../utils'

beforeEach(() => {
  jest.resetAllMocks()
  contextMock.mockReturnValue(prComment('@locize-diff copy'))
  mockListResources((version) => [`projectId/${version}/en-US/translation`])
})

it("should display the diff without copying if the user hasn't run the diff yet", async () => {
  mockFetchResource(
    { 'en-US/translation': { foo: 'bar' } },
    { 'en-US/translation': { foo: 'baz' } }
  )

  await runAction()
  expect(createCommentMock).toHaveBeenCalledTimes(1)
  expect(createCommentMock.mock.calls[0][0].issue_number).toBe(123)
  expect(createCommentMock.mock.calls[0][0].body).toMatchSnapshot()
  expect(putMock).not.toHaveBeenCalled()
})
