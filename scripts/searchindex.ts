import { allSolutions } from 'contentlayer/generated';

const { Client } = require('@elastic/elasticsearch');

const defaultMapping = {
  type: 'text',
  fields: {
    date: {
      type: 'date',
      format: 'strict_date_time||strict_date',
      ignore_malformed: true,
    },
    delimiter: {
      type: 'text',
      index_options: 'freqs',
      analyzer: 'iq_text_delimiter',
    },
    enum: {
      type: 'keyword',
      ignore_above: 2048,
    },
    float: {
      type: 'double',
      ignore_malformed: true,
    },
    joined: {
      type: 'text',
      index_options: 'freqs',
      analyzer: 'i_text_bigram',
      search_analyzer: 'q_text_bigram',
    },
    location: {
      type: 'geo_point',
      ignore_malformed: true,
      ignore_z_value: false,
    },
    prefix: {
      type: 'text',
      index_options: 'docs',
      analyzer: 'i_prefix',
      search_analyzer: 'q_prefix',
    },
    stem: {
      type: 'text',
      analyzer: 'iq_text_stem',
    },
  },
  index_options: 'freqs',
  analyzer: 'iq_text_base',
};

const mappings = {
  dynamic: 'false',
  properties: {
    id: {
      type: 'keyword',
    },
    body_content: defaultMapping,
    date: defaultMapping,
    tags: defaultMapping,
    title: defaultMapping,
    summary: defaultMapping,
    url: defaultMapping,
    url_host: defaultMapping,
    url_path: defaultMapping,
    url_path_dir1: defaultMapping,
    url_path_dir2: defaultMapping,
    url_path_dir3: defaultMapping,
    url_port: defaultMapping,
  },
};

const settings = {
  index: {
    number_of_shards: 1,
    number_of_replicas: 1,
  },
  analysis: {
    filter: {
      front_ngram: {
        type: 'edge_ngram',
        min_gram: '1',
        max_gram: '12',
      },
      bigram_joiner: {
        max_shingle_size: '2',
        token_separator: '',
        output_unigrams: 'false',
        type: 'shingle',
      },
      bigram_max_size: {
        type: 'length',
        max: '16',
        min: '0',
      },
      'en-stem-filter': {
        name: 'light_english',
        type: 'stemmer',
      },
      bigram_joiner_unigrams: {
        max_shingle_size: '2',
        token_separator: '',
        output_unigrams: 'true',
        type: 'shingle',
      },
      delimiter: {
        split_on_numerics: 'true',
        generate_word_parts: 'true',
        preserve_original: 'false',
        catenate_words: 'true',
        generate_number_parts: 'true',
        catenate_all: 'true',
        split_on_case_change: 'true',
        type: 'word_delimiter_graph',
        catenate_numbers: 'true',
        stem_english_possessive: 'true',
      },
      'en-stop-words-filter': {
        type: 'stop',
        stopwords: '_english_',
      },
    },
    analyzer: {
      i_prefix: {
        filter: ['cjk_width', 'lowercase', 'asciifolding', 'front_ngram'],
        tokenizer: 'standard',
      },
      iq_text_delimiter: {
        filter: [
          'delimiter',
          'cjk_width',
          'lowercase',
          'asciifolding',
          'en-stop-words-filter',
          'en-stem-filter',
        ],
        tokenizer: 'whitespace',
      },
      q_prefix: {
        filter: ['cjk_width', 'lowercase', 'asciifolding'],
        tokenizer: 'standard',
      },
      iq_text_base: {
        filter: ['cjk_width', 'lowercase', 'asciifolding', 'en-stop-words-filter'],
        tokenizer: 'standard',
      },
      iq_text_stem: {
        filter: [
          'cjk_width',
          'lowercase',
          'asciifolding',
          'en-stop-words-filter',
          'en-stem-filter',
        ],
        tokenizer: 'standard',
      },
      i_text_bigram: {
        filter: [
          'cjk_width',
          'lowercase',
          'asciifolding',
          'en-stem-filter',
          'bigram_joiner',
          'bigram_max_size',
        ],
        tokenizer: 'standard',
      },
      q_text_bigram: {
        filter: [
          'cjk_width',
          'lowercase',
          'asciifolding',
          'en-stem-filter',
          'bigram_joiner_unigrams',
          'bigram_max_size',
        ],
        tokenizer: 'standard',
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
      id: blog.slug,
      body: {
        body_content: result.stdout,
        id: blog.path,
        published_time: blog.date,
        tags: blog.tags,
        title: blog.title,
        summary: blog.summary,
        url: blog.url,
        url_host: url.host,
        url_path: url.pathname,
        url_path_dir1: url.pathname.split('/')[1],
        url_path_dir2: url.pathname.split('/')[2],
        url_path_dir3: url.pathname.split('/')[3],
      },
    });
  });

  allSolutions.forEach(async (solution) => {
    const body = solution.body.raw.replace(/<\/?[^>]+(>|$)/g, '');
    const process = execa('pandoc', ['-f', 'markdown', '-t', 'plain', '--wrap=none']);
    process.stdin.write(body);
    process.stdin.end();
    const result = await process;

    const url = new URL(solution.url);
    await client.index({
      index,
      id: `solutions/${solution.slug}`,
      body: {
        body_content: result.stdout,
        id: solution.path,
        published_time: solution.date,
        tags: solution.tags,
        title: solution.title,
        summary: solution.summary,
        url: solution.url,
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
