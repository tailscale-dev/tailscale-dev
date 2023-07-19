import { Client as ESClient } from '@elastic/elasticsearch';
import { allAuthors, allBlogs, Authors } from 'contentlayer/generated';

const idToPost = (id: string) => allBlogs.find((p) => p.slug === id) || null;

const authorFromHandle = (handle: string) => allAuthors.find((a) => a.slug === handle) || null;

const client = new ESClient({
  node: {
    url: new URL(process.env.ELASTIC_URL),
  },
  auth: {
    username: process.env.ELASTIC_USERNAME,
    password: process.env.ELASTIC_PASSWORD,
  },
  maxRetries: 5,
  requestTimeout: 60000,
});

export interface AuthorView {
  slug: string;
  avatar: string;
  name: string;
}

const authorToView = (author: Authors) => ({
  slug: author.slug,
  avatar: author.avatar,
  name: author.name,
});

export interface SearchResult {
  id: string;
  title: string;
  description: string;
  permalink: string;
  score: number;
  tags: string[];
  summary: string;
  date: string;
  authors: AuthorView[];
}

export interface SearchResponse {
  status: string;
  error?: string;
  query: string;
  data: SearchResult[];
}

export default async function handler(req, resp) {
  const { q } = req.query;
  const data: SearchResult[] = [];

  try {
    const results = await client.search({
      index: 'site-search-dev-blog',
      from: 0,
      size: 10,
      highlight: {
        pre_tags: ['<em>'],
        post_tags: ['</em>'],
        require_field_match: false,
        fields: {
          body_content: {
            fragment_size: 200,
            number_of_fragments: 1,
          },
        },
      },
      fields: ['title', 'url', 'tags', 'body_content'],
      query: {
        bool: {
          should: [
            {
              match: {
                title: {
                  query: q,
                  boost: 2,
                },
              },
            },
            {
              match: {
                body_content: {
                  query: q,
                  boost: 1,
                },
              },
            },
            {
              match: {
                tags: q,
              },
            },
          ],
        },
      },
      _source: false,
    });

    results.hits.hits.forEach((hit) => {
      const desc = (() => {
        if (hit.highlight && hit.highlight['body_content']) {
          return hit.highlight.body_content[0];
        } else {
          return hit.fields.body_content[0].substr(0, 200);
        }
      })();

      const post = idToPost(hit._id);
      const authors = post?.authors
        ? post?.authors.map((a) => authorFromHandle(a))
        : [authorFromHandle('default')];

      data.push({
        id: hit._id,
        title: hit.fields.title[0],
        summary: post?.summary,
        description: desc,
        date: new Date(post?.date).toISOString().substr(0, 10),
        permalink: hit.fields.url[0],
        score: hit._score,
        tags: hit.fields.tags,
        authors: authors.map((a) => authorToView(a)),
      });
    });
  } catch (e) {
    console.error(e);
    resp.status(500).json({ status: 'error', error: e.message });
    return;
  }

  resp.status(200).json({ status: 'ok', query: q, data });
}
