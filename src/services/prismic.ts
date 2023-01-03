import * as prismic from '@prismicio/client'
import { enableAutoPreviews } from '@prismicio/next'
import type { CreateClientConfig } from '@prismicio/next'

export const repositoryName = prismic.getRepositoryName(
  process.env.PRISMIC_ENDPOINT
)

export function createClient({ previewData, req }: CreateClientConfig = {}) {
  const client = prismic.createClient(repositoryName, {
    accessToken: process.env.PRISMIC_ACCESS_TOKEN,
  })

  enableAutoPreviews({ client, previewData, req })

  return client
}
