export const listFilesMock = jest.fn()
export const createCommentMock = jest.fn()
export const listCommentsMock = jest.fn()
export const graphqlMock = jest.fn()

export const getOctokit = () => ({
  graphql: graphqlMock,
  issues: {
    createComment: createCommentMock,
    listComments: () => ({ data: listCommentsMock() ?? [] }),
  },
  pulls: {
    listFiles: () => ({ data: listFilesMock() ?? [] }),
  },
})

export const context = {
  action: 'mskeltontest-action',
  actor: 'mskelton',
  eventName: 'pull_request',
  payload: {
    pull_request: {},
  },
  issue: {
    number: 1,
  },
  ref: 'refs/pull/2/merge',
  sha: 'ebb4992dc72451c1c6c99e1cce9d741ec0b5b7d7',
  workflow: 'CI',
}

export const draftMock = jest.fn()

Object.defineProperty(context.payload.pull_request, 'draft', {
  get: draftMock.mockReturnValue(false),
})
