const { Client } = require('@elastic/elasticsearch');
const dotenv = require('dotenv');

dotenv.config({ path: '.env.elastic' }); // ignore errors

const mappings = {
  dynamic: 'false',
  properties: {
    body_content: {
      type: 'text',
      term_vector: 'with_positions_offsets',
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
      fields: {
        raw: {
          type: 'keyword',
        },
      },
    },
    title: {
      type: 'text',
      fields: {
        raw: {
          type: 'keyword',
        },
      },
    },
    summary: {
      type: 'text',
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
  sniffOnStart: true,
});

function getCurrentDate(): string {
  const now = new Date();
  const year = now.getFullYear().toString().substr(-2);
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const day = now.getDate().toString().padStart(2, '0');
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  return `${month}${year}${day}${hours}${minutes}`;
}

(async () => {
  const { allBlogs } = await import('../.contentlayer/generated/index.mjs');
  const { execa } = await import('execa');

  const index = `site-search-dev-blog-${getCurrentDate()}`;

  try {
    await client.indices.create({
      index,
    });
  } catch (e) {
    if (!e.message.includes('resource_already_exists_exception')) {
      throw e;
    }
  }

  await client.indices.putMapping({
    index,
    body: mappings,
  });

  allBlogs.forEach(async (blog) => {
    const body = blog.body.raw.replace(/<\/?[^>]+(>|$)/g, '');
    const process = execa('pandoc', ['-f', 'markdown', '-t', 'plain', '--wrap=none']);
    process.stdin.write(body);
    process.stdin.end();
    const result = await process;

    const url = new URL(blog.url);
    await client.index({
      index,
      id: blog.slug,
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

  const actions: unknown[] = [
    {
      add: {
        index: index,
        alias: 'site-search-dev-blog',
      },
    },
  ];

  try {
    const aliasMeta = await client.indices.resolveIndex({
      name: 'site-search-dev-blog',
    });
    console.log(aliasMeta);
    aliasMeta.aliases[0].indices.forEach((iindex) => {
      if (iindex == index) {
        return;
      }
      actions.push({
        remove: {
          index: iindex,
          alias: 'site-search-dev-blog',
        },
      });
    });
  } catch (e) {
    if (!e.message.includes('index_not_found_exception')) {
      throw e;
    }
  }

  console.log(actions);
  await client.indices.updateAliases({ actions });
})();
