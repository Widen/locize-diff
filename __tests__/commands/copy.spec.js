jest.mock('@actions/core')
jest.mock('@actions/github')
jest.mock('@actions/http-client')

import {
  contextMock,
  createCommentMock,
  updateCommentMock,
  listCommentsMock,
  prComment,
} from '@actions/github'
import { putMock } from '@actions/http-client'
import { runAction } from '../../src/runAction'
import { mockFetchResource, mockListResources, sampleComment } from '../utils'

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
  expect(putMock).not.toHaveBeenCalled()
  expect(createCommentMock).toHaveBeenCalledTimes(1)
  expect(createCommentMock.mock.calls[0][0].issue_number).toBe(123)
  expect(createCommentMock.mock.calls[0][0].body).toMatchSnapshot()
})

it('should not copy the diffs if they have changed since the last comment', async () => {
  listCommentsMock.mockReturnValue([{ body: sampleComment }])
  mockFetchResource(
    { 'en-US/translation': { foo: 'bar' } },
    { 'en-US/translation': { foo: 'oops' } }
  )

  await runAction()
  expect(putMock).not.toHaveBeenCalled()
  expect(updateCommentMock).toHaveBeenCalledTimes(1)
  expect(updateCommentMock.mock.calls[0][0].issue_number).toBe(123)
  expect(updateCommentMock.mock.calls[0][0].body).toMatchSnapshot()
  expect(createCommentMock).toHaveBeenCalledTimes(1)
  expect(createCommentMock.mock.calls[0][0].issue_number).toBe(123)
  expect(createCommentMock.mock.calls[0][0].body).toMatchInlineSnapshot(
    `"@somebody Looks like the diffs have changed since you lasted checked. Please review the diffs and then run \`@locize-diff copy\` again."`
  )
})

it('should not copy any changes if there are no diffs', async () => {
  mockFetchResource(
    { 'en-US/translation': { foo: 'bar' } },
    { 'en-US/translation': { foo: 'bar' } }
  )

  await runAction()
  expect(putMock).not.toHaveBeenCalled()
  expect(createCommentMock).toHaveBeenCalledTimes(1)
  expect(createCommentMock.mock.calls[0][0].issue_number).toBe(123)
  expect(createCommentMock.mock.calls[0][0].body).toMatchInlineSnapshot(
    `"@somebody I'd like to help, but I didn't find any diffs in Locize to copy. Did you already copy your changes?"`
  )
})

it('should copy changes if the diffs match', async () => {
  listCommentsMock.mockReturnValue([{ body: sampleComment }])
  mockFetchResource(
    { 'en-US/translation': { foo: 'bar' } },
    { 'en-US/translation': { foo: 'baz' } }
  )

  await runAction()
  expect(putMock).toHaveBeenCalled()
  expect(createCommentMock).toHaveBeenCalledTimes(1)
  expect(createCommentMock.mock.calls[0][0].issue_number).toBe(123)
  expect(createCommentMock.mock.calls[0][0].body).toMatchInlineSnapshot()
})
