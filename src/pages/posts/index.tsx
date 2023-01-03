import Head from 'next/head'
import { createClient } from '../../services/prismic'
import styles from './styles.module.scss'
import type { GetStaticPropsContext } from 'next'

import { RichText } from 'prismic-dom'
import Link from 'next/link'
import { useSession } from 'next-auth/react'

interface Post {
  slug: string
  title: string
  excerpt: string
  updatedAt: string
}

interface PostProps {
  posts: Post[]
}

const Posts = ({ posts }: PostProps) => {
  const { data: session } = useSession()
  const path = session?.activeSubscription ? `/posts` : `/posts/preview`

  return (
    <>
      <Head>
        <title>dev.news - Posts</title>
      </Head>
      <main className={styles.container}>
        <div className={styles.posts}>
          {posts.map((post) => (
            <Link key={post.slug} href={`${path}/${post.slug}`}>
              <time>{post.updatedAt}</time>
              <strong>{post.title}</strong>
              <p>{post.excerpt}</p>
            </Link>
          ))}
        </div>
      </main>
    </>
  )
}

export default Posts

export async function getStaticProps({ previewData }: GetStaticPropsContext) {
  const client = createClient({ previewData })

  const response = await client.getByType('post', {
    fetch: ['post.title', 'post.content', 'post.published'],
    pageSize: 100,
  })

  const posts = response.results.map((post) => {
    return {
      slug: post.uid,
      title: RichText.asText(post.data.title),
      excerpt:
        post.data.content.find((content) => content.type === 'paragraph')
          ?.text ?? '',
      updatedAt: new Date(post.last_publication_date).toLocaleDateString(
        'pt-BR',
        {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        }
      ),
    }
  })

  return {
    props: {
      posts,
    },
  }
}
