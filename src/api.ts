import { HttpClient } from '@actions/http-client'

const client = new HttpClient()

function getJSON(url: string) {
  return client
    .get(url)
    .then((res) => res.readBody())
    .then((res) => JSON.parse(res))
}

interface ListResourcesResponse {
  key: string
  lastModified: string
  size: number
  url: string
}

export async function listResources(
  projectId: string,
  version: string
): Promise<ListResourcesResponse[]> {
  return getJSON(`https://api.locize.app/download/${projectId}/${version}`)
}

export async function fetchResource(
  projectId: string,
  version: string,
  language: string,
  namespace: string
): Promise<Record<string, string>> {
  return getJSON(
    `https://api.locize.app/${projectId}/${version}/${language}/${namespace}`
  )
}
