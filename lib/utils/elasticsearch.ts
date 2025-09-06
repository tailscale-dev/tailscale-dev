import { Client } from '@elastic/elasticsearch';

export const client = new Client({
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

export interface RelatedQuery {
  summary: string;
  tags: string[];
  title: string;
}

export interface RelatedArticle {
  title: string;
  url_path: string;
}

export const relatedArticles = async ({
  summary,
  tags,
  title,
}: RelatedQuery): Promise<RelatedArticle[]> => {
  const results = await client.search({
    index: 'site-search-dev-blog',
    from: 0,
    size: 5,
    query: {
      more_like_this: {
        fields: ['summary', 'tags', 'title'],
        like: [summary, title, ...tags],
      },
    },
    fields: ['title', 'url_path'],
    _source: false,
  });

  const articles = results.hits.hits.map((hit) => {
    return {
      title: hit.fields.title[0],
      url_path: hit.fields.url_path[0],
    };
  });

  return articles;
};
