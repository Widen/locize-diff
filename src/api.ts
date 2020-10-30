import { HttpClient } from '@actions/http-client'

const client = new HttpClient()

interface FetchResourcesRequest {
  projectId: string
  version: string
  language: string
  namespace: string
}

export async function fetchResources({
  projectId,
  version,
  language,
  namespace,
}: FetchResourcesRequest): Promise<Record<string, string>> {
  const url = `https://api.locize.app/${projectId}/${version}/${language}/${namespace}`

  return client
    .get(url)
    .then((res) => res.readBody())
    .then((res) => JSON.parse(res))
}
