import { Client } from '@elastic/elasticsearch';

import { allBlogs } from '../.contentlayer/generated/index.mjs';
import { tags } from '../data/tags';
import { siteMetadata } from '../data/site-metadata.js';

const client = new Client({
  cloud: {
    id: 'site-search:dXMtZWFzdC0xLmF3cy5mb3VuZC5pbzo0NDMkMmQwMmRhMTQ5NmIyNDEwODhkZjEzNjc2ZjA4ZTViNjckZGIzZDc2Yzc5YjMwNGM1OTgwYTliZGE3N2NjNTcxNDY=',
  },
  auth: {
    username: 'looker',
    password: process.env.ES_PASSWD,
  },
});

async function run() {
  // ensure that the index exists
  try {
    await client.indices.create({
      index: 'content',
    });
  } catch (e) {
    if (!e.message.includes('resource_already_exists_exception')) {
      throw e;
    }
  }

  // ensure that the mapping is up-to-date
  client.indices.putMapping({
    index: 'content',
    body: {
      properties: {
        title: {
          type: 'text',
          fields: {
            raw: {
              type: 'keyword',
            },
          },
        },
        date: { type: 'date' },
        summary: {
          type: 'text',
          fields: {
            raw: {
              type: 'keyword',
            },
          },
        },
        tags: {
          type: 'text',
          fields: {
            raw: {
              type: 'keyword',
            },
          },
        },
        authors: {
          type: 'text',
          fields: {
            raw: {
              type: 'keyword',
            },
          },
        },
        url: { type: 'text' },
        body: { type: 'text' },
        site: {
          type: 'text',
          fields: {
            raw: {
              type: 'keyword',
            },
          },
        },
        type: {
          type: 'text',
          fields: {
            raw: {
              type: 'keyword',
            },
          },
        },
      },
    },
  });

  // index the tailscale.dev blog documents
  for (const blog of allBlogs) {
    await client.index({
      index: 'content',
      id: blog.slug,
      body: {
        site: 'tailscale.dev',
        type: 'blog',
        title: blog.title,
        date: blog.date,
        summary: blog.summary,
        tags: blog.tags.map((tag) => tags[tag] || tag),
        url: `${siteMetadata.siteUrl}/${blog.path}`,
        body: blog.body.raw,
      },
    });
  }

  // example search

  // search elasticsearch for documents with the word "tailscale" in the title and the body, but weight the title higher
  const response = await client.search({
    index: 'content',
    from: 0, // pagination
    size: 20,
    body: {
      highlight: {
        fields: {
          title: {},
          body: {},
          summary: {},
        },
      },
      query: {
        bool: {
          should: [
            {
              match: {
                title: {
                  query: 'tailscale',
                  boost: 2,
                },
              },
            },
            {
              match: {
                body: 'tailscale',
              },
            },
          ],
        },
      },
      aggs: {
        tags: {
          terms: {
            field: 'tags.raw',
          },
        },
        site: {
          terms: {
            field: 'site.raw',
          },
        },
        type: {
          terms: {
            field: 'type.raw',
          },
        },
      },
    },
  });

  console.log('aggregations', JSON.stringify(response.aggregations, null, 2));
  console.log('results', JSON.stringify(response.hits.hits, null, 2));
}

run();

// satisfies isolatedModules
export {};
