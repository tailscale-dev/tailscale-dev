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
      size: 20,
      highlight: {
        fragment_size: 300,
        number_of_fragments: 1,
        type: 'plain',
        highlight_query: {
          multi_match: {
            query: q,
            fields: [
              'body_content.prefix^1.0',
              'body_content.stem^1.0',
              'title.prefix^1.0',
              'title.stem^1.0',
              'summary.prefix^1.0',
              'summary.stem^1.0',
            ],
          },
        },
        order: 'score',
        require_field_match: false,
        fields: {
          'body_content.prefix': {
            fragment_size: 150,
            no_match_size: 150,
          },
          'title.prefix': {
            fragment_size: 150,
            no_match_size: 150,
          },
          'summary.prefix': {
            fragment_size: 150,
            no_match_size: 150,
          },
        },
      },
      fields: ['title', 'url', 'tags', 'body_content'],
      query: {
        bool: {
          must: [
            {
              multi_match: {
                query: q,
                fields: [
                  'title^3.0',
                  'title.delimiter^2.4',
                  'title.joined^2.75',
                  'title.prefix^2.6',
                  'title.stem^2.95',
                  'body_content^1.0',
                  'body_content.delimiter^0.4',
                  'body_content.joined^0.75',
                  'body_content.prefix^0.6',
                  'body_content.stem^0.95',
                  'summary^2.0',
                  'summary.delimiter^1.4',
                  'summary.joined^1.75',
                  'summary.prefix^1.6',
                  'summary.stem^1.95',
                ],
                type: 'cross_fields',
                minimum_should_match: '1<-1 3<49%',
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
      if (post === null) {
        // XXX(Xe): This should never happen, but sometimes it can when you have an old tree
        // checked out locally. We should probably do something better here, but this will
        // work for now.
        return;
      }

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
