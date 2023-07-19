const { Client } = require('@elastic/elasticsearch');

const mappings = {
  dynamic: 'false',
  properties: {
    body_content: {
      type: 'text',
      term_vector: 'with_positions_offsets',
      analyzer: 'partial_match_analyzer',
      fields: {
        raw: {
          type: 'keyword',
        },
      },
    },
    id: {
      type: 'keyword',
    },
    date: {
      type: 'date',
    },
    tags: {
      type: 'text',
      term_vector: 'with_positions_offsets',
      analyzer: 'partial_match_analyzer',
      fields: {
        raw: {
          type: 'keyword',
        },
      },
    },
    title: {
      type: 'text',
      term_vector: 'with_positions_offsets',
      analyzer: 'partial_match_analyzer',
      fields: {
        raw: {
          type: 'keyword',
        },
      },
    },
    summary: {
      type: 'text',
      term_vector: 'with_positions_offsets',
      analyzer: 'partial_match_analyzer',
      fields: {
        raw: {
          type: 'keyword',
        },
      },
    },
    url: {
      type: 'text',
      fields: {
        raw: {
          type: 'keyword',
        },
      },
    },
    url_host: {
      type: 'text',
      fields: {
        raw: {
          type: 'keyword',
        },
      },
    },
    url_path: {
      type: 'text',
      fields: {
        raw: {
          type: 'keyword',
        },
      },
    },
    url_path_dir1: {
      type: 'text',
      fields: {
        raw: {
          type: 'keyword',
        },
      },
    },
    url_path_dir2: {
      type: 'text',
      fields: {
        raw: {
          type: 'keyword',
        },
      },
    },
    url_path_dir3: {
      type: 'text',
      fields: {
        raw: {
          type: 'keyword',
        },
      },
    },
    url_port: {
      type: 'text',
      fields: {
        raw: {
          type: 'keyword',
        },
      },
    },
  },
};

const settings = {
  index: {
    number_of_shards: 1,
    number_of_replicas: 1,
    max_ngram_diff: 5,
  },
  analysis: {
    analyzer: {
      partial_match_analyzer: {
        tokenizer: 'ngram_tokenizer',
        filter: ['lowercase'],
      },
    },
    tokenizer: {
      ngram_tokenizer: {
        type: 'ngram',
        min_gram: 2,
        max_gram: 6,
      },
    },
  },
};

const client = new Client({
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

function getCurrentDate(): string {
  const now = new Date();
  const year = now.getFullYear().toString().substr(-2);
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const day = now.getDate().toString().padStart(2, '0');
  return `${year}${month}${day}`;
}

(async () => {
  const { allBlogs } = await import('../.contentlayer/generated/index.mjs');
  const { execa } = await import('execa');

  const index = `site-search-dev-blog-${getCurrentDate()}-${
    process.env.GITHUB_SHA ? process.env.GITHUB_SHA.substr(0, 8) : 'unknown'
  }`;

  try {
    await client.indices.create({
      index,
      mappings,
      settings,
    });
  } catch (e) {
    if (!e.message.includes('resource_already_exists_exception')) {
      throw e;
    }
  }

  allBlogs.forEach(async (blog) => {
    const body = blog.body.raw.replace(/<\/?[^>]+(>|$)/g, '');
    const process = execa('pandoc', ['-f', 'markdown', '-t', 'plain', '--wrap=none']);
    process.stdin.write(body);
    process.stdin.end();
    const result = await process;

    const url = new URL(blog.url);
    await client.index({
      index,
      id: `blog/${blog.slug}`,
      body: {
        body_content: result.stdout,
        id: blog.path,
        published_time: blog.date,
        tags: blog.tags,
        title: blog.title,
        url: blog.url,
        url_host: url.host,
        url_path: url.pathname,
        url_path_dir1: url.pathname.split('/')[1],
        url_path_dir2: url.pathname.split('/')[2],
        url_path_dir3: url.pathname.split('/')[3],
      },
    });
  });

  await client.indices.updateAliases({
    actions: [
      {
        remove: {
          index: '*',
          alias: 'site-search-dev-blog',
        },
      },
      {
        add: {
          index,
          alias: 'site-search-dev-blog',
        },
      },
    ],
  });
})();
