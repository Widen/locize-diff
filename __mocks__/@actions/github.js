export const listFilesMock = jest.fn()
export const createCommentMock = jest.fn()
export const updateCommentMock = jest.fn()
export const listCommentsMock = jest.fn()
export const graphqlMock = jest.fn()

const wrapResponse = () => async () => ({
  data: listCommentsMock() ?? [],
})

export const getOctokit = () => ({
  graphql: graphqlMock,
  issues: {
    createComment: createCommentMock,
    listComments: wrapResponse(listCommentsMock),
    updateComment: updateCommentMock,
  },
  pulls: {
    listFiles: wrapResponse(listFilesMock),
  },
})

export const pr = {
  payload: {
    pull_request: {
      draft: false,
    },
  },
  issue: {
    number: 123,
  },
}

export const issueComment = {
  issue: {
    id: 444500041,
    node_id: 'MDU6SXNzdWU0NDQ1MDAwNDE=',
    number: 1,
  },
  comment: {
    id: 492700400,
    node_id: 'MDEyOklzc3VlQ29tbWVudDQ5MjcwMDQwMA==',
    body: "You are totally right! I'll get this fixed right away.",
  },
}

export const contextMock = jest.fn()
export const context = new Proxy(
  {},
  { get: (_, property) => contextMock()[property] }
)
